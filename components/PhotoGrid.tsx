type PhotoGridProps = {
  items: readonly {
    title: string;
    caption: string;
    year: string;
    imageSrc?: string;
  }[];
};

export function PhotoGrid({ items }: PhotoGridProps) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li key={`${item.year}-${item.title}`}>
          <figure className="overflow-hidden rounded-xl border border-wco-peach bg-white">
            <div
              className="flex aspect-[4/3] items-center justify-center bg-wco-peach/60 text-sm text-wco-muted"
              style={
                item.imageSrc
                  ? {
                      backgroundImage: `url(${item.imageSrc})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }
                  : undefined
              }
            >
              {!item.imageSrc ? "사진 준비 중" : null}
            </div>
            <figcaption className="p-4">
              <p className="text-xs font-medium text-wco-orange">{item.year}</p>
              <h3 className="mt-1 font-serif text-base font-bold text-wco-grey">
                {item.title}
              </h3>
              <p className="mt-1 text-sm text-wco-muted">{item.caption}</p>
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}
