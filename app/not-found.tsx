import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="wrap not-found">
      <div>
        <p className="eyebrow">Page not found</p>
        <h1>That page is not here</h1>
        <p>
          The link may be old, or the page may still be in build. Start from the calculator hub to
          find a tool that is ready.
        </p>
        <Link className="button button-primary" href="/calculators/">
          Go to the calculators
        </Link>
      </div>
    </main>
  );
}
