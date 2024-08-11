import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center text-black font-heading justify-center rounded-base text-sm font-bold font-space ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-2 border-black shadow-base hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none",
        noShadow: "bg-main border-2 border-black",
        link: "underline-offset-4 hover:underline",
        neutral: "bg-white border-2 border-black",
      },
      size: {
        default: "px-4 py-2",
        sm: "px-3",
        lg: "px-8 py-3 text-base w-full md:w-auto md:text-lg lg:text-xl",
        icon: "h-10 w-10",
        none: "",
      },
      theme: {
        default: "bg-main text-white",
        mint: "bg-mint-800",
        purple: "bg-main text-white",
        neutral: "bg-white",
        yellow: "bg-mustard-800 text-black",
      },
    },
    defaultVariants: {
      theme: "default",
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, theme, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ theme, variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
