'use client'

import styled from 'styled-components'

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
`

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  color: ${({ theme }) => theme.colors.text.primary};
`

export default function DashboardPage() {
  return (
    <Container>
      <Title>Dashboard - Coming Soon</Title>
    </Container>
  )
}
