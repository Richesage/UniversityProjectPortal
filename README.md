# University Project Portal

A web-based Final Year Project Allocation and Supervision System for a university department. Built with React, Vite, Tailwind CSS, and React Router.

Original Figma design: https://www.figma.com/design/ZmtYmHCqgctQbfLfYIZI8Q/University-Project-Portal

## Getting Started

```bash
pnpm install
pnpm run dev
```

Open http://localhost:5173 in your browser.

## Demo Credentials

| Role    | Email              | Password |
|---------|--------------------|----------|
| Student | student@uni.edu    | password |
| Lecturer| lecturer@uni.edu   | password |
| Admin   | admin@uni.edu      | password |

## Screen Map

### Student
- `/student/dashboard` — Overview, topics, notifications
- `/student/topics` — Browse and select project topics
- `/student/submissions` — Upload chapters, view feedback
- `/student/progress` — Milestones and task tracking
- `/student/meetings` — Calendar and meeting requests

### Lecturer
- `/lecturer/dashboard` — Supervision overview and workload chart
- `/lecturer/upload` — Upload project topics
- `/lecturer/students` — Assigned students list
- `/lecturer/workload` — Workload analytics

### Admin
- `/admin/dashboard` — System statistics and notifications
- `/admin/approval` — Review student proposals
- `/admin/allocation` — Assign supervisors to students
- `/admin/reports` — Generate and export reports

## Build

```bash
pnpm run build
```

Output is written to `dist/`.

## Tech Stack

- React 18 + TypeScript
- Vite 6
- React Router 7
- Tailwind CSS 4
- shadcn/ui + Radix UI
- Recharts (analytics)
- Sonner (toasts)
- react-day-picker (calendar)
