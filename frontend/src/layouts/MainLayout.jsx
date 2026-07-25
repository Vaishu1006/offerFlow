import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";

export default function MainLayout() {
  return (
    <div className="h-screen bg-ink flex overflow-hidden">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}