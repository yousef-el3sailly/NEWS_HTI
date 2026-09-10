import { forwardRef } from "react";
import logo from "@/assets/news-logo.png";
import { DAYS, DISABLED_DAY, TIME_SLOTS } from "@/lib/constants";
import { formatSpecialization } from "@/lib/format";

/**
 * Printable schedule sheet used for PNG/PDF export.
 * Rendered off-screen and captured with html2canvas-pro — every color here MUST be
 * a plain hex value so the exported image never depends on theme tokens.
 */
const C = {
  ink: "#2B1B16",
  primary: "#5A2028",
  primarySoft: "#8A4048",
  cream: "#FBF6EC",
  sand: "#F1E6D4",
  border: "#DDCDB6",
  white: "#FFFFFF",
  muted: "#7A6A5C",
};

export type ExportEntry = {
  day: number;
  slot: number;
  subject_name: string;
  instructor_name: string | null;
  group_number: string | null;
  room: string | null;
};

export const ExportSheet = forwardRef<
  HTMLDivElement,
  {
    entries: ExportEntry[];
    studentName: string;
    specialization: string;
    batch: string;
  }
>(function ExportSheet({ entries, studentName, specialization, batch }, ref) {
  const byCell = new Map<string, ExportEntry>();
  for (const e of entries) byCell.set(`${e.day}-${e.slot}`, e);

  return (
    <div
      ref={ref}
      dir="rtl"
      className="export-sheet"
      style={{

        width: 1180,
        padding: 28,
        background: C.cream,
        fontFamily: "Cairo, sans-serif",
        color: C.ink,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          background: C.white,
          border: `1px solid ${C.border}`,
          borderRadius: 16,
          padding: "16px 20px",
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src={logo} alt="NEWS" width={54} height={54} style={{ objectFit: "contain" }} />
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.primary, letterSpacing: 2 }}>
              NEWS
            </div>
            <div style={{ fontSize: 12, color: C.muted }}>مجتمع طلاب HTI</div>
          </div>
        </div>

        <div style={{ textAlign: "left" }}>
          <div style={{ fontSize: 18, fontWeight: 800 }}>{studentName}</div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
            {formatSpecialization(specialization)}
            {specialization && batch ? " · " : ""}
            {batch ? `دفعة ${batch}` : ""}
          </div>
          <div style={{ fontSize: 12, color: C.primarySoft, marginTop: 2, fontWeight: 700 }}>
            الجدول الدراسي الأسبوعي
          </div>
        </div>
      </div>

      <table style={{ width: "100%", tableLayout: "fixed", borderCollapse: "separate", borderSpacing: 4 }}>
        <thead>
          <tr>
            <th
              style={{
                width: 120,
                background: C.primary,
                color: C.white,
                fontSize: 12,
                padding: "10px 6px",
                borderRadius: 8,
              }}
            >
              المحاضرة
            </th>
            {DAYS.map((d, i) => (
              <th
                key={d}
                style={{
                  background: i === DISABLED_DAY ? C.sand : C.primary,
                  color: i === DISABLED_DAY ? C.muted : C.white,
                  fontSize: 13,
                  fontWeight: 800,
                  padding: "10px 6px",
                  borderRadius: 8,
                }}
              >
                {d}
                {i === DISABLED_DAY ? (
                  <div style={{ fontSize: 10, fontWeight: 600 }}>إجازة</div>
                ) : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TIME_SLOTS.map((time, slot) => (
            <tr key={time}>
              <td
                style={{
                  background: C.sand,
                  borderRadius: 8,
                  textAlign: "center",
                  padding: "8px 4px",
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 800, color: C.primary }}>{slot + 1}</div>
                <div style={{ fontSize: 10, color: C.muted }}>{time}</div>
              </td>
              {DAYS.map((_, day) => {
                const entry = byCell.get(`${day}-${slot}`);
                const off = day === DISABLED_DAY;
                return (
                  <td
                    key={day}
                    style={{
                      background: off ? C.sand : entry ? "#F6EAE9" : C.white,
                      border: `1px solid ${C.border}`,
                      borderRadius: 8,
                      padding: 8,
                      height: 58,
                      verticalAlign: "middle",
                      textAlign: "center",
                    }}
                  >
                    {entry ? (
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 800, color: C.primary }}>
                          {entry.subject_name}
                        </div>
                        {entry.group_number ? (
                          <div style={{ fontSize: 10, color: C.ink }}>
                            جروب {entry.group_number}
                          </div>
                        ) : null}
                        {entry.instructor_name ? (
                          <div style={{ fontSize: 10, color: C.muted }}>{entry.instructor_name}</div>
                        ) : null}
                        {entry.room ? (
                        <div style={{ fontSize: 10, color: C.primarySoft }}>📍 {entry.room}</div>
                        ) : null}
                      </div>
                    ) : null}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 14, fontSize: 11, color: C.muted, textAlign: "center" }}>
        تم إنشاء هذا الجدول عبر منصة NEWS — مجتمع طلاب HTI
      </div>
    </div>
  );
});
