import { describe, expect, test } from "node:test";
import { searchAssistantKnowledge } from "@/lib/assistant-search";

function resultFor(question: string) {
  return searchAssistantKnowledge(question)[0];
}

describe("UniCourses Assistant local Arabic search", () => {
  test.each([
    ["فين جروب دفعة 24؟", "batch-2024", "https://chat.whatsapp.com/ILtaxG6FAHbGmfEr3hJha1"],
    ["عايز جروب 2024", "batch-2024", "https://chat.whatsapp.com/ILtaxG6FAHbGmfEr3hJha1"],
    ["لينك كميونتي دفعة 24", "batch-2024", "https://chat.whatsapp.com/ILtaxG6FAHbGmfEr3hJha1"],
    ["أنا تخصص BIS", "specialization-bis", "https://chat.whatsapp.com/BYIN2KaLRbb1BliENTR95Y"],
    ["جروب نظم معلومات", "specialization-bis", "https://chat.whatsapp.com/BYIN2KaLRbb1BliENTR95Y"],
    ["عايز جروب نظم", "specialization-bis", "https://chat.whatsapp.com/BYIN2KaLRbb1BliENTR95Y"],
    ["عايز المخطط الدراسي", "unicourses-flowchart", "https://yousef-el3sailly.github.io/UniCourses/flowchart.html"],
    ["فين الفلوتشارت", "unicourses-flowchart", "https://yousef-el3sailly.github.io/UniCourses/flowchart.html"],
    ["Flowchart", "unicourses-flowchart", "https://yousef-el3sailly.github.io/UniCourses/flowchart.html"],
    ["فين جروب دفعة ٢٠٢٥", "batch-2025", "https://chat.whatsapp.com/F7oFbzqoLqwLLSrJSpJo5F"],
  ])("maps %s to its verified resource", (question, id, url) => {
    const result = resultFor(question);
    expect(result?.id).toBe(id);
    expect(result?.url).toBe(url);
  });

  test("does not invent a result for an unknown question", () => {
    expect(searchAssistantKnowledge("ما هي مواعيد امتحاناتي؟")).toEqual([]);
  });

  test("returns every batch community for a general batches question", () => {
    expect(searchAssistantKnowledge("جروبات الدفعات").map((item) => item.id)).toEqual([
      "batch-2024",
      "batch-2025",
    ]);
  });
});