// layouts/AuthLayout.jsx
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-ink flex flex-col items-center justify-center px-4">
      <Outlet />
      <p className="text-muted text-xs mt-8">
        Made with 💛 by <span className="text-gold font-medium">Vaishnavi</span>
      </p>
    </div>
  );
}