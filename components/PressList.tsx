type PressListProps = {
  items: readonly {
    date: string;
    title: string;
    source: string;
    href: string;
  }[];
};

export function PressList({ items }: PressListProps) {
  return (
    <ul className="divide-y divide-wco-peach border-y border-wco-peach">
      {items.map((item) => (
        <li key={item.date + item.title}>
          <a
            href={item.href}
            className="group flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-wco-orange">{item.date}</p>
              <h3 className="mt-1 font-serif text-lg font-bold text-wco-grey group-hover:text-wco-orange">
                {item.title}
              </h3>
              <p className="mt-1 text-sm text-wco-muted">{item.source}</p>
            </div>
            <span className="shrink-0 text-sm font-semibold text-wco-orange">
              자세히 보기 →
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
