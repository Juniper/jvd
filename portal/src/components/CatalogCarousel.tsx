import { useCallback, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";

type Jvd = {
  id: string;
  name: string;
  area: string;
  description: string;
  platforms: string[];
  os: string[];
  repoPath: string;
};

export function CatalogCarousel({
  items,
  renderCard,
}: {
  items: Jvd[];
  renderCard: (j: Jvd, i: number) => React.ReactNode;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, dragFree: true, align: "start" },
    [AutoScroll({ speed: 0.8, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  // Resume auto-scroll after touch ends on mobile
  const onPointerUp = useCallback(() => {
    const autoScroll = emblaApi?.plugins()?.autoScroll;
    if (autoScroll && !autoScroll.isPlaying()) {
      autoScroll.play();
    }
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("pointerUp", onPointerUp);
    return () => { emblaApi.off("pointerUp", onPointerUp); };
  }, [emblaApi, onPointerUp]);

  return (
    <div className="mt-12 overflow-hidden" ref={emblaRef}>
      <div className="flex">
        {items.map((j, i) => (
          <div key={`${j.id}-${i}`} className="mr-5 flex min-w-0 shrink-0 basis-80">
            {renderCard(j, i)}
          </div>
        ))}
      </div>
    </div>
  );
}
