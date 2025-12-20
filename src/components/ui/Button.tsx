"use client"

import styled, { css } from "styled-components"
import { ButtonHTMLAttributes } from "react"

type ButtonVariant = "primary" | "secondary" | "gradient"
type ButtonSize = "sm" | "md" | "lg"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
}

type StyledButtonProps = {
  $variant: ButtonVariant
  $size: ButtonSize
  $fullWidth?: boolean
}

const sizeStyles = {
  sm: css`
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.base}`};
    font-size: ${({ theme }) => theme.fontSizes.sm};
  `,
  md: css`
    padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
    font-size: ${({ theme }) => theme.fontSizes.base};
  `,
  lg: css`
    padding: ${({ theme }) => `${theme.spacing.base} ${theme.spacing.xl}`};
    font-size: ${({ theme }) => theme.fontSizes.lg};
  `,
}

const variantStyles = {
  primary: css`
    background: ${({ theme }) => theme.gradients.primary};
    color: #fff;
    box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(16, 185, 129, 0.4);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }
  `,
  secondary: css`
    background: ${({ theme }) => theme.effects.glass.background};
    backdrop-filter: ${({ theme }) => theme.effects.glass.blur};
    border: 1px solid ${({ theme }) => theme.effects.glass.border};
    color: ${({ theme }) => theme.colors.text.primary};

    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
    }

    &:active:not(:disabled) {
      background: rgba(255, 255, 255, 0.08);
    }
  `,
  gradient: css`
    background: ${({ theme }) => theme.gradients.secondary};
    color: #fff;
    box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(59, 130, 246, 0.4);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }
  `,
}

const StyledButton = styled.button<StyledButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  letter-spacing: ${({ theme }) => theme.letterSpacing.wide};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  transition: all ${({ theme }) => theme.transitions.base};
  cursor: pointer;
  border: none;
  outline: none;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent.green.DEFAULT};
    outline-offset: 2px;
  }

  ${({ $size }) => sizeStyles[$size]}
  ${({ $variant }) => variantStyles[$variant]}
  ${({ $fullWidth }) => $fullWidth && "width: 100%;"}
`

export function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth,
  ...props
}: ButtonProps) {
  return (
    <StyledButton $variant={variant} $size={size} $fullWidth={fullWidth} {...props}>
      {children}
    </StyledButton>
  )
}
