import { currentUser } from "@clerk/nextjs/server";
import { Bell, Mail, Trash2, UserRound } from "lucide-react";
import { Button, Card } from "../../components/ui";
import { AppShell } from "../../components/app-shell";

export default async function SettingsPage() {
  const user = await currentUser();

  return (
    <AppShell>
      <h1 className="text-3xl font-bold">Settings</h1>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <UserRound className="mb-4 size-5 text-cyan-200" />
          <h2 className="font-semibold">Profile</h2>
          <p className="mt-2 text-sm text-slate-300">{user?.fullName || "Signed in user"}</p>
        </Card>
        <Card className="p-5">
          <Mail className="mb-4 size-5 text-cyan-200" />
          <h2 className="font-semibold">Email</h2>
          <p className="mt-2 text-sm text-slate-300">{user?.emailAddresses[0]?.emailAddress || "No email found"}</p>
        </Card>
        <Card className="p-5">
          <Bell className="mb-4 size-5 text-cyan-200" />
          <h2 className="font-semibold">Notifications</h2>
          <label className="mt-3 flex items-center gap-3 text-sm text-slate-300">
            <input type="checkbox" defaultChecked className="size-4 accent-cyan-300" />
            Email receipts and product updates
          </label>
        </Card>
        <Card className="p-5">
          <Trash2 className="mb-4 size-5 text-rose-200" />
          <h2 className="font-semibold">Delete account</h2>
          <p className="mt-2 text-sm text-slate-300">Placeholder for account deletion workflow.</p>
          <Button className="mt-4" variant="secondary">Request deletion</Button>
        </Card>
      </div>
    </AppShell>
  );
}
