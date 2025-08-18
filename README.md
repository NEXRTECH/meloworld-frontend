# Meloworld Frontend

A **Next.js (App Router)** frontend for a multi-role psychometrics / assessments platform (Admin, Organization, Therapist, Candidate). It provides authentication screens, role dashboards, assessment/quiz flows, reporting, and org management, styled with **Tailwind CSS (v4)** and animated with **Framer Motion**. Data is fetched from AWS-backed services (API Gateway/Lambda) using signed requests via **aws4fetch**.

---

## ✨ Highlights

- **Tech stack**: Next.js (latest), React (latest), TypeScript, Tailwind CSS v4, Framer Motion, Headless UI.
- **State**: Zustand stores per role (admin, org, therapist, candidate).
- **API integration**: `aws4fetch` signature for selected endpoints; token-based fetch for others. Built-in retry with exponential backoff.
- **App Router**: `/app` directory with layouts and route groups.
- **UI kit**: Reusable components in `src/components/ui` (buttons, cards, inputs, tables, dropdowns, etc.).
- **Storybook-ready**: UI components include `*.stories.tsx` files.

---

## 🗺️ Features & Routes (non-exhaustive)

- **Public**: `/`, `/about`
- **Auth** (per role):  
  - `/auth/admin/login`, `/auth/admin/signup`  
  - `/auth/org/login`, `/auth/org/signup`  
  - `/auth/therapist/login`, `/auth/therapist/signup`  
  - `/auth/candidate/login`, `/auth/candidate/signup`
- **Admin**: `/admin/dashboard`, `/admin/assessments`, `/admin/candidates`, `/admin/organizations`, `/admin/settings`, `/admin/email`
- **Candidate**: `/candidate`, `/candidate/course/[courseId]`, `/candidate/course/[courseId]/quiz`, `/candidate/course/[courseId]/report`
- **Org**: `/org`, `/org/candidates`, `/org/settings`
- **Therapist**: `/therapist`, `/therapist/patients`, `/therapist/sessions`

> Exact pages inferred from `app/**/page.tsx`. Add/remove items as your app evolves.

---

## 🧱 Project Structure

```
app/                   # Next.js App Router routes (layouts, pages per role)
public/                # Public assets
src/
  assets/              # Images/graphics used across the app
  components/
    stores/            # Zustand stores (admin/org/therapist/candidate/auth)
    ui/                # Reusable UI components (+ Storybook stories)
    ...                # Feature components (forms, tables, etc.)
  lib/
    aws-axios.ts       # AWS request signing via aws4fetch
    utils.ts           # helpers (e.g., retryFetch, cn)
  styles/              # (Tailwind + global styles if applicable)
styles/                # project-level styles (globals.css imports from app/layout.tsx)
next.config.js         # Path alias '@' -> 'src'
tsconfig.json          # TypeScript config (paths, strictness, etc.)
package.json
```

Path alias:
```js
// next.config.js
config.resolve.alias['@'] = path.resolve(__dirname, 'src');
```
TypeScript:
```json
{{
  "paths": {{ "@/*": ["src/*"] }}
}}
```

---

## 🔑 Environment Variables

Place these in `.env` for local dev and configure them in your hosting env for prod. Based on code references:



> Hosts typically point at API Gateway domains; access/secret/region are used for **request signing**. Avoid exposing long-lived credentials in the browser; use short-lived, scoped credentials or move signing to a server where possible.

