LPU Alumni Connect

A College Alumni Mentorship and Career Guidance System built for Lovely Professional University (LPU). The platform connects current students with alumni who can offer mentorship, career guidance, events and job referrals.

This is a frontend-only student project (Project G4), built with HTML, CSS and JavaScript. There is no backend; all data is handled on the client side for demonstration purposes.

Table of Contents
Overview
Features
Tech Stack
Project Structure
Getting Started
Pages
Design System
How It Works
Limitations
Future Improvements
Author
Overview

Many students graduate without direct access to people who have already walked the path they want to take. LPU Alumni Connect bridges that gap by giving students a single place to:

Find alumni mentors by company, branch and skills
Request one-to-one guidance sessions
Explore career paths, resume tips and interview preparation
Join alumni talks, workshops and networking events
Discover internships and job openings shared by alumni

Alumni can sign up to share their expertise, host events and post opportunities.

Features
Alumni Mentorship - browse and filter the alumni directory, then request a session
Career Guidance - career paths, roadmaps, resume tips and interview prep
Events and Webinars - talks, workshops and networking events through the year
Jobs and Referrals - internships and openings posted by alumni
Personal Dashboard - track mentorship requests and sessions
Separate Logins - dedicated Student and Alumni login flows
Responsive Layout - works on desktop, tablet and mobile screens
Tech Stack
Layer	Technology
Structure	HTML5
Styling	CSS3 (Flexbox, Grid, variables)
Behaviour	Vanilla JavaScript (ES6)
Icons	Icon library (no emojis used)
Fonts	Web fonts via Google Fonts

No frameworks or backend are required.

Project Structure
lpu-alumni-connect/
|-- index.html            Homepage
|-- login.html            Student and Alumni login
|-- signup.html           Registration
|-- alumni.html           Alumni directory
|-- career-guidance.html  Career paths and resources
|-- events.html           Events and webinars
|-- jobs.html             Jobs and internships
|-- dashboard.html        User dashboard
|-- css/
|   |-- style.css         Global styles
|-- js/
|   |-- main.js           Shared scripts
|-- images/               LPU logo and campus photos
|-- README.md

Adjust this tree to match your final folder layout.

Getting Started
Prerequisites
Any modern web browser (Chrome, Edge, Firefox, Safari)
A code editor such as VS Code (optional, for editing)
Run locally
Download or clone the project:
bash
git clone https://github.com/<your-username>/lpu-alumni-connect.git
Open the project folder.
Open index.html in your browser.

For live reloading, use the Live Server extension in VS Code: right-click index.html and choose Open with Live Server.

Pages
Page	Purpose
Home	Hero section, platform stats, features, how it works, CTA
Login	Split layout: campus photo slideshow and navy login panel
Sign Up	Create a student or alumni account
Alumni Directory	Search and filter mentors
Career Guidance	Roadmaps, resume tips and interview preparation
Events	Upcoming and past alumni events
Jobs	Internships and openings with referral details
Dashboard	Manage mentorship requests and sessions
Design System

The look follows LPU's brand colours with a clean, professional style.

Role	Colour
Primary (navy)	Deep navy blue
Accent (orange)	Vibrant orange
Background	Soft off-white
Text	Dark navy and grey

Design choices

Orange accent line under the navigation bar and above the footer
Hero section with campus photo under a navy overlay
Overlapping white stats card below the hero
Rounded feature cards with navy icon tiles
Numbered orange circles for the "How it works" steps
Icons used throughout in place of emojis
How It Works
Create your profile - sign up as a student or alumnus and share your goals or expertise.
Find your mentor - search and filter the alumni directory to find the right match.
Book a session - send a request, choose a time and start learning from experience.
Limitations
Frontend only: no server, database or real authentication
Data is static or stored in the browser, so it does not persist across devices
Statistics and alumni profiles shown are for demonstration
Future Improvements
Backend with a database and secure authentication
Real-time chat between students and mentors
Calendar integration for booking sessions
Email notifications for requests and events
Admin panel for verifying alumni
Author

Name: Your Name
Registration No.: Your Registration Number
Course: Your Course and Section
University: Lovely Professional University, Punjab, India

© 2026 LPU Alumni Connect. A student project for academic purposes.
