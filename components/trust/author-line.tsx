import Link from 'next/link';
import { author } from '@/data/entities';

export function AuthorLine() {
  return (
    <p className="trust-line">
      <span>
        Written and maintained by{' '}
        <Link href={`/authors/${author.slug}/`}>
          <strong>{author.name}</strong>
        </Link>
      </span>
      <span>{author.location}</span>
    </p>
  );
}
