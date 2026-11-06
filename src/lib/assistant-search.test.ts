import { deepStrictEqual, strictEqual } from "node:assert";
import { describe, it } from "node:test";
import { searchAssistantKnowledge } from "@/lib/assistant-search";

function resultFor(question: string) {
  return searchAssistantKnowledge(question)[0];
}

describe("UniCourses Assistant local Arabic search", () => {
  it("maps the requested sample questions to their verified resources", () => {
    const cases: Array<[string, string, string]> = [
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
    ];

    for (const [question, id, url] of cases) {
      const result = resultFor(question);
      strictEqual(result?.id, id, question);
      strictEqual(result?.url, url, question);
    }
  });

  it("does not invent a result for an unknown question", () => {
    deepStrictEqual(searchAssistantKnowledge("ما هي مواعيد امتحاناتي؟"), []);
  });

  it("returns every batch community for a general batches question", () => {
    deepStrictEqual(searchAssistantKnowledge("جروبات الدفعات").map((item) => item.id), [
      "batch-2024",
      "batch-2025",
    ]);
  });
});