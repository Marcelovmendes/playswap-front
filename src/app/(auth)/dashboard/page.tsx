"use client"

import { useEffect } from "react"
import styled from "styled-components"
import { Loader2, Music, LogOut } from "lucide-react"
import { useAuthStore } from "@/store/authStore"
import { usePlaylists } from "@/lib/hooks/usePlaylists"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, checkAuth, logout } = useAuthStore()
  const { data: playlists, isLoading, error } = usePlaylists()

  useEffect(() => {
    if (!user && isAuthenticated) {
      checkAuth()
    }
  }, [user, isAuthenticated, checkAuth])

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  if (isLoading) {
    return (
      <Container>
        <LoadingContainer>
          <SpinningIcon />
          <p>Loading your playlists...</p>
        </LoadingContainer>
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <Content>
          <ErrorMessage>Failed to load playlists. Please try again later.</ErrorMessage>
        </Content>
      </Container>
    )
  }

  return (
    <Container>
      <TopBar>
        <Logo onClick={() => router.push("/")}>PlaySwap</Logo>
        <UserProfile>
          <UserAvatar $imageUrl={user?.photoCover}>
            {!user?.photoCover && user?.displayName?.[0]?.toUpperCase()}
          </UserAvatar>
          <UserName>{user?.displayName || "User"}</UserName>
        </UserProfile>
      </TopBar>

      <Content>
        <SectionHeader>
          <div>
            <SectionTitle>Your Playlists</SectionTitle>
            <Stats>
              <StatItem>
                <StatValue>{playlists?.length || 0}</StatValue> Playlists
              </StatItem>
              <StatItem>
                <StatValue>{playlists?.reduce((acc, p) => acc + p.trackCount, 0) || 0}</StatValue>{" "}
                Tracks
              </StatItem>
            </Stats>
          </div>
        </SectionHeader>

        <Section>
          {!playlists || playlists.length === 0 ? (
            <EmptyState>
              <EmptyIcon />
              <EmptyText>No playlists found</EmptyText>
            </EmptyState>
          ) : (
            <PlaylistGrid>
              {playlists.map((playlist) => (
                <PlaylistCard
                  key={playlist.id}
                  padding="md"
                  hover
                  onClick={() => router.push(`/playlist/${playlist.id}`)}
                >
                  <PlaylistImage $imageUrl={playlist.imageUrl}>
                    {!playlist.imageUrl && <Music size={48} />}
                  </PlaylistImage>
                  <PlaylistInfo>
                    <PlaylistName>{playlist.name}</PlaylistName>
                    <PlaylistMeta>
                      {playlist.trackCount} tracks · {playlist.ownerName}
                    </PlaylistMeta>
                  </PlaylistInfo>
                </PlaylistCard>
              ))}
            </PlaylistGrid>
          )}
        </Section>
      </Content>
    </Container>
  )
}
const Container = styled.div`
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.bg.primary};
`

const TopBar = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.DEFAULT};
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};
`

const Logo = styled.div`
  font-size: ${({ theme }) => theme.fontSizes["2xl"]};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
  background: ${({ theme }) => theme.gradients.hero};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  cursor: pointer;
  transition: opacity ${({ theme }) => theme.transitions.base};

  &:hover {
    opacity: 0.8;
  }
`

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.base};
  padding: ${({ theme }) => `10px ${theme.spacing.xl}`};
  background: ${({ theme }) => theme.effects.glass.background};
  border: 1px solid ${({ theme }) => theme.effects.glass.border};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.base};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  backdrop-filter: ${({ theme }) => theme.effects.glass.blur};

  &:hover {
    border-color: rgba(16, 185, 129, 0.4);
    background: rgba(255, 255, 255, 0.08);
  }
`

const UserAvatar = styled.div<{ $imageUrl?: string | null }>`
  width: 36px;
  height: 36px;
  background: ${({ $imageUrl, theme }) =>
    $imageUrl ? `url(${$imageUrl}) center/cover` : theme.gradients.tertiary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: white;
`

const UserName = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`

const Content = styled.main`
  max-width: 1200px;
  margin: 0 auto;
`

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes["4xl"]};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.base};
`

const Stats = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing["2xl"]};
`

const StatItem = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.quaternary};
  letter-spacing: ${({ theme }) => theme.letterSpacing.wide};
`

const StatValue = styled.span`
  color: ${({ theme }) => theme.colors.accent.green.DEFAULT};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`

const Section = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};
`

const PlaylistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`

const PlaylistCard = styled(Card)``

const PlaylistImage = styled.div<{ $imageUrl?: string | null }>`
  width: 100%;
  aspect-ratio: 1;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ $imageUrl }) =>
    $imageUrl
      ? `url(${$imageUrl}) center/cover`
      : "linear-gradient(135deg, #10b981 0%, #059669 100%)"};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  position: relative;
  overflow: hidden;

  ${({ $imageUrl }) =>
    !$imageUrl &&
    `
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background:
        repeating-linear-gradient(
          0deg,
          rgba(255,255,255,0.05) 0px,
          transparent 1px,
          transparent 20px
        ),
        repeating-linear-gradient(
          90deg,
          rgba(255,255,255,0.05) 0px,
          transparent 1px,
          transparent 20px
        );
      opacity: 0.3;
    }

    svg {
      color: rgba(255, 255, 255, 0.9);
      z-index: 1;
    }
  `}
`

const PlaylistInfo = styled.div`
  padding: ${({ theme }) => theme.spacing.sm} 0;
`

const PlaylistName = styled.h4`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const PlaylistMeta = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.quaternary};
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing["3xl"]};
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

const ErrorMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ theme }) => theme.colors.semantic.error};
  text-align: center;
`

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing["3xl"]};
`

const EmptyIcon = styled(Music)`
  width: 64px;
  height: 64px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin: 0 auto ${({ theme }) => theme.spacing.lg};
`

const EmptyText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
`
