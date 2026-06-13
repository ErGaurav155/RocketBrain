import Link from "next/link";
import { ArrowRight, BrainCircuit, ShieldCheck } from "lucide-react";
import { Button, Card } from "../components/ui";

export default function HomePage() {
  return (
    <main className="grid min-h-screen place-items-center px-5 py-12">
      <section className="w-full max-w-5xl">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1 text-sm text-cyan-100">
          <BrainCircuit className="size-4" />
          AI expert SaaS dashboard
        </div>
        <h1 className="max-w-3xl text-5xl font-black tracking-tight text-white sm:text-7xl">RocketBrain</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
          Choose a focused AI expert, spend coupons per answer, and keep every chat temporary by design.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/dashboard">
              Open Dashboard <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/experts">Browse Experts</Link>
          </Button>
        </div>
        <Card className="mt-12 grid gap-5 p-5 sm:grid-cols-3">
          {["No chat history stored", "Coupon usage logs only", "Legal, health, and finance safeguards"].map((item) => (
            <div key={item} className="flex items-center gap-3 text-sm text-slate-200">
              <ShieldCheck className="size-5 text-cyan-200" />
              {item}
            </div>
          ))}
        </Card>
      </section>
    </main>
  );
}
