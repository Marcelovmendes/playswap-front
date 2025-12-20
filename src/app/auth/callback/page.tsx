"use client"

import { useEffect, useState } from "react"
import styled, { keyframes } from "styled-components"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

type CallbackStatus = "loading" | "success" | "error"

const AUTO_CLOSE_SECONDS = 5

function notifyParentWindow(status: CallbackStatus, token: string | null, error: string | null) {
  if (!window.opener) {
    console.error("[Callback] window.opener is null!")
    return
  }

  const message = { type: "SPOTIFY_AUTH_CALLBACK", status, token, error }
  const allowedOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"]

  allowedOrigins.forEach((targetOrigin) => {
    window.opener.postMessage(message, targetOrigin)
  })
}

function closeWindow() {
  window.close()
}

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<CallbackStatus>("loading")
  const [token, setToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(AUTO_CLOSE_SECONDS)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const tokenParam = params.get("token")
    const errorParam = params.get("error")

    if (errorParam) {
      setStatus("error")
      setError(errorParam)
    } else if (tokenParam) {
      setStatus("success")
      setToken(tokenParam)
    } else {
      setStatus("error")
      setError("No token received")
    }
  }, [])

  useEffect(() => {
    if (status === "loading") return

    notifyParentWindow(status, token, error)

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          closeWindow()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [status, token, error])

  if (status === "loading") {
    return (
      <Container>
        <Card>
          <IconWrapper $variant="loading">
            <SpinningIcon />
          </IconWrapper>
          <Title>Processing...</Title>
          <Message>Please wait while we complete your authentication.</Message>
        </Card>
      </Container>
    )
  }

  if (status === "error") {
    return (
      <Container>
        <Card>
          <IconWrapper $variant="error">
            <XCircle />
          </IconWrapper>
          <Title>Authentication Failed</Title>
          <Message>{error || "Something went wrong. Please try again."}</Message>
          <CloseMessage>
            This window will close in {countdown} seconds...{" "}
            <CloseButton $variant="error" onClick={closeWindow}>
              Close now
            </CloseButton>
          </CloseMessage>
        </Card>
      </Container>
    )
  }

  return (
    <Container>
      <Card>
        <IconWrapper $variant="success">
          <CheckCircle />
        </IconWrapper>
        <Title>Connected to Spotify!</Title>
        <Message>
          Your Spotify account has been successfully linked. You can now access your playlists.
        </Message>
        <CloseMessage>
          This window will close in {countdown} seconds...{" "}
          <CloseButton $variant="success" onClick={closeWindow}>
            Close now
          </CloseButton>
        </CloseMessage>
      </Card>
    </Container>
  )
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

const Container = styled.main`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.bg.primary};
`

const Card = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(10px);
  border: 1px solid ${({ theme }) => theme.colors.border.DEFAULT};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing["2xl"]};
  text-align: center;
  max-width: 400px;
  width: 100%;
  animation: ${fadeIn} ${({ theme }) => theme.transitions.base} cubic-bezier(0.4, 0, 0.2, 1);
`

const IconWrapper = styled.div<{ $variant: CallbackStatus }>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${({ theme }) => theme.spacing.lg};
  background: ${({ $variant, theme }) =>
    $variant === "success"
      ? "rgba(16, 185, 129, 0.1)"
      : $variant === "error"
        ? "rgba(239, 68, 68, 0.1)"
        : "rgba(59, 130, 246, 0.1)"};

  svg {
    width: 40px;
    height: 40px;
    color: ${({ $variant, theme }) =>
      $variant === "success"
        ? theme.colors.accent.green.DEFAULT
        : $variant === "error"
          ? theme.colors.semantic.error
          : theme.colors.accent.blue.DEFAULT};
  }
`

const SpinningIcon = styled(Loader2)`
  animation: ${spin} 1s linear infinite;
`

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes["2xl"]};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const Message = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

const CloseMessage = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.tertiary};
`

const CloseButton = styled.button<{ $variant: CallbackStatus }>`
  background: none;
  border: none;
  color: ${({ $variant, theme }) =>
    $variant === "error" ? theme.colors.semantic.error : theme.colors.accent.green.DEFAULT};
  cursor: pointer;
  text-decoration: underline;
  transition: opacity ${({ theme }) => theme.transitions.fast};

  &:hover {
    opacity: 0.8;
  }
`
