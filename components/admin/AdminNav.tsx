"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/actions/auth";
import {
  LayoutDashboard,
  MessageSquare,
  CheckSquare,
  Bell,
  Newspaper,
  BookOpen,
  Inbox,
  Users,
  UserRound,
  Image as ImageIcon,
  LogOut,
} from "lucide-react";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
  { label: "Visa Approvals", href: "/admin/visa-approvals", icon: CheckSquare },
  { label: "Popup Notice", href: "/admin/popup", icon: Bell },
  { label: "News Posts", href: "/admin/news", icon: Newspaper },
  { label: "Study Materials", href: "/admin/study-materials", icon: BookOpen },
  { label: "Team", href: "/admin/team", icon: UserRound },
  { label: "Gallery", href: "/admin/gallery", icon: ImageIcon },
  { label: "Material Leads", href: "/admin/material-leads", icon: Users },
  { label: "Queries", href: "/admin/queries", icon: Inbox },
] as const;

export default function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 border-r border-sand bg-paper min-h-screen flex flex-col">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-sand">
        <p className="font-display font-semibold text-ink">
          <em>Nayan</em> Admin
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1" aria-label="Admin navigation">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={[
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-sky text-brand"
                  : "text-slate hover:text-ink hover:bg-sky/60",
              ].join(" ")}
            >
              <Icon size={16} aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className="px-5 py-4 border-t border-sand">
        <p className="text-xs text-slate truncate mb-3" title={email}>
          {email}
        </p>
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-2 text-xs text-slate hover:text-red-600 transition-colors"
          >
            <LogOut size={14} aria-hidden />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
