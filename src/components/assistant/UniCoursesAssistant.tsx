import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import {
  Bot,
  BookOpen,
  ExternalLink,
  GraduationCap,
  MessageCircle,
  Plus,
  Send,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  ASSISTANT_QUICK_QUESTIONS,
  ASSISTANT_UNKNOWN,
  ASSISTANT_WELCOME,
  type AssistantKnowledgeItem,
} from "@/lib/assistant-knowledge";
import { searchAssistantKnowledge } from "@/lib/assistant-search";

type AssistantMessage = {
  id: number;
  role: "assistant" | "user";
  text: string;
  results?: AssistantKnowledgeItem[];
};

const INITIAL_MESSAGES: AssistantMessage[] = [{ id: 0, role: "assistant", text: ASSISTANT_WELCOME }];

function responseFor(query: string): { text: string; results: AssistantKnowledgeItem[] } {
  const results = searchAssistantKnowledge(query);
  if (results.length === 0) return { text: ASSISTANT_UNKNOWN, results };
  if (results.length > 1) {
    return {
      text: "أكيد! 👋 دي المعلومات المتاحة:",
      results,
    };
  }

  const item = results[0];
  if (!item) return { text: ASSISTANT_UNKNOWN, results: [] };

  if (item.category === "batch-group") {
    return { text: `أكيد! 👋 ده ${item.title}.`, results };
  }
  if (item.category === "specialization-group") {
    return { text: `أكيد! 👋 ده مجتمع ${item.title.replace("جروب تخصص ", "تخصص ")}.`, results };
  }
  if (item.category === "news-group") {
    return { text: `اتفضل 👋 ${item.title}:`, results };
  }
  return { text: `اتفضل 👋 ده ${item.title}. ${item.description}`, results };
}

function ResultCard({ item }: { item: AssistantKnowledgeItem }) {
  if (!item.url) return null;
  const external = item.url.startsWith("http");

  return (
    <article className="mt-2 rounded-lg border border-border bg-card px-3.5 py-3 text-start">
      <h3 className="text-sm font-bold leading-relaxed text-foreground">{item.title}</h3>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.description}</p>
      <a
        href={item.url}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer noopener" : undefined}
        className="mt-3 inline-flex min-h-9 items-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-bold text-primary-foreground transition-colors hover:bg-primary-soft"
      >
        {item.actionLabel ?? "فتح المصدر"}
        {external ? <ExternalLink className="size-3.5" /> : null}
      </a>
    </article>
  );
}

function categoryIcon(label: string) {
  if (label.includes("دفعات")) return Users;
  if (label.includes("تخصصات") || label.includes("NEWS")) return GraduationCap;
  if (label.includes("مصادر") || label.includes("خطط")) return BookOpen;
  return Sparkles;
}

export function UniCoursesAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const messageSequence = useRef(1);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [messages, showQuickQuestions]);

  function startNewConversation() {
    messageSequence.current = 1;
    setMessages(INITIAL_MESSAGES);
    setInput("");
    setShowQuickQuestions(true);
    inputRef.current?.focus();
  }

  function sendQuestion(question: string) {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) return;

    const answer = responseFor(trimmedQuestion);
    const nextId = messageSequence.current;
    messageSequence.current += 2;
    setMessages((current) => [
      ...current,
      { id: nextId, role: "user", text: trimmedQuestion },
      { id: nextId + 1, role: "assistant", text: answer.text, results: answer.results },
    ]);
    setShowQuickQuestions(false);
    setInput("");
    inputRef.current?.focus();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendQuestion(input);
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendQuestion(input);
    }
  }

  return (
    <div className="fixed bottom-4 end-4 z-[60] flex flex-col items-end gap-3 sm:bottom-6 sm:end-6" dir="rtl">
      {open && (
        <section
          aria-label="محادثة UniCourses Assistant"
          className="flex h-[min(640px,calc(100dvh-112px))] max-h-[calc(100dvh-96px)] w-[min(400px,calc(100vw-32px))] flex-col overflow-hidden rounded-xl border border-border bg-background shadow-[var(--shadow-lifted)]"
        >
          <header className="flex shrink-0 items-center justify-between gap-3 bg-sidebar px-4 py-3 text-sidebar-foreground">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Bot className="size-5" />
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-sm font-extrabold">UniCourses Assistant</h2>
                <p className="mt-0.5 text-[11px] text-sidebar-foreground/75">مساعدك في مجتمع HTI</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="بدء محادثة جديدة ومسح المحادثة الحالية"
                title="محادثة جديدة"
                onClick={startNewConversation}
                className="size-9 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
              >
                <Plus className="size-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="إغلاق المحادثة"
                title="إغلاق المحادثة"
                onClick={() => setOpen(false)}
                className="size-9 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
              >
                <X className="size-4" />
              </Button>
            </div>
          </header>

          <div
            ref={transcriptRef}
            role="log"
            aria-live="polite"
            aria-label="رسائل المحادثة"
            className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-4"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[90%] ${message.role === "user" ? "rounded-lg bg-primary px-3.5 py-2.5 text-primary-foreground" : "text-foreground"}`}
                >
                  <p className="whitespace-pre-line text-sm leading-relaxed">{message.text}</p>
                  {message.results?.map((item) => <ResultCard key={item.id} item={item} />)}
                </div>
              </div>
            ))}

            {showQuickQuestions && (
              <div className="pt-1">
                <p className="mb-2 text-xs font-bold text-muted-foreground">ممكن تسأل عن:</p>
                <div className="flex flex-wrap gap-2">
                  {ASSISTANT_QUICK_QUESTIONS.map(({ label, query }) => {
                    const Icon = categoryIcon(label);
                    return (
                      <Button
                        key={label}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => sendQuestion(query)}
                        className="h-auto min-h-8 whitespace-normal px-2.5 py-1.5 text-xs"
                      >
                        <Icon className="size-3.5" />
                        {label}
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="shrink-0 border-t border-border bg-card p-3">
            <div className="flex items-end gap-2">
              <Textarea
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="اكتب سؤالك هنا..."
                aria-label="اكتب سؤالك لمساعد UniCourses"
                rows={1}
                className="max-h-28 min-h-10 resize-none rounded-lg bg-background py-2.5 text-sm"
              />
              <Button
                type="submit"
                size="icon"
                aria-label="إرسال السؤال"
                disabled={!input.trim()}
                className="size-10 shrink-0 rounded-lg"
              >
                <Send className="size-4" />
              </Button>
            </div>
          </form>
        </section>
      )}

      <Button
        type="button"
        aria-expanded={open}
        aria-label={open ? "إغلاق UniCourses Assistant" : "افتح UniCourses Assistant"}
        onClick={() => setOpen((current) => !current)}
        className="size-14 rounded-full shadow-[var(--shadow-lifted)] sm:size-15"
      >
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
      </Button>
    </div>
  );
}