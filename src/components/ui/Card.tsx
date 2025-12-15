'use client'

import styled from 'styled-components'
import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  padding?: 'sm' | 'md' | 'lg'
}

const StyledCard = styled.div<CardProps>`
  background: ${({ theme }) => theme.colors.bg.secondary};
  border: 1px solid ${({ theme }) => theme.colors.border.DEFAULT};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  backdrop-filter: blur(10px);
  transition: all ${({ theme }) => theme.transitions.base};

  ${({ padding = 'md', theme }) => {
    switch (padding) {
      case 'sm':
        return `padding: ${theme.spacing.md};`
      case 'lg':
        return `padding: ${theme.spacing.xl};`
      default:
        return `padding: ${theme.spacing.lg};`
    }
  }}

  ${({ hover, theme }) =>
    hover &&
    `
    cursor: pointer;

    &:hover {
      transform: translateY(-4px);
      box-shadow: ${theme.shadows.xl};
      border-color: ${theme.colors.border.light};
      background: ${theme.colors.bg.tertiary};
    }
  `}
`

export function Card({ children, hover = false, padding = 'md', ...props }: CardProps) {
  return (
    <StyledCard hover={hover} padding={padding} {...props}>
      {children}
    </StyledCard>
  )
}
