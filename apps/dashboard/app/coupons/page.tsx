"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { CheckCircle2, CreditCard, Sparkles } from "lucide-react";
import { couponPacks } from "@rocketbrain/shared";
import { Badge, Button, Card } from "../../components/ui";
import { AppShell } from "../../components/app-shell";
import { apiFetch } from "../../lib/api";

export default function CouponsPage() {
  const { getToken } = useAuth();
  const [balance, setBalance] = useState<number | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    getToken()
      .then((token) => apiFetch<{ balance: number }>("/api/coupons/balance", token))
      .then((data) => setBalance(data.balance))
      .catch(() => setStatus("Sign in and configure the API to sync coupon balance."));
  }, [getToken]);

  async function buyPack(packId: string) {
    setStatus("Creating Razorpay order...");
    try {
      const token = await getToken();
      const data = await apiFetch<{ order: { id: string; amount: number; currency: string } }>("/api/coupons/purchase", token, {
        method: "POST",
        body: JSON.stringify({ packId })
      });
      setStatus(`Order ${data.order.id} created. Wire this into Razorpay Checkout with NEXT_PUBLIC_RAZORPAY_KEY_ID.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Purchase failed");
    }
  }

  return (
    <AppShell>
      <div className="grid gap-5 xl:grid-cols-[1fr_22rem]">
        <section>
          <p className="text-sm font-medium text-cyan-200">Coupons</p>
          <h1 className="mt-2 text-3xl font-bold">Buy expert credits</h1>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {couponPacks.map((pack) => (
              <Card key={pack.id} className="p-5">
                {pack.highlight && <Badge className="mb-4 border-cyan-300/30 bg-cyan-300/15 text-cyan-100">Best value</Badge>}
                <h2 className="text-xl font-semibold">{pack.name}</h2>
                <div className="mt-4 text-4xl font-black">₹{pack.amount}</div>
                <p className="mt-2 text-sm text-slate-300">{pack.coupons} coupons</p>
                <Button className="mt-5 w-full" onClick={() => buyPack(pack.id)}>
                  <CreditCard className="size-4" />
                  Buy
                </Button>
              </Card>
            ))}
          </div>
          {status && <div className="mt-4 rounded-lg border border-white/10 bg-white/8 p-4 text-sm text-slate-200">{status}</div>}
        </section>

        <aside className="space-y-4">
          <Card className="p-5">
            <Sparkles className="mb-4 size-5 text-cyan-200" />
            <div className="text-sm text-slate-400">Current balance</div>
            <div className="mt-2 text-5xl font-black">{balance ?? "--"}</div>
          </Card>
          <Card className="p-5">
            <h2 className="font-semibold">Usage rules</h2>
            {["Normal experts: 1 coupon per message", "Premium experts: 2 coupons per message", "Deep answer mode: 3 coupons per message"].map((item) => (
              <div key={item} className="mt-3 flex gap-2 text-sm text-slate-300">
                <CheckCircle2 className="mt-0.5 size-4 text-cyan-200" />
                {item}
              </div>
            ))}
          </Card>
        </aside>
      </div>
    </AppShell>
  );
}
