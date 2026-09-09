export function PlaceholderPage({
  heading,
  description,
  items,
}: {
  heading: string;
  description: string;
  items: string[];
}) {
  return (
    <section>
      <h1 className="text-3xl font-semibold uppercase tracking-wide">{heading}</h1>
      <p className="mt-2 max-w-prose text-sm text-muted-foreground">{description}</p>
      <ul className="mt-6 space-y-2">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-lg border border-dashed border-border bg-card px-4 py-4 text-sm text-muted-foreground"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
