import { dataVerifiedOn } from '@/data/verified';

type DiagramFigureProps = {
  svg: string;
  alt: string;
  sourceName: string;
  sourceUrl: string;
};

export function DiagramFigure({ svg, alt, sourceName, sourceUrl }: DiagramFigureProps) {
  return (
    <figure className="calc-diagram">
      <div
        className="calc-diagram-frame"
        role="img"
        aria-label={alt}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <figcaption className="calc-diagram-caption">
        Illustration. Figures checked {dataVerifiedOn}. Source:{' '}
        <a href={sourceUrl}>{sourceName}</a>.
      </figcaption>
    </figure>
  );
}
