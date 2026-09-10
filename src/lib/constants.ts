import yousefImage from "@/assets/founders/yousef.jpg";
import bakryImage from "@/assets/founders/bakry.jpeg";
import omarImage from "@/assets/founders/omar.jpeg";
import tarekImage from "@/assets/founders/tarek.jpeg";
import graduateImage from "@/assets/founders/graduate_girl.png";
import ahmedImage from "@/assets/founders/ahmed.jpeg";
import girlImage from "@/assets/founders/girl.png";
import mohamedImage from "@/assets/founders/mohamed.jpeg";
export const SPECIALIZATIONS = [
  {
    id: "bis",
    name: "نظم معلومات الأعمال (BIS)",
    en: "Business Information Systems",
    description: "الجمع بين التقنية والإدارة: قواعد بيانات، تحليل نظم، وتطوير حلول رقمية.",
    icon: "Database",
  },
  {
    id: "business-administration",
    name: "إدارة الأعمال",
    en: "Business Administration",
    description: "إدارة، قيادة، وتخطيط استراتيجي لبناء وتشغيل المؤسسات.",
    icon: "Briefcase",
  },
  {
    id: "accounting",
    name: "المحاسبة والمراجعة",
    en: "Accounting",
    description: "القوائم المالية، المراجعة، والتكاليف بأسلوب عملي ومهني.",
    icon: "Calculator",
  },
  {
    id: "marketing",
    name: "التسويق",
    en: "Marketing",
    description: "سلوك المستهلك، العلامات التجارية، والتسويق الرقمي الحديث.",
    icon: "Megaphone",
  },
  {
    id: "economics",
    name: "اقتصاديات التجارة الدولية",
    en: "Economics",
    description: "التحليل الاقتصادي الجزئي والكلي وفهم الأسواق والسياسات.",
    icon: "TrendingUp",
  },
] as const;

export const SPECIALIZATION_OPTIONS = SPECIALIZATIONS.map((s) => s.name);

/**
 * فريق مؤسسي NEWS.
 * لإضافة صورة شخصية لأي عضو: ضع الصورة في src/assets واستوردها،
 * ثم ضع قيمة الاستيراد (أو رابط الصورة) في الحقل photo بدلاً من null.
 *
 * روابط السوشيال ميديا لكل عضو:
 * - facebookUrl: رابط حساب Facebook
 * - whatsappUrl: رابط WhatsApp (مثلاً https://wa.me/2010xxxxxxx)
 * اترك القيمة فارغة "" إذا لم يتوفر الرابط حاليًا؛ الأيقونة ستظل مرئية كـ placeholder.
 */
export const FOUNDERS: ReadonlyArray<{
  name: string;
  specialization: string | null;
  batch: string;
  role: string;
  photo?: string | null;
  facebookUrl?: string | null;
  whatsappUrl?: string | null;
}> = [
  {
    name: "يوسف العسيلي",
    specialization: "ممثل نظم معلومات الأعمال (BIS)",
    batch: "2022",
    role: "مؤسس ومطور التجربة الرقمية لـ NEWS | ساهم في امتداد NEWS داخل تخصص نظم المعلومات",
    photo: yousefImage,
    facebookUrl: "https://www.facebook.com/JOEelesailly",
    whatsappUrl: "https://wa.me/201013722259",
  },
  {
    name: "بكري مصعب",
    specialization: null,
    batch: "2022",
    role: "مؤسس Community NEWS | من صُنّاع انطلاقة المجتمع",
    photo: bakryImage,
    facebookUrl: "https://www.facebook.com/bkry.mr.510454",
    whatsappUrl: "https://wa.me/963951321467",
  },
  {
    name: "عمر عبد الحكيم",
    specialization: "المحاسبة والمراجعة (Accounting)",
    batch: "2022",
    role: "من أصحاب البصمة في Community NEWS",
    photo: omarImage,
    facebookUrl: "https://www.facebook.com/omar.abdelhakeem.108",
    whatsappUrl: "https://wa.me/201225422107",
  },
  {
    name: "طارق إسماعيل",
    specialization: "المحاسبة والمراجعة (Accounting)",
    batch: "2022",
    role: "من الجيل الأول لـ Community NEWS",
    photo: tarekImage,
    facebookUrl: "https://www.facebook.com/tarek.askar.359",
    whatsappUrl: "https://wa.me/201095657521",
  },
  {
    name: "آلاء وليد",
    specialization: "المحاسبة والمراجعة (Accounting)",
    batch: "2022",
    role: "جزء من البدايات الأولى لـ Community NEWS | من الشخصيات الأساسية في مسيرة المجتمع",
    photo: graduateImage,
    facebookUrl: "",
    whatsappUrl: "",
  },
  {
    name: "أحمد سامح",
    specialization: "إدارة الأعمال (Business Administration)",
    batch: "2022",
    role: "ساهم في امتداد NEWS داخل تخصص إدارة الأعمال",
    photo: ahmedImage,
    facebookUrl: "https://www.facebook.com/ahmed.sameheyada.9",
    whatsappUrl: "https://wa.me/201066782086",
  },
  {
    name: "مريم عبد الله",
    specialization: "نظم معلومات الأعمال (BIS)",
    batch: "2022",
    role: "جزء من مسيرة Community NEWS",
    photo: graduateImage,
    facebookUrl: "",
    whatsappUrl: "",
  },
  {
    name: "رحمة محمد زهران",
    specialization: "نظم معلومات الأعمال (BIS)",
    batch: "2023",
    role: "من المشاركات في Community NEWS",
    photo: girlImage,
    facebookUrl: "",
    whatsappUrl: "",
  },
  {
    name: "شروق عبد العال",
    specialization: "المحاسبة والمراجعة (Accounting)",
    batch: "2023",
    role: "من الوجوه المشاركة في Community NEWS",
    photo: girlImage,
    facebookUrl: "",
    whatsappUrl: "",
  },
  {
    name: "محمد عبدالقادر",
    specialization: "نظم معلومات الأعمال (BIS)",
    batch: "2024",
    role: "ساهم في بناء الجيل الجديد من Community NEWS",
    photo: mohamedImage,
    facebookUrl: "https://www.facebook.com/mohammed.abdul.qader.891252",
    whatsappUrl: "https://wa.me/201027213340",
  },
  {
    name: "هاجر ضاحي",
    specialization: "المحاسبة والمراجعة (Accounting)",
    batch: "2024",
    role: "جزء من توسّع Community NEWS",
    photo: girlImage,
    facebookUrl: "",
    whatsappUrl: "",
  },
  {
    name: "مريم متولي",
    specialization: "إدارة الأعمال (Business Administration)",
    batch: "2025",
    role: "إضافة مميزة إلى NEWS | من الوجوه المميزة في الدفعات الجديدة",
    photo: girlImage,
    facebookUrl: "",
    whatsappUrl: "",
  },
];

