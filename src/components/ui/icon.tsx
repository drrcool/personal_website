import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const iconVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      size: {
        small: "size-12 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        medium: "size-16 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        large: "size-20 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
      },
      border: {
        true: "border",
        false: "",
      },
    },
    defaultVariants: {
      size: "medium",
      border: false,
    },
  }
);

const SVGIcon = ({
  className,
  border,
  size,
  image,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof iconVariants> & {
    image: ({ className }: { className: string }) => React.ReactNode;
  }) => {
  const ImageComp = image;
  return (
    <div className={cn(iconVariants({ size, border, className }))} {...props}>
      <ImageComp className={cn(iconVariants({ size, border, className }))} />
    </div>
  );
};

export { SVGIcon, iconVariants };
