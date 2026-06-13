import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "RocketBrain AI Expert Dashboard",
  description: "Temporary AI expert chats with coupon-based billing."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const body = (
    <html lang="en">
      <body>{children}</body>
    </html>
  );

  if (!publishableKey) return body;

  return (
    <ClerkProvider publishableKey={publishableKey}>
      {body}
    </ClerkProvider>
  );
}
