import { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

type HeadingLevel = "h1" | "h2" | "h3"

type GradientHeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  level?: HeadingLevel
  gradient?: "hero" | "primary" | "secondary" | "tertiary" | "multi"
}

const letterSpacingMap = {
  h1: "-0.05em",
  h2: "-0.0125em",
  h3: "0",
}

const gradientClasses = {
  hero: "text-gradient-hero",
  primary: "text-gradient-primary",
  secondary: "text-gradient-secondary",
  tertiary: "bg-gradient-tertiary bg-clip-text text-transparent",
  multi: "bg-gradient-multi bg-clip-text text-transparent",
}

export function GradientHeading({
  children,
  level = "h1",
  gradient = "hero",
  className,
  style,
  ...props
}: GradientHeadingProps) {
  const Component = level

  return (
    <Component
      className={cn(
        "font-bold leading-tight",
        gradientClasses[gradient],
        className
      )}
      style={{
        letterSpacing: letterSpacingMap[level],
        ...style,
      }}
      {...props}
    >
      {children}
    </Component>
  )
}
