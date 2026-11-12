export function MenuSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3.5">
      <h2 className="px-0.5 text-sm font-bold tracking-tight text-slate-900">
        {title}
      </h2>
      <div className="space-y-3.5">{children}</div>
    </section>
  );
}
