"use client"

import styled from "styled-components"
import { HTMLAttributes } from "react"

type HeadingLevel = "h1" | "h2" | "h3"

type GradientHeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  level?: HeadingLevel
  gradient?: "hero" | "primary" | "secondary" | "tertiary" | "multi"
}

const letterSpacingMap = {
  h1: "-2px",
  h2: "-0.5px",
  h3: "0",
}

const StyledHeading = styled.h1<{ $gradient: string; $level: HeadingLevel }>`
  background: ${({ $gradient }) => $gradient};
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  line-height: ${({ theme }) => theme.lineHeight.tight};
  letter-spacing: ${({ $level }) => letterSpacingMap[$level]};
`

export function GradientHeading({
  children,
  level = "h1",
  gradient = "hero",
  ...props
}: GradientHeadingProps) {
  const gradientMap = {
    hero: (theme: any) => theme.gradients.hero,
    primary: (theme: any) => theme.gradients.primary,
    secondary: (theme: any) => theme.gradients.secondary,
    tertiary: (theme: any) => theme.gradients.tertiary,
    multi: (theme: any) => theme.gradients.multi,
  }

  return (
    <StyledHeading
      as={level}
      $gradient={`var(--gradient-${gradient})`}
      $level={level}
      style={{
        ["--gradient-hero" as any]: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
        ["--gradient-primary" as any]: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        ["--gradient-secondary" as any]: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
        ["--gradient-tertiary" as any]: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
        ["--gradient-multi" as any]:
          "linear-gradient(135deg, #10b981 0%, #3b82f6 50%, #8b5cf6 100%)",
      }}
      {...props}
    >
      {children}
    </StyledHeading>
  )
}
