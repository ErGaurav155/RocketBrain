"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Plus, ShieldCheck } from "lucide-react";
import { Button, Card } from "../../components/ui";
import { AppShell } from "../../components/app-shell";
import { apiFetch } from "../../lib/api";

export default function AdminPage() {
  const { getToken } = useAuth();
  const [userId, setUserId] = useState("");
  const [coupons, setCoupons] = useState(10);
  const [status, setStatus] = useState("");

  async function addCoupons() {
    try {
      const token = await getToken();
      await apiFetch(`/api/admin/users/${userId}/add-coupons`, token, {
        method: "POST",
        body: JSON.stringify({ coupons })
      });
      setStatus("Coupons added.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Admin request failed");
    }
  }

  return (
    <AppShell>
      <div className="mb-6">
        <p className="flex items-center gap-2 text-sm font-medium text-cyan-200"><ShieldCheck className="size-4" /> Admin</p>
        <h1 className="mt-2 text-3xl font-bold">Operations console</h1>
        <p className="mt-2 max-w-2xl text-slate-300">View users, purchases, usage logs, and manually grant coupons through the protected API.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h2 className="font-semibold">Manual coupon grant</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_8rem_auto]">
            <input value={userId} onChange={(event) => setUserId(event.target.value)} placeholder="Mongo user id" className="rounded-lg border border-white/10 bg-white/8 px-3 py-2 text-sm outline-none" />
            <input type="number" value={coupons} onChange={(event) => setCoupons(Number(event.target.value))} className="rounded-lg border border-white/10 bg-white/8 px-3 py-2 text-sm outline-none" />
            <Button onClick={addCoupons}><Plus className="size-4" /> Add</Button>
          </div>
          {status && <p className="mt-4 text-sm text-slate-300">{status}</p>}
        </Card>
        <Card className="p-5">
          <h2 className="font-semibold">Manage experts</h2>
          <p className="mt-2 text-sm text-slate-300">Use PATCH /api/admin/experts/:id to change prompts, active status, and coupon costs.</p>
        </Card>
      </div>
    </AppShell>
  );
}