Example `.env.local` (adjust to your infra):
```bash
NEXT_PUBLIC_AWS_REGION=ap-south-1
NEXT_PUBLIC_AWS_ACCESS_KEY=...
NEXT_PUBLIC_AWS_AUTH_SECRET=...
NEXT_PUBLIC_AWS_ADMIN_HOST=admin-api.example.com
NEXT_PUBLIC_AWS_ORG_HOST=org-api.example.com
NEXT_PUBLIC_AWS_CANDIDATE_HOST=candidate-api.example.com
NEXT_PUBLIC_AWS_THERAPIST_HOST=therapist-api.example.com
NEXT_PUBLIC_AWS_PATIENT_HOST=patient-api.example.com
NEXT_PUBLIC_AWS_ASSESSMENT_HOST=assessment-api.example.com
NEXT_PUBLIC_AWS_CHAPTER_HOST=chapter-api.example.com
NEXT_PUBLIC_AWS_QUIZ_HOST=quiz-api.example.com
NEXT_PUBLIC_AWS_REPORTS_HOST=reports-api.example.com
NEXT_PUBLIC_AWS_SESSION_HOST=session-api.example.com
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (recommend 20+)
- npm 9+

### Install
```bash
npm ci
```

### Run (Dev)
```bash
npm run dev
```
> Uses Next.js with Turbopack by default.

### Build & Start (Prod)
```bash
npm run build
npm start
```

---

## 🧩 APIs & Data Access

- **Signed requests**: `src/lib/aws-axios.ts` uses `AwsClient` (aws4fetch) to sign and call endpoints.  
  - Reads `NEXT_PUBLIC_AWS_ACCESS_KEY`, `NEXT_PUBLIC_AWS_AUTH_SECRET`, `NEXT_PUBLIC_AWS_REGION` and target host (e.g., `NEXT_PUBLIC_AWS_ADMIN_HOST`).  
  - Implements **retry** for transient failures.
- **Token-based endpoints**: Some services (e.g., quizzes) accept a `Bearer` token (see `src/services/quizzes.ts`).  
- **Retry helper**: `retryFetch(url, options, retries, delay)` with exponential backoff in `src/lib/utils.ts`.

> If you move sensitive signing to a backend, replace client-side calls with your API proxy and remove public exposure of AWS creds.

---

## 🧪 Storybook (optional)

There are `*.stories.tsx` files for UI components. If you plan to use Storybook, add scripts like:
```json
"storybook": "storybook dev -p 6006",
"build-storybook": "storybook build"
```
Then:
```bash
npm run storybook
```

---

## 🎨 Styling & UI

- Tailwind CSS v4 (via `@tailwindcss/postcss`) and utility helpers (`clsx`, `tailwind-merge`).
- Headless UI + custom components in `src/components/ui`.
- Some 3D UI pieces rely on **react-three-fiber** and **three**.

---

## 🧭 Conventions

- **Imports**: Use `@/` alias for anything under `src/`.
- **State**: Centralized per-role Zustand stores in `src/components/stores`.
- **Types**: Domain models live in `src/components/types.ts` (Organization, Course, Quiz, Chapter, Question, Report, etc.).

---

## 🛡️ Security Notes

- **Do not** commit real secrets. Use `.env.local` for local dev, a secrets manager in prod.
- Client-side signing with long-lived AWS credentials is risky. Prefer short-lived tokens or a server-side signer/proxy.
- Ensure CORS is configured on your APIs for your frontend origin(s).

---

## 🚀 Deployment

This app is deployed using **Vercel**, which provides seamless deployment for Next.js applications with automatic builds, preview deployments, and global CDN distribution.

### Vercel Deployment Features
- **Automatic builds** on git push to main branch
- **Preview deployments** for pull requests
- **Edge functions** and **serverless functions** support
- **Environment variables** management through Vercel dashboard
- **Custom domains** and SSL certificates
- **Analytics** and **performance monitoring**

### Environment Variables in Vercel
Configure your AWS environment variables in the Vercel dashboard:
1. Go to your project settings in Vercel
2. Navigate to the "Environment Variables" section
3. Add all the AWS-related environment variables from your `.env.local`
4. Set them for Production, Preview, and Development environments as needed

---

## 🧯 Troubleshooting

- **401/403 to AWS endpoints**: Check env vars, credential validity, and time drift. Confirm CORS rules.
- **Network errors**: Verify hostnames like `NEXT_PUBLIC_AWS_*_HOST` point to the correct API Gateway domain/stage.
- **Styles not applying**: Confirm Tailwind v4 PostCSS integration and that `globals.css` is imported in `app/layout.tsx`.
- **Path import failures**: Ensure `@` alias in `next.config.js` and `tsconfig.json` matches folder structure.
- **Vercel deployment issues**: Check build logs, ensure all environment variables are set, and verify Next.js version compatibility.

---

## 📦 Scripts

Available npm scripts:
```json
{
  "dev": "next dev --turbopack",
  "build": "next build",
  "start": "next start"
}
```

---

## 🙌 Maintainers & Contributing

- Update this README with product-specific copy, screenshots, and links.
- Keep `src/components/types.ts` in sync with backend contracts.
- Add CI (lint, typecheck, build) and PR templates as you grow.