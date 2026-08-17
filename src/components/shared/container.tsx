import { cn } from "@/lib/utils";

export default function Container({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("container-expo", className)} {...props}>
      {children}
    </div>
  );
}
