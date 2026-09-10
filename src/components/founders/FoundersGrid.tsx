import { Facebook, GraduationCap, User } from "lucide-react";
import { FOUNDERS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { formatSpecialization } from "@/lib/format";

type Founder = (typeof FOUNDERS)[number];

// أيقونة واتساب (غير متوفرة في lucide)
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

function SocialLinks({ founder }: { founder: Founder }) {
  const facebook = founder.facebookUrl?.trim() || "#";
  const whatsapp = founder.whatsappUrl?.trim() || "#";
  const hasFacebook = Boolean(founder.facebookUrl?.trim());
  const hasWhatsapp = Boolean(founder.whatsappUrl?.trim());

  const btnClass =
    "inline-flex size-9 items-center justify-center rounded-full border border-primary/20 bg-secondary text-primary transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-md";
  const placeholderClass =
    "inline-flex size-9 items-center justify-center rounded-full border border-primary/10 bg-secondary/60 text-primary/40 cursor-default";

  return (
    <div className="mt-1 flex items-center justify-center gap-2.5">
      {hasWhatsapp ? (
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`واتساب ${founder.name}`}
          title="واتساب"
          className={btnClass}
        >
          <WhatsAppIcon className="size-4" />
        </a>
      ) : (
        <span aria-label={`واتساب ${founder.name} (لا يوجد رابط)`} title="واتساب" className={placeholderClass}>
          <WhatsAppIcon className="size-4" />
        </span>
      )}
      {hasFacebook ? (
        <a
          href={facebook}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`فيسبوك ${founder.name}`}
          title="فيسبوك"
          className={btnClass}
        >
          <Facebook className="size-4" />
        </a>
      ) : (
        <span aria-label={`فيسبوك ${founder.name} (لا يوجد رابط)`} title="فيسبوك" className={placeholderClass}>
          <Facebook className="size-4" />
        </span>
      )}
    </div>
  );
}

export function FounderCard({ founder, index = 0 }: { founder: Founder; index?: number }) {
  const photo = founder.photo ?? null;

  return (
    <article
      className="surface-card group animate-fade-up flex h-full min-w-0 flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[var(--shadow-lifted)]"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* صورة العضو — نسبة ثابتة لكل الكروت */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-br from-secondary to-accent">
        {photo ? (
          <img
            src={photo}
            alt={founder.name}
            loading="lazy"
            decoding="async"
            className="size-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            style={{ objectFit: "cover", objectPosition: "center top" }}
          />
        ) : (
          <span className="flex size-full items-center justify-center text-primary/40">
            <User className="size-14" />
          </span>
        )}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1 origin-center scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col items-center gap-2 p-5 text-center">
        <h3 className="min-w-0 break-words text-base font-bold leading-snug text-foreground">
          {founder.name}
        </h3>
        {founder.role && (
          <p className="min-w-0 break-words text-xs font-bold text-primary-soft">{founder.role}</p>
        )}
        {founder.specialization && (
          <p className="min-w-0 break-words text-xs leading-relaxed text-muted-foreground">
            {formatSpecialization(founder.specialization)}
          </p>
        )}
        <p className="mt-auto inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 pt-1 text-[11px] font-semibold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <GraduationCap className="size-3.5" /> دفعة {founder.batch}
        </p>
        <SocialLinks founder={founder} />
      </div>
    </article>
  );
}

export function FoundersGrid({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
        className,
      )}
    >
      {FOUNDERS.map((f, i) => (
        <FounderCard key={f.name} founder={f} index={i} />
      ))}
    </div>
  );
}
