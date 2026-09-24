import Link from "next/link";

type PhotoGridProps = {
  items: readonly {
    id: string;
    title: string;
    caption: string;
    year: string;
    imageSrc?: string;
    href?: string;
  }[];
  emptyMessage?: string;
};

export function PhotoGrid({
  items,
  emptyMessage = "등록된 공연이 없습니다.",
}: PhotoGridProps) {
  if (!items.length) {
    return (
      <p className="border-y border-wco-peach py-10 text-center text-sm text-wco-muted">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const card = (
          <figure className="overflow-hidden rounded-xl border border-wco-peach bg-white transition group-hover:border-wco-orange/40 group-hover:shadow-md">
            <div
              className="flex aspect-[4/3] items-center justify-center bg-neutral-100 text-sm text-wco-muted"
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
              <h3 className="mt-1 font-serif text-base font-bold text-wco-grey group-hover:text-wco-orange">
                {item.title}
              </h3>
              {item.caption ? (
                <p className="mt-1 line-clamp-2 text-sm text-wco-muted">
                  {item.caption}
                </p>
              ) : null}
            </figcaption>
          </figure>
        );

        return (
          <li key={item.id}>
            {item.href ? (
              <Link href={item.href} className="group block">
                {card}
              </Link>
            ) : (
              card
            )}
          </li>
        );
      })}
    </ul>
  );
}
