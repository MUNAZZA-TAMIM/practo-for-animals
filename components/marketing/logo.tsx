import Link from "next/link";
import { PawPrint } from "lucide-react";
import { cn } from "@/lib/utils";

function Logomark({
  className,
}: {
  variant?: "dark" | "light";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#103a2f] text-white shadow-md transition-transform duration-300 group-hover:-rotate-3",
        className,
      )}
      aria-hidden="true"
    >
      <PawPrint className="h-6 w-6 fill-current stroke-none" />
    </div>
  );
}

export function Logo({
  className,
  href = "/",
}: {
  variant?: "dark" | "light";
  className?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      aria-label="Practo for Animals — home"
      className={cn(
        "group inline-flex items-center gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-coral-500",
        className,
      )}
    >
      <Logomark />
      <div className="flex flex-col">
        <div className="flex items-baseline leading-none">
          <span className="text-[24px] font-extrabold tracking-[-0.04em] text-[#0d382e]">
            practo
          </span>
          <span
            className="ml-1 inline-block h-[5.5px] w-[5.5px] rounded-[1px] bg-[#059669] self-end mb-[3px]"
            aria-hidden="true"
          />
          <span className="sr-only">.</span>
        </div>
        <span className="mt-1 text-[10.5px] font-bold uppercase tracking-[0.24em] text-[#938b82] leading-none">
          FOR ANIMALS
        </span>
      </div>
    </Link>
  );
}

export function LogomarkOnly({
  className,
}: {
  variant?: "dark" | "light";
  className?: string;
}) {
  return <Logomark className={className} />;
}
