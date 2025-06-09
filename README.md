# WhoAmEye – Modern Profile Card & Bio Link Platform

WhoAmEye is a modern, customizable profile card and bio link platform for social media users, inspired by MySpace and Carrd. Create a visually stunning, mobile-friendly profile with a unique public URL, custom links, a gallery, and more. Powered by Next.js and Supabase.

---

## ✨ Features
- **Customizable Profile Cards**: Choose your theme, font, banner, and avatar.
- **Unique Public URLs**: Share your card at `/u/[username]`.
- **Gallery**: Upload and showcase images (Supabase Storage).
- **Custom Links**: Add, edit, and reorder your favourite links.
- **Robust Auth**: Secure sign up, login, and password reset (Supabase Auth).

---

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env.local` and fill in your Supabase credentials.

3. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

---

## 🛠️ Project Structure
- `src/app/` – Next.js app directory (landing, profile editor, public profiles)
- `src/components/` – Navbar, GalleryModal, and shared UI
- `src/lib/` – Supabase client and utilities
- `public/` – Static assets (favicon, og-image, etc)

---

## 🧑‍💻 Tech Stack
- [Next.js](https://nextjs.org/) (App Router)
- [Supabase](https://supabase.com/) (Auth, Database, Storage)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Hot Toast](https://react-hot-toast.com/)
- [React Icons](https://react-icons.github.io/react-icons/)

---

## 🌐 Deployment
Deploy on [Vercel](https://vercel.com/) or your preferred platform. See [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying).

---

## 🙏 Feedback & Contributing
This is an early alpha. Feedback, issues, and PRs are welcome!
