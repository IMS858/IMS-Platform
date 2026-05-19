export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
      <div>
        {eyebrow && (
          <p className="eyebrow mb-1.5">{eyebrow}</p>
        )}
        <h1 className="font-display text-3xl md:text-[2.25rem] font-medium tracking-tight text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}
