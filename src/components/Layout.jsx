import { Outlet, Link, useLocation } from "react-router-dom";
import { Home, Map, ListChecks, Pill, Settings } from "lucide-react";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/body-map", label: "Body Map", icon: Map },
  { path: "/habits", label: "Habits", icon: ListChecks },
  { path: "/medication", label: "Medication", icon: Pill },
  { path: "/settings", label: "Settings", icon: Settings },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 pb-20 overflow-y-auto">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 pb-safe">
        <div className="max-w-lg mx-auto flex items-center justify-around px-2 pt-2 pb-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "text-electric-blue"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : ""}`} />
                <span className="text-[10px] font-body font-medium leading-tight">
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