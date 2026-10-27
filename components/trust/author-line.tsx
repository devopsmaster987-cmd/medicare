import { author } from '@/data/entities';

export function AuthorLine() {
  return (
    <p className="trust-line">
      <span>
        Written and maintained by <strong>{author.name}</strong>
      </span>
      <span>{author.location}</span>
    </p>
  );
}
