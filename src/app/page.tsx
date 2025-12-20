"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import styled from "styled-components"
import { ArrowRight, Music, Youtube } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { GradientHeading } from "@/components/ui/GradientHeading"
import { spotifyApi } from "@/lib/api/spotify"
import { useAuthStore } from "@/store/authStore"
import { apiClient } from "@/lib/api/client"

type SpotifyAuthMessage = {
  type: "SPOTIFY_AUTH_CALLBACK"
  status: "success" | "error"
  token: string | null
  error: string | null
}

function isSpotifyAuthMessage(data: unknown): data is SpotifyAuthMessage {
  return (
    typeof data === "object" &&
    data !== null &&
    "type" in data &&
    (data as SpotifyAuthMessage).type === "SPOTIFY_AUTH_CALLBACK"
  )
}

export default function LandingPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConnectSpotify = async () => {
    try {
      setIsLoading(true)
      setError(null)
      await spotifyApi.auth.initiateLogin()
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to connect to Spotify. Please check if the backend is running."
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    async function handleMessage(event: MessageEvent) {
      const allowedOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"]

      if (!allowedOrigins.includes(event.origin)) {
        return
      }

      if (!isSpotifyAuthMessage(event.data)) {
        return
      }

      if (event.data.status === "success") {
        if (!event.data.token) {
          setError("No token received from authentication")
          return
        }

        setIsLoading(true)
        try {
          await apiClient.post("/api/auth/exchange", {
            token: event.data.token,
          })

          await useAuthStore.getState().checkAuth()
          router.push("/dashboard")
        } catch (error) {
          setError("Failed to complete authentication")
        } finally {
          setIsLoading(false)
        }
      } else if (event.data.status === "error") {
        setError(event.data.error || "Authentication failed")
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [router])

  return (
    <Container>
      <HeroSection>
        <HeroContent>
          <HeroLabel>✨ Platform Bridge</HeroLabel>
          <Title>Transfer your playlists across platforms</Title>
          <Subtitle>
            Convert Spotify playlists to YouTube Music seamlessly. Preserve your music collection
            across streaming services.
          </Subtitle>
          <ButtonGroup>
            <Button variant="primary" size="lg" onClick={handleConnectSpotify} disabled={isLoading}>
              <Music size={20} />
              {isLoading ? "Connecting..." : "Connect Spotify"}
            </Button>
            <Button variant="secondary" size="lg">
              Learn More
            </Button>
          </ButtonGroup>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </HeroContent>
      </HeroSection>

      <FeaturesSection>
        <FeatureCard padding="lg">
          <ConversionFlow>
            <PlatformIcon $gradient="linear-gradient(135deg, #1DB954 0%, #1ed760 100%)">
              <Music size={40} />
            </PlatformIcon>
            <ArrowIcon />
            <PlatformIcon $gradient="linear-gradient(135deg, #FF0000 0%, #cc0000 100%)">
              <Youtube size={40} />
            </PlatformIcon>
          </ConversionFlow>
          <FeatureTitle>Seamless Conversion</FeatureTitle>
          <FeatureDescription>
            Transfer your playlists from Spotify to YouTube Music with just a few clicks.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard padding="lg">
          <IconWrapper $color="linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)">
            <Music size={32} />
          </IconWrapper>
          <FeatureTitle>Preserve Your Music</FeatureTitle>
          <FeatureDescription>
            Keep all your carefully curated playlists safe and accessible on multiple platforms.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard padding="lg">
          <IconWrapper $color="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)">
            <ArrowRight size={32} />
          </IconWrapper>
          <FeatureTitle>Fast & Reliable</FeatureTitle>
          <FeatureDescription>
            Our optimized conversion process ensures your playlists are transferred quickly and
            accurately.
          </FeatureDescription>
        </FeatureCard>
      </FeaturesSection>
    </Container>
  )
}
const Container = styled.main`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing["2xl"]};
  background: ${({ theme }) => theme.colors.bg.primary};
`

const HeroSection = styled.section`
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  &::before {
    content: "";
    position: absolute;
    top: -50%;
    right: -10%;
    width: 800px;
    height: 800px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%);
    pointer-events: none;
    animation: pulse 8s ease-in-out infinite;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -30%;
    left: -10%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%);
    pointer-events: none;
    animation: pulse 6s ease-in-out infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.1);
      opacity: 0.8;
    }
  }
`

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
`

const HeroLabel = styled.div`
  display: inline-block;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  letter-spacing: ${({ theme }) => theme.letterSpacing.wider};
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent.green.DEFAULT};
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.base}`};
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`

const Title = styled(GradientHeading)`
  font-size: ${({ theme }) => theme.fontSizes["6xl"]};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.fontSizes["4xl"]};
  }
`

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.text.quaternary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: ${({ theme }) => theme.lineHeight.normal};
`

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.base};
  justify-content: center;
  flex-wrap: wrap;
  margin-top: ${({ theme }) => theme.spacing["2xl"]};
`

const FeaturesSection = styled.section`
  max-width: 1200px;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  margin-top: ${({ theme }) => theme.spacing["2xl"]};
  position: relative;
  z-index: 1;
`

const FeatureCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`

const IconWrapper = styled.div<{ $color: string }>`
  width: 64px;
  height: 64px;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

const FeatureTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.primary};
`

const FeatureDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: ${({ theme }) => theme.lineHeight.relaxed};
`

const ConversionFlow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

const PlatformIcon = styled.div<{ $gradient: string }>`
  width: 80px;
  height: 80px;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  background: ${({ $gradient }) => $gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`

const ArrowIcon = styled(ArrowRight)`
  color: ${({ theme }) => theme.colors.accent.green.DEFAULT};
  width: 32px;
  height: 32px;
`

const ErrorMessage = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: #ef4444;
  text-align: center;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`
