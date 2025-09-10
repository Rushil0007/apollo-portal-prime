import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const apolloCardVariants = cva(
  "rounded-2xl transition-all duration-300",
  {
    variants: {
      variant: {
        default: "card-apollo",
        gradient: "card-apollo-gradient",
        elevated: "card-apollo hover:shadow-elevated hover:-translate-y-2",
        minimal: "bg-card border border-border rounded-xl p-4 hover:bg-card-hover transition-colors",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface ApolloCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof apolloCardVariants> {}

const ApolloCard = React.forwardRef<HTMLDivElement, ApolloCardProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(apolloCardVariants({ variant, className }))}
      {...props}
    />
  )
);
ApolloCard.displayName = "ApolloCard";

const ApolloCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-4", className)}
    {...props}
  />
));
ApolloCardHeader.displayName = "ApolloCardHeader";

const ApolloCardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-bold text-xl text-foreground leading-none tracking-tight", className)}
    {...props}
  />
));
ApolloCardTitle.displayName = "ApolloCardTitle";

const ApolloCardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
ApolloCardDescription.displayName = "ApolloCardDescription";

const ApolloCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
));
ApolloCardContent.displayName = "ApolloCardContent";

const ApolloCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4", className)}
    {...props}
  />
));
ApolloCardFooter.displayName = "ApolloCardFooter";

export {
  ApolloCard,
  ApolloCardHeader,
  ApolloCardFooter,
  ApolloCardTitle,
  ApolloCardDescription,
  ApolloCardContent,
  apolloCardVariants,
};