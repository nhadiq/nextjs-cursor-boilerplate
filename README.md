# 🚀 NextJS Cursor Boilerplate

A **Quick Build Boilerplate** for launching production-ready applications with **Next.js**, built using **Cursor** and powered by **Firebase or Supabase** for authentication.  

It comes preloaded with essential tools and patterns to ship fast, including authentication, UI components with **TailwindCSS** + **Shadcn**, flexible backend, and integrations for payments, analytics, and notifications.

## 🧰 What's Included?

| Feature         | Description                                           |
|-----------------|-------------------------------------------------------|
| 🔐 Auth         | Firebase or Supabase authentication (SignUp/Login/Logout) |
| 🧠 Backend      | Extendable API structure using Next.js API routes     |
| 🎨 Frontend     | TailwindCSS, Shadcn UI, fully responsive UI           |
| 💾 Database     | Built-in support for Firestore/Supabase DB            |
| 💸 Payments      | Placeholder for Stripe integration                    |
| 🔔 Notifications | Hook-ready for email/push notification services       |
| 📊 Analytics     | Ready to plug in tools like PostHog, Plausible, or GA |
| 🔒 Security      | Route protection, environment config, and validation |

## 🚀 Getting Started

### 1. Clone the Repo

\`\`\`bash
git clone https://github.com/your-org/nextjs-cursor-boilerplate.git
cd nextjs-cursor-boilerplate
\`\`\`

### 2. Install Dependencies

\`\`\`bash
pnpm install
\`\`\`

> _Ensure you have pnpm installed. If not, install via \`npm i -g pnpm\`_

### 3. Setup Environment Variables

Create a \`.env.local\` file based on the template below:

\`\`\`env
# Firebase OR Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=

# Stripe (for payments)
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Email / Notification config
SENDGRID_API_KEY=
NEXT_PUBLIC_BASE_URL=http://localhost:3000
\`\`\`

### 4. Start Development Server

\`\`\`bash
pnpm dev
\`\`\`

## 🔐 Auth Options

Choose between **Firebase** or **Supabase** by switching the service in the \`/lib/auth.ts\` file.

Example:
\`\`\`ts
import { createClient } from '@supabase/supabase-js'
// OR
import { initializeApp } from 'firebase/app'
\`\`\`

Already scaffolded:

- SignUp
- Login
- Logout
- Route protection via higher-order component

## 💅 UI/UX Stack

- **TailwindCSS** for styling
- **Shadcn/UI** for modern UI components
- **Responsive layout** prebuilt with Headless UI patterns

## 🛠 Project Structure

\`\`\`
/
├── components/       → UI components
├── pages/            → Next.js pages (API + frontend)
├── lib/              → Auth, DB, helpers
├── styles/           → TailwindCSS setup
├── public/           → Static assets
└── .env.local        → Environment variables
\`\`\`

## 🔄 Updating the Boilerplate

As you evolve your project, here's how to scale this boilerplate:

### ✅ Add a New API Endpoint

Create a file under \`/pages/api/\`:

\`\`\`ts
// pages/api/example.ts
export default function handler(req, res) {
  res.status(200).json({ success: true })
}
\`\`\`

### ✅ Add a New Page

\`\`\`bash
touch pages/dashboard.tsx
\`\`\`

Inside:

\`\`\`tsx
export default function Dashboard() {
  return <div className="p-4">Welcome to Dashboard</div>
}
\`\`\`

### ✅ Add a New Component

\`\`\`bash
mkdir components/shared
touch components/shared/Button.tsx
\`\`\`

\`\`\`tsx
export default function Button({ children }) {
  return <button className="bg-black text-white px-4 py-2 rounded">{children}</button>
}
\`\`\`

### ✅ Change Auth Provider

Update \`/lib/auth.ts\` and corresponding providers in \`_app.tsx\`.

## 📦 Deployment

Supports Vercel out of the box. For other platforms:

\`\`\`bash
pnpm build
pnpm start
\`\`\`

## 🔗 Integrations Checklist

| Feature      | Tool Suggestions                  |
|--------------|-----------------------------------|
| Auth         | Firebase Auth / Supabase Auth     |
| DB           | Firestore / Supabase DB           |
| Payments     | Stripe                            |
| Analytics    | PostHog / Plausible / Google GA4  |
| Notifications| SendGrid / OneSignal              |

## 🧠 Contributing

Pull requests are welcome. For major changes, open an issue first.

## 📄 License

[MIT](LICENSE)

## 👨‍💻 Built With

- [Next.js](https://nextjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Shadcn/UI](https://ui.shadcn.com/)
- [Firebase](https://firebase.google.com/) / [Supabase](https://supabase.io/)
- [Stripe](https://stripe.com/)
