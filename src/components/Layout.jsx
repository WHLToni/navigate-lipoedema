import { Outlet, Link, useLocation } from "react-router-dom";
import { Home, Map, ListChecks, Pill, TrendingUp, Settings } from "lucide-react";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/body-map", label: "Symptom Map", icon: Map },
  { path: "/habits", label: "Habits", icon: ListChecks },
  { path: "/medication", label: "Medication", icon: Pill },
  { path: "/trends", label: "Trends", icon: TrendingUp },
  { path: "/settings", label: "Settings", icon: Settings },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 pb-20 overflow-y-auto">
        <Outlet />
      </main>

      {/* Bottom Navigation — dark brand treatment */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe" style={{ background: "#0a0a0a", borderTop: "1px solid #1a1a1a" }}>
        <div className="max-w-lg mx-auto flex items-center justify-around px-2 pt-2 pb-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200"
                style={{ color: isActive ? "#FB4002" : "rgba(255,255,255,0.4)" }}
              >
                <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : ""}`} />
                <span className="text-[10px] font-medium leading-tight" style={{ fontFamily: "var(--font-body)" }}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}