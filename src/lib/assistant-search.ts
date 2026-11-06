import {
  ASSISTANT_KNOWLEDGE,
  type AssistantCategory,
  type AssistantKnowledgeItem,
} from "@/lib/assistant-knowledge";

export function normalizeAssistantText(value: string): string {
  const arabicDigits = "٠١٢٣٤٥٦٧٨٩";
  return value
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/\u0640/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[٠-٩]/g, (digit) => String(arabicDigits.indexOf(digit)))
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .replace(/\s+/g, " ");
}

const normalizedKnowledge = ASSISTANT_KNOWLEDGE.map((item) => ({
  item,
  aliases: item.aliases.map(normalizeAssistantText),
}));

function getBatchYear(query: string): string | null {
  const match = query.match(/(?:دفعة\s*)?(202[1-9]|2[1-9])\b/);
  if (!match?.[1]) return null;
  const value = match[1];
  return value.length === 2 ? `20${value}` : value;
}

function browseByIntent(query: string): AssistantKnowledgeItem[] | null {
  const has = (...terms: string[]) => terms.some((term) => query.includes(term));
  const year = getBatchYear(query);
  const categoryItems = (category: AssistantCategory) =>
    ASSISTANT_KNOWLEDGE.filter((item) => item.category === category);

  if (year) {
    const match = ASSISTANT_KNOWLEDGE.find(
      (item) => item.category === "batch-group" && item.id === `batch-${year}`,
    );
    return match ? [match] : [];
  }

  if (has("جروبات الدفعات", "جروب الدفعات", "دفعات", "الدفعات", "batch groups")) {
    return categoryItems("batch-group");
  }

  if (has("جروبات التخصصات", "جروب التخصصات", "تخصصات", "التخصصات", "specialization groups")) {
    return categoryItems("specialization-group");
  }

  if (
    has("جروبات news", "جروب news", "جروبات الاخبار", "جروب الاخبار", "مجتمع news") &&
    !has("تيليجرام", "تلجرام", "telegram")
  ) {
    return categoryItems("news-group");
  }

  if (has("الخطط والمخططات", "خطط ومخططات", "الخطط الدراسية", "الخطط", "المخططات")) {
    return ASSISTANT_KNOWLEDGE.filter(
      (item) => item.id === "unicourses-study-plan" || item.id === "unicourses-flowchart",
    );
  }

  if (has("المصادر الدراسية", "كل المصادر", "مصادر unicourses", "المصادر", "المصادر الأكاديمية")) {
    return categoryItems("study-resource");
  }

  if (has("جروبات news", "جروب news", "جروبات الاخبار", "جروب الاخبار", "مجتمع news")) {
    return categoryItems("news-group");
  }

  return null;
}

function scoreItem(query: string, tokens: string[], aliases: string[]): number {
  let score = 0;
  const uniqueTokens = new Set(tokens);

  for (const alias of aliases) {
    if (!alias) continue;
    if (query.includes(alias)) {
      score = Math.max(score, alias.length <= 4 ? 8 : 12 + Math.min(alias.length / 12, 4));
      continue;
    }
    const aliasTokens = alias.split(" ").filter((token) => token.length > 1);
    const overlap = aliasTokens.filter((token) => uniqueTokens.has(token)).length;
    if (overlap > 0) score = Math.max(score, overlap * 3 + (overlap === aliasTokens.length ? 3 : 0));
  }

  return score;
}

export function searchAssistantKnowledge(question: string): AssistantKnowledgeItem[] {
  const query = normalizeAssistantText(question);
  if (!query) return [];

  const intentResults = browseByIntent(query);
  if (intentResults) return intentResults;

  const tokens = query.split(" ").filter((token) => token.length > 1);
  const ranked = normalizedKnowledge
    .map(({ item, aliases }) => ({ item, score: scoreItem(query, tokens, aliases) }))
    .filter(({ score }) => score >= 6)
    .sort((left, right) => right.score - left.score);

  if (!ranked[0]) return [];
  const bestScore = ranked[0].score;
  return ranked.filter(({ score }) => score === bestScore).slice(0, 4).map(({ item }) => item);
}