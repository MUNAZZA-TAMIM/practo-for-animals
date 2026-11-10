import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full rounded-[10px] border border-line bg-white-warm px-3.5 py-2 text-[15px] text-charcoal shadow-[0_1px_2px_rgba(13,43,35,0.03)] outline-none transition-[border-color,box-shadow] placeholder:text-ink-muted/55 hover:border-forest-900/25 focus:border-forest-700 focus:ring-4 focus:ring-forest-900/8 aria-[invalid=true]:border-danger-ink aria-[invalid=true]:ring-danger-bg disabled:cursor-not-allowed disabled:bg-ivory-100 disabled:opacity-70",
        className,
      )}
      {...props}
    />
  );
}

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "min-h-[120px] w-full resize-y rounded-[10px] border border-line bg-white-warm px-3.5 py-3 text-[15px] text-charcoal shadow-[0_1px_2px_rgba(13,43,35,0.03)] outline-none transition-[border-color,box-shadow] placeholder:text-ink-muted/55 hover:border-forest-900/25 focus:border-forest-700 focus:ring-4 focus:ring-forest-900/8 aria-[invalid=true]:border-danger-ink aria-[invalid=true]:ring-danger-bg disabled:cursor-not-allowed disabled:bg-ivory-100 disabled:opacity-70",
        className,
      )}
      {...props}
    />
  );
}

function Select({ className, ...props }: React.ComponentProps<"select">) {
  return (
    <select
      data-slot="select"
      className={cn(
        "h-12 w-full appearance-none rounded-[10px] border border-line bg-white-warm bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23153b30%22%20stroke-width%3D%221.6%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_0.9rem_center] bg-no-repeat px-3.5 py-2 pr-10 text-[15px] text-charcoal shadow-[0_1px_2px_rgba(13,43,35,0.03)] outline-none transition-[border-color,box-shadow] hover:border-forest-900/25 focus:border-forest-700 focus:ring-4 focus:ring-forest-900/8 aria-[invalid=true]:border-danger-ink disabled:cursor-not-allowed disabled:bg-ivory-100 disabled:opacity-70",
        className,
      )}
      {...props}
    />
  );
}

export { Input, Textarea, Select };
