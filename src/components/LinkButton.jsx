import Link from "next/link";

export default function LinkButton({ title, href, className }) {
  return (
    <Link
      href={href}
      className={`${className} bg-foreground text-background border-foreground hover:text-foreground hover:bg-background w-full border px-3 py-2 text-center font-extrabold transition-colors`}
    >
      {title}
    </Link>
  );
}
