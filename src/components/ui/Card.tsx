"use client";

import styled from "styled-components";
import { HTMLAttributes } from "react";

type CardPadding = "sm" | "md" | "lg";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: CardPadding;
}

interface StyledCardProps {
  $hover: boolean;
  $padding: CardPadding;
}

const paddingStyles = {
  sm: (theme: any) => theme.spacing.md,
  md: (theme: any) => theme.spacing.lg,
  lg: (theme: any) => theme.spacing.xl,
};

const StyledCard = styled.div<StyledCardProps>`
  background: ${({ theme }) => theme.colors.bg.secondary};
  border: 1px solid ${({ theme }) => theme.colors.border.DEFAULT};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  backdrop-filter: blur(10px);
  transition: all ${({ theme }) => theme.transitions.base};
  padding: ${({ $padding, theme }) => paddingStyles[$padding](theme)};

  ${({ $hover, theme }) =>
    $hover &&
    `
    cursor: pointer;

    &:hover {
      transform: translateY(-4px);
      box-shadow: ${theme.shadows.xl};
      border-color: ${theme.colors.border.light};
      background: ${theme.colors.bg.tertiary};
    }
  `}
`;

export function Card({
  children,
  hover = false,
  padding = "md",
  ...props
}: CardProps) {
  return (
    <StyledCard $hover={hover} $padding={padding} {...props}>
      {children}
    </StyledCard>
  );
}
