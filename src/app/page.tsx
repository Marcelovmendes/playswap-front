"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { ArrowRight, Music, Youtube } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { GradientHeading } from "@/components/ui/GradientHeading";
import { spotifyApi } from "@/lib/api/spotify";

interface SpotifyAuthMessage {
  type: "SPOTIFY_AUTH_CALLBACK";
  status: "success" | "error";
  error: string | null;
}

function isSpotifyAuthMessage(data: unknown): data is SpotifyAuthMessage {
  return (
    typeof data === "object" &&
    data !== null &&
    "type" in data &&
    (data as SpotifyAuthMessage).type === "SPOTIFY_AUTH_CALLBACK"
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnectSpotify = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await spotifyApi.auth.initiateLogin();
      console.log("Spotify login initiated");
    } catch (error: any) {
      console.error("Failed to initiate Spotify login:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to connect to Spotify. Please check if the backend is running.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      if (!isSpotifyAuthMessage(event.data)) return;

      if (event.data.status === "success") {
        router.push("/dashboard");
      } else if (event.data.status === "error") {
        setError(event.data.error || "Authentication failed");
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [router]);

  return (
    <Container>
      <HeroSection>
        <Title>PlaySwap</Title>
        <Subtitle>
          Convert your Spotify playlists to YouTube Music effortlessly. Keep
          your music collection in sync across platforms.
        </Subtitle>
        <ButtonGroup>
          <Button
            variant="gradient"
            size="lg"
            onClick={handleConnectSpotify}
            disabled={isLoading}
          >
            <Music size={20} />
            {isLoading ? "Connecting..." : "Connect Spotify"}
          </Button>
          <Button variant="secondary" size="lg">
            Learn More
          </Button>
        </ButtonGroup>
        {error && <ErrorMessage>{error}</ErrorMessage>}
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
            Transfer your playlists from Spotify to YouTube Music with just a
            few clicks.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard padding="lg">
          <IconWrapper $color="linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)">
            <Music size={32} />
          </IconWrapper>
          <FeatureTitle>Preserve Your Music</FeatureTitle>
          <FeatureDescription>
            Keep all your carefully curated playlists safe and accessible on
            multiple platforms.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard padding="lg">
          <IconWrapper $color="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)">
            <ArrowRight size={32} />
          </IconWrapper>
          <FeatureTitle>Fast & Reliable</FeatureTitle>
          <FeatureDescription>
            Our optimized conversion process ensures your playlists are
            transferred quickly and accurately.
          </FeatureDescription>
        </FeatureCard>
      </FeaturesSection>
    </Container>
  );
}
const Container = styled.main`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing["2xl"]};
  background: ${({ theme }) => theme.colors.bg.primary};
`;

const HeroSection = styled.section`
  max-width: 1200px;
  width: 100%;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing["3xl"]};
`;

const Title = styled(GradientHeading)`
  font-size: ${({ theme }) => theme.fontSizes["6xl"]};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.fontSizes["4xl"]};
  }
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: center;
  flex-wrap: wrap;
`;

const FeaturesSection = styled.section`
  max-width: 1200px;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
`;

const FeatureCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const IconWrapper = styled.div<{ $color: string }>`
  width: 64px;
  height: 64px;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const FeatureTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const FeatureDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
`;

const ConversionFlow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  justify-content: center;
  flex-wrap: wrap;
`;

const PlatformIcon = styled.div<{ $gradient: string }>`
  width: 80px;
  height: 80px;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  background: ${({ $gradient }) => $gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const ArrowIcon = styled(ArrowRight)`
  color: ${({ theme }) => theme.colors.accent.green.DEFAULT};
  width: 32px;
  height: 32px;
`;

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
`;
