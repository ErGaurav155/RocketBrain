"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Badge, Card } from "../../components/ui";
import { AppShell } from "../../components/app-shell";
import { apiFetch } from "../../lib/api";

type Purchase = { _id: string; amount: number; coupons: number; status: string; razorpayOrderId: string; createdAt: string };

export default function BillingPage() {
  const { getToken } = useAuth();
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  useEffect(() => {
    getToken()
      .then((token) => apiFetch<{ purchases: Purchase[] }>("/api/coupons/history", token))
      .then((data) => setPurchases(data.purchases))
      .catch(() => setPurchases([]));
  }, [getToken]);

  return (
    <AppShell>
      <h1 className="text-3xl font-bold">Billing</h1>
      <p className="mt-2 text-slate-300">Invoice-style coupon purchase records and Razorpay status.</p>
      <Card className="mt-6 overflow-hidden">
        <div className="grid grid-cols-4 border-b border-white/10 px-4 py-3 text-sm text-slate-400">
          <span>Order</span><span>Coupons</span><span>Amount</span><span>Status</span>
        </div>
        {purchases.length === 0 ? (
          <div className="p-6 text-sm text-slate-300">No purchases yet.</div>
        ) : (
          purchases.map((purchase) => (
            <div key={purchase._id} className="grid grid-cols-4 items-center border-b border-white/5 px-4 py-3 text-sm">
              <span className="truncate">{purchase.razorpayOrderId}</span>
              <span>{purchase.coupons}</span>
              <span>₹{purchase.amount}</span>
              <Badge>{purchase.status}</Badge>
            </div>
          ))
        )}
      </Card>
    </AppShell>
  );
}
