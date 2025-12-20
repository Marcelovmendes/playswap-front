"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import styled from "styled-components"
import { Loader2 } from "lucide-react"
import { useAuthStore } from "@/store/authStore"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/?error=session_required")
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <LoadingContainer>
        <SpinningIcon />
        <LoadingText>Loading your session...</LoadingText>
      </LoadingContainer>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}

const LoadingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.bg.primary};
`

const SpinningIcon = styled(Loader2)`
  width: 48px;
  height: 48px;
  color: ${({ theme }) => theme.colors.accent.green.DEFAULT};
  animation: spin 1s linear infinite;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`

const LoadingText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
`