export const UNICOURSES_LINKS = [
  {
    title: "إدارة الأعمال — عربي",
    subtitle: "Business Administration — Arabic",
    description: "الخطة الدراسية وترتيب المواد باللغة العربية.",
    url: "https://yousef-el3sailly.github.io/UniCourses/UniCourses_arabic.html",
    icon: "BookOpen",
  },
  {
    title: "إدارة الأعمال — إنجليزي",
    subtitle: "Business Administration — English",
    description: "نفس الخطة الدراسية بالمسميات الإنجليزية للمواد.",
    url: "https://yousef-el3sailly.github.io/UniCourses/UniCourses_english.html",
    icon: "Languages",
  },
  {
    title: "الـ Flowchart",
    subtitle: "Flowchart",
    description: "شجرة المواد والمتطلبات السابقة لكل مادة.",
    url: "https://yousef-el3sailly.github.io/UniCourses/flowchart.html",
    icon: "Workflow",
  },
  {
    title: "اللائحة والخطة الدراسية",
    subtitle: "Study Plan / Regulations",
    description: "اللائحة الدراسية وقواعد النجاح والتحويل والساعات.",
    url: "https://yousef-el3sailly.github.io/UniCourses/study_plan.html",
    icon: "ScrollText",
  },
  {
    title: "التدريب الصيفي",
    subtitle: "Summer Training",
    description: "كل ما يخص التدريب الصيفي من معلومات وفرص وإرشادات للطلاب.",
    url: "https://yousef-el3sailly.github.io/UniCourses/summer-tranning.html",
    icon: "Briefcase",
  },
  {
    title: "علوم الحاسب",
    subtitle: "Computer Science",
    description: "جميع المواد والخطط الدراسية والمصادر الخاصة بتخصص علوم الحاسب.",
    url: "https://yousef-el3sailly.github.io/UniCourses/computer_science.html",
    icon: "Code",
  },
] as const;

export const DAYS = ["السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"] as const;

/** Thursday index — schedule editing is disabled on this day. */
export const DISABLED_DAY = 5;

/** Maximum number of subjects a student may add per allowed day. */
export const MAX_SUBJECTS_PER_DAY = 2;

export const TIME_SLOTS = [
  "9:00 - 9:45",
  "9:45 - 10:30",
  "10:40 - 11:25",
  "11:25 - 12:10",
  "12:20 - 1:05",
  "1:05 - 1:50",
  "2:00 - 2:45",
  "2:45 - 3:30",
  "3:30 - 4:15",
  "4:15 - 5:00",
] as const;

export const NEWS_CATEGORIES = [
  "أخبار",
  "إعلانات",
  "فعاليات",
  "مهم",
  "أكاديمي",
  "المجتمع",
] as const;

export const BATCH_OPTIONS = ["2021", "2022", "2023", "2024", "2025", "2026"];
