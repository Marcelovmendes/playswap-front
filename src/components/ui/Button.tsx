'use client'

import styled, { css } from 'styled-components'
import { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'gradient'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
}

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
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

  ${({ size = 'md' }) => {
    switch (size) {
      case 'sm':
        return css`
          padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
          font-size: ${({ theme }) => theme.fontSizes.sm};
        `
      case 'lg':
        return css`
          padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.xl}`};
          font-size: ${({ theme }) => theme.fontSizes.lg};
        `
      default:
        return css`
          padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
          font-size: ${({ theme }) => theme.fontSizes.base};
        `
    }
  }}

  ${({ variant = 'primary', theme }) => {
    switch (variant) {
      case 'gradient':
        return css`
          background: ${theme.colors.gradients.primary};
          color: ${theme.colors.text.primary};

          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.lg};
          }

          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `
      case 'secondary':
        return css`
          background: ${theme.colors.bg.tertiary};
          color: ${theme.colors.text.primary};
          border: 1px solid ${theme.colors.border.DEFAULT};

          &:hover:not(:disabled) {
            background: ${theme.colors.bg.secondary};
            border-color: ${theme.colors.border.light};
          }

          &:active:not(:disabled) {
            background: ${theme.colors.bg.primary};
          }
        `
      default:
        return css`
          background: ${theme.colors.accent.green.DEFAULT};
          color: ${theme.colors.bg.primary};

          &:hover:not(:disabled) {
            background: ${theme.colors.accent.green.dark};
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.md};
          }

          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `
    }
  }}

  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}
`

export function Button({ children, variant = 'primary', size = 'md', ...props }: ButtonProps) {
  return (
    <StyledButton variant={variant} size={size} {...props}>
      {children}
    </StyledButton>
  )
}
