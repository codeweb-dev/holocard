export function SectionTitle({
  children,
  note,
}: {
  children: string;
  note: string;
}) {
  return (
    <h2 className="mb-2 text-[12.5px] font-medium tracking-[-0.009em] text-card-foreground">
      {children}
      <small className="ml-2 text-[11px] font-normal text-muted-foreground">
        {note}
      </small>
    </h2>
  );
}
