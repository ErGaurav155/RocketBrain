import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge, Button, Card } from "./ui";
import type { AIExpert } from "@rocketbrain/shared";
import { ExpertIcon } from "./icons";

export function ExpertCard({ expert }: { expert: AIExpert }) {
  return (
    <Card className="flex h-full flex-col p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <span className="grid size-12 place-items-center rounded-lg bg-cyan-300/15 text-cyan-200">
          <ExpertIcon name={expert.icon} className="size-6" />
        </span>
        <Badge>{expert.isPremium ? "Premium" : `${expert.couponCost} coupon`}</Badge>
      </div>
      <h3 className="text-lg font-semibold">{expert.name}</h3>
      <p className="mt-2 min-h-16 text-sm leading-6 text-slate-300">{expert.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {expert.examples.slice(0, 3).map((example) => (
          <span key={example} className="rounded-full bg-white/8 px-2.5 py-1 text-xs text-slate-300">
            {example}
          </span>
        ))}
      </div>
      <Button asChild className="mt-5 w-full">
        <Link href={`/chat/${expert.slug}`}>
          Start Chat <ArrowRight className="size-4" />
        </Link>
      </Button>
    </Card>
  );
}
