
const DB = (function () {
  "use strict";

  const APP_NAME = "LPU Alumni Connect";
  const VERSION = 1;
  const PREFIX = "lpu_";
  const SESSION_KEY = "lpu_session";
  const RESUME_PREFIX = "lpu_resume_";
  const LIMIT_KB = 5120;

  const KEYS = {
    users: "lpu_users",
    requests: "lpu_requests",
    eventRegs: "lpu_event_regs",
    savedJobs: "lpu_saved_jobs",
    referrals: "lpu_referrals"
  };

  function readJSON(store, key, fallback) {
    try {
      const raw = store.getItem(key);

      if (raw === null) return fallback;

      const value = JSON.parse(raw);

      return value === null ? fallback : value;
    } catch (e) {
      return fallback;
    }
  }

  function writeJSON(store, key, value) {
    try {
      store.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  }

  function available() {
    try {
      const testKey = "lpu__test";

      localStorage.setItem(testKey, "1");
      localStorage.removeItem(testKey);

      return true;
    } catch (e) {
      return false;
    }
  }

  function keyFor(name) {
    if (!KEYS[name]) {
      throw new Error("DB: unknown collection '" + name + "'");
    }

    return KEYS[name];
  }

  function storedKeys() {
    const keys = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key && key.startsWith(PREFIX)) {
        keys.push(key);
      }
    }

    return keys;
  }

  function all(name) {
    const list = readJSON(localStorage, keyFor(name), []);

    return Array.isArray(list) ? list : [];
  }

  function save(name, list) {
    if (!Array.isArray(list)) return false;

    return writeJSON(localStorage, keyFor(name), list);
  }

  function add(name, item) {
    const list = all(name);

    list.push(item);

    return save(name, list) ? item : null;
  }

  function find(name, test) {
    return all(name).find(test);
  }

  function filter(name, test) {
    return all(name).filter(test);
  }

  function removeWhere(name, test) {
    const list = all(name);

    const kept = list.filter((item) => !test(item));

    save(name, kept);

    return list.length - kept.length;
  }

  function updateWhere(name, test, changes) {
    const list = all(name);

    let count = 0;

    list.forEach((item) => {
      if (test(item)) {
        Object.assign(item, changes);
        count++;
      }
    });

    if (count > 0) {
      save(name, list);
    }

    return count;
  }

  function newId(prefix) {
    return prefix +
      Date.now().toString(36) +
      Math.random().toString(36).slice(2, 6);
  }

  // Session management
  const session = {
    get() {
      return readJSON(localStorage, SESSION_KEY, null) ||
        readJSON(sessionStorage, SESSION_KEY, null);
    },

    set(user, remember) {
      localStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_KEY);

      const data = {
        role: user.role,
        name: user.name,
        id: user.id
      };

      return writeJSON(
        remember ? localStorage : sessionStorage,
        SESSION_KEY,
        data
      );
    },

    clear() {
      localStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_KEY);
    }
  };

  // Resume tracking
  const checks = {
    get(userId) {
      const ids = readJSON(
        localStorage,
        RESUME_PREFIX + userId,
        []
      );

      return Array.isArray(ids) ? ids : [];
    },

    set(userId, ids) {
      return writeJSON(
        localStorage,
        RESUME_PREFIX + userId,
        ids
      );
    },

    clear(userId) {
      localStorage.removeItem(RESUME_PREFIX + userId);
    },

    all() {
      return storedKeys()
        .filter((key) => key.startsWith(RESUME_PREFIX))
        .map((key) => {
          const ids = readJSON(localStorage, key, []);

          return {
            userId: key.slice(RESUME_PREFIX.length),
            count: Array.isArray(ids) ? ids.length : 0,
            ids: Array.isArray(ids) ? ids : []
          };
        });
    }
  };

  // Export all application data
  function exportAll() {
    const data = {};

    storedKeys()
      .filter((key) => key !== SESSION_KEY)
      .forEach((key) => {
        data[key] = readJSON(localStorage, key, null);
      });

    return {
      app: APP_NAME,
      version: VERSION,
      exportedAt: new Date().toISOString(),
      data: data
    };
  }

  // Import application backup
  function importAll(payload) {
    if (
      !payload ||
      payload.app !== APP_NAME ||
      typeof payload.data !== "object" ||
      payload.data === null ||
      Array.isArray(payload.data)
    ) {
      return {
        ok: false,
        message: "This file is not a valid LPU Alumni Connect backup."
      };
    }

    const allowed = Object.keys(KEYS).map(
      (name) => KEYS[name]
    );

    let imported = 0;

    Object.keys(payload.data).forEach((key) => {
      const known =
        allowed.includes(key) ||
        key.startsWith(RESUME_PREFIX);

      const value = payload.data[key];

      if (
        known &&
        Array.isArray(value) &&
        writeJSON(localStorage, key, value)
      ) {
        imported++;
      }
    });

    return {
      ok: true,
      message: "Backup imported: " +
        imported +
        " collections restored.",
      imported: imported
    };
  }

  // Reset application data
  function reset() {
    storedKeys().forEach((key) => {
      localStorage.removeItem(key);
    });

    sessionStorage.removeItem(SESSION_KEY);

    return true;
  }

  // Calculate LocalStorage usage
  function usage() {
    let chars = 0;

    storedKeys().forEach((key) => {
      chars += key.length +
        (localStorage.getItem(key) || "").length;
    });

    const counts = {};

    Object.keys(KEYS).forEach((name) => {
      counts[name] = all(name).length;
    });

    const kb = Math.round(chars / 1024 * 10) / 10;

    const percent = Math.min(
      100,
      Math.round(kb / LIMIT_KB * 1000) / 10
    );

    return {
      chars: chars,
      kb: kb,
      limitKb: LIMIT_KB,
      percent: percent,
      counts: counts
    };
  }

  // Check LocalStorage availability
  if (!available()) {
    console.warn(
      "LPU Alumni Connect: LocalStorage is unavailable."
    );
  }

  // Public database functions
  return {
    VERSION: VERSION,
    KEYS: KEYS,

    available: available,

    all: all,
    save: save,
    add: add,
    find: find,
    filter: filter,

    removeWhere: removeWhere,
    updateWhere: updateWhere,
    newId: newId,

    session: session,
    checks: checks,

    exportAll: exportAll,
    importAll: importAll,
    reset: reset,
    usage: usage
  };

})();
