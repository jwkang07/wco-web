import type { ReactNode } from "react";

type SectionProps = {
  title?: string;
  description?: string;
  variant?: "white" | "peach";
  children?: ReactNode;
};

export function Section({
  title,
  description,
  variant = "white",
  children,
}: SectionProps) {
  return (
    <section
      className={variant === "peach" ? "bg-neutral-50" : "bg-white"}
    >
      <div className="container py-14 sm:py-16">
        {title ? (
          <header className="mb-8 max-w-2xl">
            <h2 className="font-serif text-2xl font-bold text-wco-grey sm:text-3xl">
              {title}
            </h2>
            {description ? (
              <p className="mt-3 text-base text-wco-muted">{description}</p>
            ) : null}
          </header>
        ) : null}
        {children}
      </div>
    </section>
  );
}
