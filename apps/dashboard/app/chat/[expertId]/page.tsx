"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Eraser, RefreshCcw, Send, ShoppingBag, StopCircle } from "lucide-react";
import { experts, getExpert, type ExpertMode } from "@rocketbrain/shared";
import { Badge, Button, Card, cn } from "../../../components/ui";
import { AppShell } from "../../../components/app-shell";
import { ExpertIcon } from "../../../components/icons";
import { apiFetch } from "../../../lib/api";

type Message = {
  id: string;
  role: "assistant" | "user";
  content: string;
};

export default function ChatPage() {
  const params = useParams<{ expertId: string }>();
  const expert = useMemo(() => getExpert(params.expertId), [params.expertId]);
  const { getToken } = useAuth();
  const [messages, setMessages] = useState<Message[]>(() =>
    expert
      ? [
          {
            id: "welcome",
            role: "assistant",
            content: `Hi, I am ${expert.name}. Tell me what you want help with. Chats are not saved, so copy anything important before leaving.`
          }
        ]
      : []
  );
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<ExpertMode>("normal");
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastPrompt, setLastPrompt] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    getToken()
      .then((token) => apiFetch<{ balance: number }>("/api/coupons/balance", token))
      .then((data) => setBalance(data.balance))
      .catch(() => setBalance(null));
  }, [getToken]);

  if (!expert) {
    return (
      <AppShell>
        <Card className="p-8">Expert not found.</Card>
      </AppShell>
    );
  }

  async function sendMessage(text = input) {
    const trimmed = text.trim();
    if (!trimmed || loading || !expert) return;

    setInput("");
    setLastPrompt(trimmed);
    setMessages((current) => [...current, { id: crypto.randomUUID(), role: "user", content: trimmed }]);
    setLoading(true);

    try {
      const token = await getToken();
      const data = await apiFetch<{ answer: string; balance: number; couponUsed: number }>(
        `/api/chat/${expert.slug}`,
        token,
        {
          method: "POST",
          body: JSON.stringify({ message: trimmed, mode })
        }
      );
      setBalance(data.balance);
      setMessages((current) => [...current, { id: crypto.randomUUID(), role: "assistant", content: data.answer }]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            error instanceof Error && error.message.includes("Not enough")
              ? "You do not have enough coupons for this answer. Buy a pack to continue."
              : "I could not generate a response. Please try again."
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <div className="grid min-h-[calc(100vh-7rem)] gap-4 xl:grid-cols-[18rem_1fr]">
        <aside className="hidden rounded-lg border border-white/10 bg-slate-950/40 p-3 xl:block">
          <div className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Experts</div>
          <div className="space-y-1">
            {experts.map((item) => (
              <Link
                key={item.id}
                href={`/chat/${item.slug}`}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/10",
                  item.slug === expert.slug && "bg-white/12 text-white"
                )}
              >
                <ExpertIcon name={item.icon} className="size-4" />
                {item.label}
              </Link>
            ))}
          </div>
        </aside>

        <section className="flex min-h-[calc(100vh-7rem)] flex-col overflow-hidden rounded-lg border border-white/10 bg-slate-950/45">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-lg bg-cyan-300/15 text-cyan-200">
                <ExpertIcon name={expert.icon} className="size-5" />
              </span>
              <div>
                <h1 className="font-semibold">{expert.name}</h1>
                <p className="text-xs text-slate-400">{expert.category} expert. Temporary session.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge>{balance === null ? "Syncing" : `${balance} coupons`}</Badge>
              <Button asChild size="sm" variant="secondary">
                <Link href="/coupons">
                  <ShoppingBag className="size-4" />
                  Buy
                </Link>
              </Button>
            </div>
          </header>

          <div className="border-b border-amber-300/20 bg-amber-300/10 px-4 py-2 text-sm text-amber-100">
            Chats are not saved. Copy anything important before leaving.
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
            {messages.map((message) => (
              <article key={message.id} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[min(44rem,92%)] rounded-lg px-4 py-3 text-sm leading-6",
                    message.role === "user" ? "bg-cyan-300 text-slate-950" : "bg-white/8 text-slate-100"
                  )}
                >
                  {message.role === "assistant" ? (
                    <>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                      <button
                        className="mt-3 inline-flex items-center gap-1 text-xs text-cyan-200"
                        onClick={() => navigator.clipboard.writeText(message.content)}
                      >
                        <Copy className="size-3" />
                        Copy response
                      </button>
                    </>
                  ) : (
                    message.content
                  )}
                </div>
              </article>
            ))}
            {loading && (
              <div className="max-w-md rounded-lg bg-white/8 px-4 py-3 text-sm text-slate-300">
                <span className="inline-flex animate-pulse">Thinking...</span>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          <div className="border-t border-white/10 p-3">
            <div className="mb-3 flex flex-wrap gap-2">
              {expert.suggestedPrompts.map((prompt) => (
                <button key={prompt} onClick={() => setInput(prompt)} className="rounded-full bg-white/8 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/12">
                  {prompt}
                </button>
              ))}
            </div>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="rounded-lg border border-white/10 bg-white/5 p-1">
                {(["normal", "deep"] as ExpertMode[]).map((item) => (
                  <button
                    key={item}
                    onClick={() => setMode(item)}
                    className={cn("rounded-md px-3 py-1.5 text-sm capitalize text-slate-300", mode === item && "bg-cyan-300 text-slate-950")}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => setMessages([])}>
                  <Eraser className="size-4" />
                  Clear
                </Button>
                <Button size="sm" variant="ghost" onClick={() => lastPrompt && sendMessage(lastPrompt)} disabled={!lastPrompt || loading}>
                  <RefreshCcw className="size-4" />
                  Regenerate
                </Button>
              </div>
            </div>
            <form
              className="flex items-end gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                sendMessage();
              }}
            >
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                rows={2}
                placeholder={`Message ${expert.label}`}
                className="max-h-40 min-h-12 flex-1 resize-none rounded-lg border border-white/10 bg-white/8 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/70"
              />
              <Button type="submit" className="h-12 w-12 px-0" disabled={loading}>
                {loading ? <StopCircle className="size-5" /> : <Send className="size-5" />}
              </Button>
            </form>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
