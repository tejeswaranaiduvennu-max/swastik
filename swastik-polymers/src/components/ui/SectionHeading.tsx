import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center"
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  const alignCls = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <Reveal className={`max-w-2xl ${alignCls}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="heading mt-2">{title}</h2>
      {description && (
        <p className="mt-4 text-[19px] leading-relaxed text-brand-muted sm:text-[21px]">
          {description}
        </p>
      )}
    </Reveal>
  );
}
