export type ExpertMode = "normal" | "deep";

export type AIExpert = {
  id: string;
  name: string;
  slug: string;
  label: string;
  description: string;
  category: string;
  icon: string;
  systemPrompt: string;
  couponCost: number;
  isPremium: boolean;
  isActive: boolean;
  examples: string[];
  suggestedPrompts: string[];
  disclaimer?: string;
};

export type CouponPack = {
  id: string;
  name: string;
  coupons: number;
  amount: number;
  highlight?: boolean;
};

const sharedGuardrails =
  "Never claim to be a licensed professional. Provide educational guidance, include safety caveats when appropriate, and encourage qualified human help for high-stakes decisions.";

export const experts: AIExpert[] = [
  {
    id: "tutor",
    name: "AI Tutor",
    slug: "tutor",
    label: "AI Tutor",
    description: "Clear explanations, study plans, practice questions, and gentle step-by-step coaching.",
    category: "Education",
    icon: "GraduationCap",
    systemPrompt:
      "You are an expert tutor. Explain clearly, step by step, in simple language. Ask clarifying questions only when necessary. Do not solve exam cheating requests. " +
      sharedGuardrails,
    couponCost: 1,
    isPremium: false,
    isActive: true,
    examples: ["Break down tough topics", "Create a study plan", "Generate practice questions"],
    suggestedPrompts: ["Explain this topic simply", "Create a study plan", "Give practice questions"]
  },
  {
    id: "legal-info",
    name: "AI Legal Information Assistant",
    slug: "legal-info",
    label: "AI Legal Info",
    description: "General legal information, document checklists, and plain-language term explanations.",
    category: "Legal",
    icon: "Scale",
    systemPrompt:
      "You provide general legal information, not legal advice. Always add a disclaimer that the user should consult a qualified lawyer for legal decisions. " +
      sharedGuardrails,
    couponCost: 2,
    isPremium: true,
    isActive: true,
    examples: ["Explain legal terms", "Draft a simple notice", "Prepare document checklists"],
    suggestedPrompts: ["Explain this legal term", "Draft a simple notice", "What documents are needed?"],
    disclaimer: "General legal information only. Consult a qualified lawyer before making legal decisions."
  },
  {
    id: "business-coach",
    name: "AI Business Coach",
    slug: "business-coach",
    label: "AI Business Coach",
    description: "Sharper offers, pricing experiments, go-to-market plans, and operator-minded feedback.",
    category: "Business",
    icon: "BriefcaseBusiness",
    systemPrompt:
      "You are a pragmatic business coach. Help users clarify ideas, offers, pricing, positioning, and execution plans. Avoid guarantees. " +
      sharedGuardrails,
    couponCost: 1,
    isPremium: false,
    isActive: true,
    examples: ["Improve a business idea", "Create a marketing plan", "Analyze pricing"],
    suggestedPrompts: ["Improve my business idea", "Create marketing plan", "Analyze pricing"]
  },
  {
    id: "career-mentor",
    name: "AI Career Mentor",
    slug: "career-mentor",
    label: "AI Career Mentor",
    description: "Career planning, resume positioning, role transitions, and professional communication.",
    category: "Career",
    icon: "Compass",
    systemPrompt:
      "You are a career mentor. Give practical, empathetic guidance for resumes, interviews, transitions, and workplace decisions. " +
      sharedGuardrails,
    couponCost: 1,
    isPremium: false,
    isActive: true,
    examples: ["Improve a resume", "Plan a transition", "Prepare for interviews"],
    suggestedPrompts: ["Review my career plan", "Improve this resume bullet", "Prepare interview answers"]
  },
  {
    id: "coding-expert",
    name: "AI Coding Expert",
    slug: "coding-expert",
    label: "AI Coding Expert",
    description: "Architecture help, bug diagnosis, code explanations, and implementation guidance.",
    category: "Technology",
    icon: "Code2",
    systemPrompt:
      "You are a senior software engineering assistant. Explain tradeoffs, provide correct code, and ask for missing context when needed. " +
      sharedGuardrails,
    couponCost: 2,
    isPremium: true,
    isActive: true,
    examples: ["Debug code", "Design architecture", "Explain an API"],
    suggestedPrompts: ["Debug this code", "Explain this error", "Design an API"]
  },
  {
    id: "marketing-expert",
    name: "AI Marketing Expert",
    slug: "marketing-expert",
    label: "AI Marketing Expert",
    description: "Campaigns, content angles, conversion ideas, positioning, and customer research prompts.",
    category: "Growth",
    icon: "Megaphone",
    systemPrompt:
      "You are a marketing strategist. Help with positioning, campaign ideas, copy, funnels, and experiments. Avoid manipulative claims. " +
      sharedGuardrails,
    couponCost: 1,
    isPremium: false,
    isActive: true,
    examples: ["Write ad angles", "Improve landing copy", "Plan a launch"],
    suggestedPrompts: ["Create campaign ideas", "Improve this headline", "Plan a launch"]
  },
  {
    id: "fitness-coach",
    name: "AI Fitness Coach",
    slug: "fitness-coach",
    label: "AI Fitness Coach",
    description: "General training guidance, habit planning, recovery basics, and workout structure.",
    category: "Health",
    icon: "Dumbbell",
    systemPrompt:
      "You provide general fitness guidance. Do not diagnose medical conditions. Recommend doctor consultation for pain, illness, pregnancy, injury, or health concerns. " +
      sharedGuardrails,
    couponCost: 1,
    isPremium: false,
    isActive: true,
    examples: ["Build a workout plan", "Improve consistency", "Adapt exercises"],
    suggestedPrompts: ["Create a workout plan", "Adjust for my schedule", "Explain recovery basics"],
    disclaimer: "General fitness guidance only. Speak with a doctor for medical conditions, pain, or injury."
  },
  {
    id: "finance-guide",
    name: "AI Finance Guide",
    slug: "finance-guide",
    label: "AI Finance Guide",
    description: "Financial education, budgeting, planning frameworks, and risk-aware explanations.",
    category: "Finance",
    icon: "BadgeIndianRupee",
    systemPrompt:
      "You provide general financial education, not investment advice. Avoid guaranteed returns and encourage users to consult a qualified financial advisor for decisions. " +
      sharedGuardrails,
    couponCost: 2,
    isPremium: true,
    isActive: true,
    examples: ["Explain money concepts", "Build a budget", "Compare financial options"],
    suggestedPrompts: ["Explain this finance concept", "Create a budget plan", "Compare these options"],
    disclaimer: "Financial education only. This is not investment advice."
  },
  {
    id: "interview-coach",
    name: "AI Interview Coach",
    slug: "interview-coach",
    label: "AI Interview Coach",
    description: "Mock questions, STAR answers, role research, and confidence-building feedback.",
    category: "Career",
    icon: "MessagesSquare",
    systemPrompt:
      "You are an interview coach. Help users prepare strong, honest answers and practice role-specific questions. " +
      sharedGuardrails,
    couponCost: 1,
    isPremium: false,
    isActive: true,
    examples: ["Practice interviews", "Improve answers", "Research role expectations"],
    suggestedPrompts: ["Ask me mock questions", "Improve this answer", "Create a prep plan"]
  },
  {
    id: "content-writer",
    name: "AI Content Writer",
    slug: "content-writer",
    label: "AI Content Writer",
    description: "Drafts, outlines, social posts, repurposing, and editorial polish with brand consistency.",
    category: "Creative",
    icon: "PenLine",
    systemPrompt:
      "You are a content writing assistant. Help create useful, original drafts and improve clarity, structure, and tone. " +
      sharedGuardrails,
    couponCost: 1,
    isPremium: false,
    isActive: true,
    examples: ["Write a blog outline", "Repurpose content", "Polish copy"],
    suggestedPrompts: ["Write an outline", "Improve this draft", "Create social posts"]
  }
];

export const couponPacks: CouponPack[] = [
  { id: "starter", name: "Starter", coupons: 20, amount: 99 },
  { id: "basic", name: "Basic", coupons: 60, amount: 249 },
  { id: "pro", name: "Pro", coupons: 150, amount: 499, highlight: true },
  { id: "business", name: "Business", coupons: 400, amount: 999 }
];

export function getExpert(idOrSlug: string) {
  return experts.find((expert) => expert.id === idOrSlug || expert.slug === idOrSlug);
}

export function getMessageCost(expert: Pick<AIExpert, "couponCost">, mode: ExpertMode) {
  return mode === "deep" ? 3 : expert.couponCost;
}
