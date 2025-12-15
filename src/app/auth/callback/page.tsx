"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import styled, { keyframes } from "styled-components";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

type CallbackStatus = "loading" | "success" | "error";

const AUTO_CLOSE_SECONDS = 3;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Container = styled.main`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.bg.primary};
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.bg.secondary};
  border: 1px solid ${({ theme }) => theme.colors.border.DEFAULT};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing["2xl"]};
  text-align: center;
  max-width: 400px;
  width: 100%;
  animation: ${fadeIn} 0.3s ease-out;
`;

const IconWrapper = styled.div<{ $variant: CallbackStatus }>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${({ theme }) => theme.spacing.lg};
  background: ${({ $variant }) =>
    $variant === "success"
      ? "rgba(16, 185, 129, 0.1)"
      : $variant === "error"
        ? "rgba(239, 68, 68, 0.1)"
        : "rgba(59, 130, 246, 0.1)"};

  svg {
    width: 40px;
    height: 40px;
    color: ${({ $variant }) =>
      $variant === "success"
        ? "#10b981"
        : $variant === "error"
          ? "#ef4444"
          : "#3b82f6"};
  }
`;

const SpinningIcon = styled(Loader2)`
  animation: ${spin} 1s linear infinite;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes["2xl"]};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Message = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const CloseMessage = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const CloseButton = styled.button<{ $variant: CallbackStatus }>`
  background: none;
  border: none;
  color: ${({ $variant }) => ($variant === "error" ? "#ef4444" : "#10b981")};
  cursor: pointer;
  text-decoration: underline;
`;

function notifyParentWindow(status: CallbackStatus, error: string | null) {
  if (!window.opener) return;

  window.opener.postMessage(
    { type: "SPOTIFY_AUTH_CALLBACK", status, error },
    window.location.origin
  );
}

function closeWindow() {
  window.close();
}

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<CallbackStatus>("loading");
  const [countdown, setCountdown] = useState(AUTO_CLOSE_SECONDS);

  const success = searchParams.get("success");
  const error = searchParams.get("error");

  useEffect(() => {
    if (error) {
      setStatus("error");
    } else if (success === "true") {
      setStatus("success");
    } else {
      setStatus("success");
    }
  }, [success, error]);

  useEffect(() => {
    if (status === "loading") return;

    notifyParentWindow(status, error);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          closeWindow();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [status, error]);

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
    );
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
    );
  }

  return (
    <Container>
      <Card>
        <IconWrapper $variant="success">
          <CheckCircle />
        </IconWrapper>
        <Title>Connected to Spotify!</Title>
        <Message>
          Your Spotify account has been successfully linked. You can now access
          your playlists.
        </Message>
        <CloseMessage>
          This window will close in {countdown} seconds...{" "}
          <CloseButton $variant="success" onClick={closeWindow}>
            Close now
          </CloseButton>
        </CloseMessage>
      </Card>
    </Container>
  );
}
