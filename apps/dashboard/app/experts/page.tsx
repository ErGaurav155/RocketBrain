import { experts } from "@rocketbrain/shared";
import { AppShell } from "../../components/app-shell";
import { ExpertCard } from "../../components/expert-card";

export default function ExpertsPage() {
  return (
    <AppShell>
      <div className="mb-6">
        <p className="text-sm font-medium text-cyan-200">Expert marketplace</p>
        <h1 className="mt-2 text-3xl font-bold">Choose your AI expert</h1>
        <p className="mt-2 max-w-2xl text-slate-300">Each chat is temporary. Normal experts cost 1 coupon, premium experts cost 2, and deep answer mode costs 3.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {experts.map((expert) => (
          <ExpertCard key={expert.id} expert={expert} />
        ))}
      </div>
    </AppShell>
  );
}
