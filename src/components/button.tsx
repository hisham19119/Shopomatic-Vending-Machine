
// Extend the Button component to use our primary color
import { Button as ShadcnButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

type ButtonProps = React.ComponentProps<typeof ShadcnButton> & {
  primary?: boolean;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, primary, ...props }, ref) => {
    return (
      <ShadcnButton
        ref={ref}
        className={cn(
          primary && "bg-shopoPrimary hover:bg-shopoPrimary/90 text-white",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
