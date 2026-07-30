// components/common/Sidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import NotificationDropdown from "../notification/NotificationDropdown";
import {
  LayoutDashboard,
  FileText,
  CalendarClock,
  Heart,
  FileStack,
  Bell,
  CircleUser,
  ClipboardCheck,
  LogOut,
  Users,
  Building2
} from "lucide-react";

const studentNavItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/applications", label: "Applications", icon: FileText },
  { to: "/interviews", label: "Interviews", icon: CalendarClock },
  { to: "/wishlist", label: "Wishlist", icon: Heart },
  { to: "/resumes", label: "Resumes", icon: FileStack },
  { to: "/profile", label: "Profile", icon: CircleUser },
];

const adminNavItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/pending-applications", label: "Pending Approvals", icon: ClipboardCheck },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/companies", label: "Companies", icon: Building2 },
  { to: "/profile", label: "Profile", icon: CircleUser },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const navItems = user?.role === "admin" ? adminNavItems : studentNavItems;
  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <aside className="w-64 h-full border-r border-border flex flex-col justify-between px-4 py-6">
      <div>
        <h1 className="text-xl font-bold px-2 mb-8">
          <span className="text-text">Offer</span>
          <span className="text-gold">Flow</span>
        </h1>

        <nav className="space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-slate/10 text-gold border-l-2 border-gold"
                    : "text-muted hover:bg-panel hover:text-text"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}

         {user?.role !== "admin" && <NotificationDropdown />} 
        </nav>
      </div>

      <div className="px-3 py-3 border-t border-border">
        <p className="text-text text-sm font-medium">{user?.fullName}</p>
        <p className="text-muted text-xs">{user?.email}</p>
        {user?.role === "admin" && (
          <span className="inline-block text-[10px] font-bold uppercase text-gold bg-gold/10 border border-gold/30 rounded-full px-2 py-0.5 mt-1.5">
            Admin
          </span>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-coral text-xs mt-3 hover:underline"
        >
          <LogOut size={13} />
          Logout
        </button>
        <p className="text-muted text-[10px] mt-4 text-center">
          OfferFlow — Made by Vaishnavi
        </p>
      </div>
    </aside>
  );
}