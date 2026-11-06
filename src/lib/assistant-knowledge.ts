export type AssistantCategory =
  | "news-group"
  | "batch-group"
  | "specialization-group"
  | "study-resource"
  | "platform";

export type AssistantKnowledgeItem = {
  id: string;
  category: AssistantCategory;
  title: string;
  description: string;
  url?: string;
  actionLabel?: string;
  aliases: string[];
};

export const ASSISTANT_KNOWLEDGE: AssistantKnowledgeItem[] = [
  {
    id: "news-main-group",
    category: "news-group",
    title: "مجتمع الأخبار الرئيسية والهامة",
    description: "تابع أخبار HTI والإعلانات والمعلومات المهمة للطلاب.",
    url: "https://chat.whatsapp.com/D0VRuMK7qbXLewzBPoDiCn",
    actionLabel: "انضم للجروب",
    aliases: ["جروب الأخبار", "الأخبار الرئيسية", "الأخبار المهمة", "جروب NEWS", "مجتمع الأخبار"],
  },
  {
    id: "news-shared-subjects-group",
    category: "news-group",
    title: "مجتمع جروبات المواد المشتركة",
    description: "مجتمع جروبات المواد المشتركة بين طلاب HTI.",
    url: "https://chat.whatsapp.com/EwD5y46g9S0HMCZEwxj6Od",
    actionLabel: "انضم للجروب",
    aliases: ["جروبات المواد المشتركة", "جروب المواد", "مواد مشتركة", "مجتمع المواد"],
  },
  {
    id: "news-telegram",
    category: "news-group",
    title: "قناة Telegram الخاصة بـ NEWS",
    description: "تابع منشورات مجتمع NEWS على تيليجرام.",
    url: "https://t.me/+OPBTFWlIwQIxMzdk",
    actionLabel: "افتح قناة Telegram",
    aliases: ["تلجرام", "تيليجرام", "telegram", "قناة التليجرام", "قناة تيليجرام"],
  },
  {
    id: "batch-2024",
    category: "batch-group",
    title: "مجتمع جروبات مواد دفعة 2024",
    description: "رابط مجتمع جروبات مواد دفعة 2024.",
    url: "https://chat.whatsapp.com/ILtaxG6FAHbGmfEr3hJha1",
    actionLabel: "انضم لجروب دفعة 2024",
    aliases: ["دفعة 2024", "دفعة 24", "جروب 2024", "كميونتي 2024", "مجتمع دفعة 2024", "batch 2024"],
  },
  {
    id: "batch-2025",
    category: "batch-group",
    title: "مجتمع جروبات مواد دفعة 2025",
    description: "رابط مجتمع جروبات مواد دفعة 2025.",
    url: "https://chat.whatsapp.com/F7oFbzqoLqwLLSrJSpJo5F",
    actionLabel: "انضم لجروب دفعة 2025",
    aliases: ["دفعة 2025", "دفعة 25", "جروب 2025", "كميونتي 2025", "مجتمع دفعة 2025", "batch 2025"],
  },
  {
    id: "specialization-accounting",
    category: "specialization-group",
    title: "جروب تخصص Accounting",
    description: "مجتمع طلاب المحاسبة والمراجعة.",
    url: "https://chat.whatsapp.com/HyC2WtS1Kno59t0qRWSbpt",
    actionLabel: "انضم لجروب Accounting",
    aliases: ["accounting", "محاسبة", "المحاسبة", "جروب المحاسبة", "تخصص المحاسبة"],
  },
  {
    id: "specialization-bis",
    category: "specialization-group",
    title: "جروب تخصص BIS",
    description: "مجتمع طلاب نظم معلومات الأعمال.",
    url: "https://chat.whatsapp.com/BYIN2KaLRbb1BliENTR95Y",
    actionLabel: "انضم لجروب BIS",
    aliases: [
      "bis",
      "نظم معلومات",
      "نظم المعلومات",
      "نظم معلومات الأعمال",
      "نظم معلومات الاعمال",
      "جروب نظم",
      "تخصص نظم",
      "معلومات الأعمال",
    ],
  },
  {
    id: "specialization-business-marketing",
    category: "specialization-group",
    title: "جروب Business Administration / Marketing",
    description: "مجتمع طلاب إدارة الأعمال والتسويق.",
    url: "https://chat.whatsapp.com/KgTD91qjcJHIdWR0eFmEJr",
    actionLabel: "انضم لجروب إدارة الأعمال",
    aliases: [
      "business administration",
      "ادارة الاعمال",
      "إدارة الأعمال",
      "جروب ادارة",
      "marketing",
      "تسويق",
      "التسويق",
      "جروب التسويق",
    ],
  },
  {
    id: "unicourses-business-arabic",
    category: "study-resource",
    title: "إدارة الأعمال — عربي",
    description: "الخطة الدراسية وترتيب مواد إدارة الأعمال باللغة العربية.",
    url: "https://yousef-el3sailly.github.io/UniCourses/UniCourses_arabic.html",
    actionLabel: "فتح المصدر",
    aliases: ["ادارة اعمال عربي", "إدارة أعمال عربي", "الخطة العربية", "unicourses عربي", "مواد عربي"],
  },
  {
    id: "unicourses-business-english",
    category: "study-resource",
    title: "إدارة الأعمال — إنجليزي",
    description: "الخطة الدراسية بمواد إدارة الأعمال ومسمياتها باللغة الإنجليزية.",
    url: "https://yousef-el3sailly.github.io/UniCourses/UniCourses_english.html",
    actionLabel: "فتح المصدر",
    aliases: ["ادارة اعمال انجليزي", "إدارة أعمال إنجليزي", "الخطة الانجليزية", "unicourses english", "مواد انجليزي"],
  },
  {
    id: "unicourses-study-plan",
    category: "study-resource",
    title: "اللائحة والخطة الدراسية",
    description: "اللائحة الدراسية وقواعد النجاح والتحويل والساعات.",
    url: "https://yousef-el3sailly.github.io/UniCourses/study_plan.html",
    actionLabel: "فتح المصدر",
    aliases: ["اللائحة", "اللائحة الدراسية", "الخطة الدراسية", "study plan", "لوائح الدراسة"],
  },
  {
    id: "unicourses-flowchart",
    category: "study-resource",
    title: "المخطط الدراسي — Flowchart",
    description: "شجرة المواد والمتطلبات السابقة لكل مادة.",
    url: "https://yousef-el3sailly.github.io/UniCourses/flowchart.html",
    actionLabel: "فتح المصدر",
    aliases: ["المخطط الدراسي", "المخطط", "flowchart", "فلوتشارت", "شجرة المواد", "متطلبات المواد"],
  },
  {
    id: "unicourses-summer-training",
    category: "study-resource",
    title: "التدريب الصيفي",
    description: "معلومات وفرص وإرشادات التدريب الصيفي.",
    url: "https://yousef-el3sailly.github.io/UniCourses/summer-tranning.html",
    actionLabel: "فتح المصدر",
    aliases: ["التدريب الصيفي", "تدريب صيفي", "summer training", "فرص التدريب", "التدريب"],
  },
  {
    id: "unicourses-computer-science",
    category: "study-resource",
    title: "علوم الحاسب",
    description: "المواد والخطط الدراسية والمصادر الخاصة بتخصص علوم الحاسب.",
    url: "https://yousef-el3sailly.github.io/UniCourses/computer_science.html",
    actionLabel: "فتح المصدر",
    aliases: ["علوم الحاسب", "computer science", "كمبيوتر ساينس", "مواد الحاسب", "تخصص الحاسب"],
  },
  {
    id: "unicourses-home",
    category: "study-resource",
    title: "موقع UniCourses الرئيسي",
    description: "افتح الصفحة الرئيسية لمصادر UniCourses HTI.",
    url: "https://yousef-el3sailly.github.io/UniCourses/home.html",
    actionLabel: "فتح المصدر",
    aliases: ["موقع unicourses", "موقع يوني كورسز", "unicourses", "موقع المصادر", "الموقع الرئيسي"],
  },
  {
    id: "platform-about",
    category: "platform",
    title: "عن NEWS × UniCourses HTI",
    description: "منصة تجمع مجتمع NEWS وأخباره مع مصادر UniCourses الأكاديمية في مكان واحد.",
    url: "/about",
    actionLabel: "اعرف عن المنصة",
    aliases: ["معلومات المنصة", "عن المنصة", "معلومات الموقع", "قصة المنصة", "مين انتم"],
  },
  {
    id: "platform-schedule",
    category: "platform",
    title: "الجدول الدراسي",
    description: "أنشئ جدولك الدراسي واحفظه لتراجعه بسهولة.",
    url: "/schedule",
    actionLabel: "افتح الجدول الدراسي",
    aliases: ["الجدول", "جدولي", "انشاء جدول", "إنشاء جدول", "جدول دراسي", "مواعيد المحاضرات"],
  },
];

export const ASSISTANT_QUICK_QUESTIONS = [
  { label: "جروبات الدفعات", query: "جروبات الدفعات" },
  { label: "جروبات التخصصات", query: "جروبات التخصصات" },
  { label: "جروبات NEWS", query: "جروبات NEWS" },
  { label: "المصادر الدراسية", query: "المصادر الدراسية" },
  { label: "الخطط والمخططات", query: "الخطط والمخططات" },
  { label: "التدريب الصيفي", query: "التدريب الصيفي" },
];

export const ASSISTANT_WELCOME =
  "أهلاً بيك في UniCourses Assistant 👋\nأنا مساعدك في مجتمع HTI، أقدر أساعدك توصل للجروبات والمصادر الدراسية وكل المعلومات اللي محتاجها.";

export const ASSISTANT_UNKNOWN =
  "مش لاقي المعلومة دي حاليًا، ممكن تحددلي سؤالك بشكل أكتر؟ أقدر أساعدك في جروبات الدفعات والتخصصات وNEWS، أو مصادر وخطط UniCourses.";