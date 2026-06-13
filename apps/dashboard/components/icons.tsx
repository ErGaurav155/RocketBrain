import {
  BadgeIndianRupee,
  BriefcaseBusiness,
  Code2,
  Compass,
  Dumbbell,
  GraduationCap,
  Megaphone,
  MessagesSquare,
  PenLine,
  Scale,
  Sparkles
} from "lucide-react";

const icons = {
  BadgeIndianRupee,
  BriefcaseBusiness,
  Code2,
  Compass,
  Dumbbell,
  GraduationCap,
  Megaphone,
  MessagesSquare,
  PenLine,
  Scale
};

export function ExpertIcon({ name, className }: { name: string; className?: string }) {
  const Icon = icons[name as keyof typeof icons] || Sparkles;
  return <Icon className={className} />;
}
