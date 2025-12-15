'use client'

import styled from 'styled-components'
import { HTMLAttributes } from 'react'

type HeadingLevel = 'h1' | 'h2' | 'h3'

interface GradientHeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel
  gradient?: 'hero' | 'primary' | 'secondary'
}

const StyledHeading = styled.h1<{ $gradient: string }>`
  background: ${({ $gradient }) => $gradient};
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  line-height: 1.2;
`

export function GradientHeading({
  children,
  level = 'h1',
  gradient = 'hero',
  ...props
}: GradientHeadingProps) {
  const gradientMap = {
    hero: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
    primary: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    secondary: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  }

  return (
    <StyledHeading as={level} $gradient={gradientMap[gradient]} {...props}>
      {children}
    </StyledHeading>
  )
}
