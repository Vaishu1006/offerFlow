# OfferFlow — Smart Internship & Placement Tracker

A full-stack **Career Management Platform** built for students to track internship and job applications, manage resume versions, schedule interviews, analyze rejection patterns, and get AI-powered resume feedback — all in one place, instead of scattered Excel sheets or Notion pages.

**🔗 Live App:** [https://offer-flow-tau.vercel.app](https://offer-flow-tau.vercel.app)
**🔗 Backend API:** Deployed on Render

---

## 📌 Problem Statement

Students apply to dozens of internships and jobs across LinkedIn, Internshala, Naukri, and company portals. After a while, they lose track of:
- Which company they applied to, and with which resume version
- Interview dates, OA links, and follow-up deadlines
- Reasons for rejection, and patterns in their weak areas

**OfferFlow acts as a personal job-search CRM** — solving this exact problem with structured tracking, analytics, and reminders.

---

## ✨ Core Features

### For Students
- **Application Tracking** — Full CRUD with a 9-stage Kanban board (`Saved → Applied → OA Scheduled → OA Cleared → Interview Rounds → HR Round → Selected/Rejected`)
- **Resume Version Management** — Upload multiple resumes by category (General, WebDev, Backend, Frontend, ML), stored via Cloudinary
- **Resume-wise Performance Analytics** — See which resume category converts better into interview calls
- **Interview Scheduler** — List view + Calendar view, with round types (OA, Technical, HR, etc.)
- **Rejection Analysis ⭐** — Tag rejection reasons (DSA, Communication, Resume, System Design, Projects) and visualize patterns to identify weak areas
- **Email Reminders** — Automated 24-hours-before-interview email + in-app notification via `node-cron`
- **Job Wishlist** — Save companies before applying, convert to a full application later with one flow
- **AI Resume Match Score** — Get a match score + missing-skills breakdown against a role
- **Notifications** — In-app dropdown with unread-count badge, auto-refreshing
- **Personal Dashboard** — Status breakdown, resume performance, rejection analysis, and interview calendar — all in one view

### For Admins
- **Platform Analytics Dashboard** — Total students/mentors/applications/interviews, status breakdown, applications-by-company, monthly trend
- **Pending Company Approvals** — Approve new companies submitted by students during application creation
- **User Management** — Search, filter by role, change roles, delete users
- **Company Management** — Edit/delete company records (category, location type, website)

---

## 🛠️ Tech Stack

**Frontend**
- React + Vite
- Tailwind CSS v4 (via `@tailwindcss/vite`, custom design tokens in `App.css`)
- React Router v6 (nested routes, role-based protected routes)
- Custom-built charts (donut charts, bar charts, calendar grid) — no charting library dependency

**Backend**
- Node.js + Express (ES Modules)
- MongoDB + Mongoose
- JWT authentication via httpOnly cookies
- Role-based access control (`student`, `mentor`, `admin`)
- Cloudinary for resume storage
- Nodemailer + node-cron for email reminders
- express-validator, express-rate-limit, Helmet for security

**Deployment**
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

## 🔐 Security Measures

- CORS locked to specific frontend origin with credentialed requests
- Rate limiting on auth routes (brute-force protection) and general API routes
- Helmet for secure HTTP headers
- Strong, randomly-generated JWT secret
- Regex-injection protection on all search endpoints (ReDoS prevention)
- httpOnly, secure, sameSite cookies for cross-domain production auth
- No secrets ever committed to version control (verified via full repo history scan)

---

## 📁 Project Structure

```
offerFlow/
├── backend/
│   ├── config/           # DB & Cloudinary config
│   ├── models/           # Mongoose schemas (User, Application, Resume, Interview, etc.)
│   ├── controllers/      # Route logic
│   ├── routes/           # Express routers
│   ├── middleware/       # Auth, role-check, rate-limit, error handling
│   ├── services/         # Email service, cron jobs
│   ├── utils/            # Token generation, validators
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── api/           # Axios API layer
    │   ├── components/    # Reusable UI (application, interview, wishlist, resume, analytics, ai)
    │   ├── pages/          # Route-level pages (+ admin/ subfolder)
    │   ├── hooks/          # useAuth, useNotifications, useDebounce, useFetch
    │   ├── layouts/         # Auth & Main layouts
    │   ├── routes/          # Route definitions with role guards
    │   └── services/        # Auth & storage services
    └── vercel.json          # SPA rewrite config
```

---

## 🧠 Design Notes & Trade-offs

A few deliberate decisions worth mentioning:

- **Wishlist → Application conversion** is a guided flow (not a simple status flip), since an `Application` requires fields a `Wishlist` entry doesn't have (resume, job link, location).
- **AI Resume Match Score** currently returns a plausible mock score while the scoring endpoint is fully wired — designed so swapping in a real LLM call requires no frontend changes.
- **Email reminder system** is fully built and tested (Nodemailer + node-cron, verified working end-to-end) but **intentionally disabled in the deployed backend** (`server.js`) since Gmail SMTP isn't production-grade without a verified sending domain. The code is kept in the repo for reference.
- **Interview Calendar** is a custom-built month-grid component (no external calendar library) to keep the bundle lean and match the app's design system.
- **Notes Section** (from the original problem statement) was consciously deprioritized after evaluating that it would largely duplicate the insight already provided by Rejection Analysis.

---

## 🚀 Running Locally

**Backend**
```bash
cd backend
npm install
# create a .env file — see .env.example for required variables
node server.js
```

**Frontend**
```bash
cd frontend
npm install
# set VITE_API_BASE_URL in .env to your local backend URL
npm run dev
```

---

## 👩‍💻 Author

Built independently as a first fully self-directed full-stack project — from schema design through deployment and production hardening.
