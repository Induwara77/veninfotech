import Image from 'next/image';

function hueFrom(seed: string) {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) % 360;
  return h;
}

export default function Cover({
  src,
  alt = '',
  sizes,
  seed,
  className = '',
}: {
  src?: string;
  alt?: string;
  sizes: string;
  /** Stable string used to pick the fallback gradient colour */
  seed: string;
  className?: string;
}) {
  if (src) {
    return <Image src={src} alt={alt} fill sizes={sizes} className={`object-cover ${className}`} />;
  }
  const h = hueFrom(seed);
  return (
    <div
      aria-hidden
      className={`absolute inset-0 ${className}`}
      style={{
        backgroundImage: `linear-gradient(135deg, hsl(${h} 60% 38%), hsl(${(h + 50) % 360} 55% 12%))`,
      }}
    />
  );
}
