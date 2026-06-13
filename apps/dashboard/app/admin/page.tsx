"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Plus, RefreshCw, ShieldCheck, UserRound } from "lucide-react";
import { Badge, Button, Card } from "../../components/ui";
import { AppShell } from "../../components/app-shell";
import { apiFetch } from "../../lib/api";

type AdminUser = {
  _id: string;
  clerkId: string;
  email: string;
  name: string;
  role: "user" | "admin";
  disabled: boolean;
  createdAt: string;
  balance: null | {
    balance: number;
    totalPurchased: number;
    totalUsed: number;
  };
};

export default function AdminPage() {
  const { getToken } = useAuth();
  const [userId, setUserId] = useState("");
  const [coupons, setCoupons] = useState(10);
  const [status, setStatus] = useState("");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedUser = useMemo(() => users.find((user) => user._id === userId), [userId, users]);

  async function loadUsers() {
    setLoading(true);
    try {
      const token = await getToken();
      const data = await apiFetch<{ users: AdminUser[] }>("/api/admin/users", token);
      setUsers(data.users);
      setUserId((current) => current || data.users[0]?._id || "");
      setStatus("");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadUsers();
  }, []);

  async function addCoupons() {
    try {
      const token = await getToken();
      await apiFetch(`/api/admin/users/${userId}/add-coupons`, token, {
        method: "POST",
        body: JSON.stringify({ coupons })
      });
      setStatus("Coupons added.");
      await loadUsers();
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
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold">Users synced from Clerk</h2>
            <Button size="sm" variant="secondary" onClick={loadUsers} disabled={loading}>
              <RefreshCw className="size-4" /> Refresh
            </Button>
          </div>
          <div className="mt-4 overflow-hidden rounded-lg border border-white/10">
            <div className="grid grid-cols-[1.5fr_7rem_7rem] gap-3 border-b border-white/10 bg-white/8 px-4 py-3 text-xs font-semibold uppercase text-slate-400">
              <span>User</span>
              <span>Balance</span>
              <span>Status</span>
            </div>
            {users.map((user) => (
              <button
                key={user._id}
                onClick={() => setUserId(user._id)}
                className={`grid w-full grid-cols-[1.5fr_7rem_7rem] gap-3 px-4 py-3 text-left text-sm transition hover:bg-white/8 ${
                  userId === user._id ? "bg-cyan-300/10" : ""
                }`}
              >
                <span className="min-w-0">
                  <span className="flex items-center gap-2 font-medium">
                    <UserRound className="size-4 text-cyan-200" />
                    {user.name || "Unnamed user"}
                  </span>
                  <span className="mt-1 block truncate text-xs text-slate-400">{user.email || user.clerkId}</span>
                </span>
                <span>{user.balance?.balance ?? 0}</span>
                <span>
                  <Badge className={user.disabled ? "border-rose-300/30 bg-rose-300/10 text-rose-100" : "border-emerald-300/30 bg-emerald-300/10 text-emerald-100"}>
                    {user.disabled ? "Disabled" : user.role}
                  </Badge>
                </span>
              </button>
            ))}
            {!loading && users.length === 0 && <div className="px-4 py-6 text-sm text-slate-300">No Mongo users yet. Trigger the Clerk webhook or call an authenticated API route.</div>}
            {loading && <div className="px-4 py-6 text-sm text-slate-300">Loading users...</div>}
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="font-semibold">Manual coupon grant</h2>
          {selectedUser && <p className="mt-2 text-sm text-slate-300">Selected: {selectedUser.email || selectedUser.clerkId}</p>}
          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_8rem_auto]">
            <select value={userId} onChange={(event) => setUserId(event.target.value)} className="rounded-lg border border-white/10 bg-white/8 px-3 py-2 text-sm outline-none">
              {users.map((user) => (
                <option key={user._id} value={user._id} className="bg-slate-950">
                  {user.email || user.clerkId}
                </option>
              ))}
            </select>
            <input type="number" value={coupons} onChange={(event) => setCoupons(Number(event.target.value))} className="rounded-lg border border-white/10 bg-white/8 px-3 py-2 text-sm outline-none" />
            <Button onClick={addCoupons} disabled={!userId}><Plus className="size-4" /> Add</Button>
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
