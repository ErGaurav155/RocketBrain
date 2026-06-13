import Link from "next/link";
import { ArrowRight, BadgeIndianRupee, ShieldAlert, Sparkles, Zap } from "lucide-react";
import { experts } from "@rocketbrain/shared";
import { Badge, Button, Card } from "../../components/ui";
import { AppShell } from "../../components/app-shell";
import { ExpertCard } from "../../components/expert-card";

export default function DashboardPage() {
  const popular = experts.slice(0, 4);

  return (
    <AppShell>
      <div className="space-y-6">
        <section className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
          <Card className="p-6 sm:p-8">
            <Badge className="mb-5">Welcome back</Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Pick an expert and get a focused answer.</h1>
            <p className="mt-3 max-w-2xl text-slate-300">
              Chats reset when you leave or refresh. Copy anything important before moving on.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <Link href="/experts">
                  Quick Start <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/coupons">Buy Coupons</Link>
              </Button>
            </div>
          </Card>
          <Card className="grid gap-4 p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Available coupons</span>
              <BadgeIndianRupee className="size-5 text-cyan-200" />
            </div>
            <div className="text-5xl font-black">3</div>
            <p className="text-sm text-slate-300">Starter balance appears after first authenticated API sync.</p>
            <Button asChild variant="secondary">
              <Link href="/coupons">Manage balance</Link>
            </Button>
          </Card>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Card className="p-5">
            <Zap className="mb-4 size-5 text-cyan-200" />
            <div className="text-sm text-slate-400">Recent usage</div>
            <div className="mt-2 text-2xl font-bold">Usage logs only</div>
            <p className="mt-2 text-sm text-slate-300">Expert, cost, status, and token estimates. No messages.</p>
          </Card>
          <Card className="p-5">
            <Sparkles className="mb-4 size-5 text-pink-200" />
            <div className="text-sm text-slate-400">Recommended</div>
            <div className="mt-2 text-2xl font-bold">Tutor, Coding, Business</div>
            <p className="mt-2 text-sm text-slate-300">High-signal experts for daily work and learning.</p>
          </Card>
          <Card className="p-5">
            <ShieldAlert className="mb-4 size-5 text-amber-200" />
            <div className="text-sm text-slate-400">Safety</div>
            <div className="mt-2 text-2xl font-bold">AI guidance</div>
            <p className="mt-2 text-sm text-slate-300">Not a real licensed professional. Use qualified help for emergencies.</p>
          </Card>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Popular AI experts</h2>
            <Link href="/experts" className="text-sm font-medium text-cyan-200">View all</Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {popular.map((expert) => (
              <ExpertCard key={expert.id} expert={expert} />
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
