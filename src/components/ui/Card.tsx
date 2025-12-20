"use client"

import styled from "styled-components"
import { HTMLAttributes } from "react"

type CardPadding = "sm" | "md" | "lg"

type CardProps = HTMLAttributes<HTMLDivElement> & {
  hover?: boolean
  padding?: CardPadding
}

type StyledCardProps = {
  $hover: boolean
  $padding: CardPadding
}

const paddingStyles = {
  sm: (theme: any) => theme.spacing.md,
  md: (theme: any) => theme.spacing.lg,
  lg: (theme: any) => theme.spacing.xl,
}

const StyledCard = styled.div<StyledCardProps>`
  position: relative;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid ${({ theme }) => theme.colors.border.DEFAULT};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  backdrop-filter: blur(10px);
  transition: all ${({ theme }) => theme.transitions.base};
  padding: ${({ $padding, theme }) => paddingStyles[$padding](theme)};

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
    opacity: 0;
    transition: opacity ${({ theme }) => theme.transitions.base};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    pointer-events: none;
  }

  ${({ $hover, theme }) =>
    $hover &&
    `
    cursor: pointer;

    &:hover {
      transform: translateY(-4px);
      border-color: rgba(16, 185, 129, 0.4);
      box-shadow: 0 12px 40px rgba(16, 185, 129, 0.15);

      &::before {
        opacity: 1;
      }
    }
  `}
`

export function Card({ children, hover = false, padding = "md", ...props }: CardProps) {
  return (
    <StyledCard $hover={hover} $padding={padding} {...props}>
      {children}
    </StyledCard>
  )
}
