"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { BadgeIndianRupee, Bot, CreditCard, LayoutDashboard, Settings, ShieldCheck, Sparkles } from "lucide-react";
import { cn } from "./ui";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/experts", label: "Experts", icon: Bot },
  { href: "/coupons", label: "Coupons", icon: BadgeIndianRupee },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/admin", label: "Admin", icon: ShieldCheck }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-white/10 bg-slate-950/70 px-4 py-5 backdrop-blur-xl lg:block">
        <Link href="/dashboard" className="mb-8 flex items-center gap-3 px-2">
          <span className="grid size-10 place-items-center rounded-lg bg-cyan-300 text-slate-950">
            <Sparkles className="size-5" />
          </span>
          <span>
            <span className="block text-lg font-bold">RocketBrain</span>
            <span className="text-xs text-slate-400">AI Expert Dashboard</span>
          </span>
        </Link>
        <nav className="space-y-1">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white",
                  active && "bg-white/12 text-white"
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/60 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/dashboard" className="flex items-center gap-2 font-bold lg:hidden">
              <Sparkles className="size-5 text-cyan-300" />
              RocketBrain
            </Link>
            <div className="hidden text-sm text-slate-400 lg:block">Temporary expert chats. Usage logs only.</div>
            {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <span className="grid size-8 place-items-center rounded-full bg-white/10 text-xs font-semibold text-slate-300">RB</span>
            )}
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
