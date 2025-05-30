import Link from "next/link";

export default function LinkButton({ title, href, className }) {
  return (
    <Link href={href} className={`${className} `}>
      {title}
    </Link>
  );
}
