"use client";

import { useEffect } from "react";
import styled from "styled-components";
import { Loader2, Music, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { usePlaylists } from "@/lib/hooks/usePlaylists";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useRouter } from "next/navigation";

const Container = styled.div`
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.bg.primary};
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.DEFAULT};
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const UserAvatar = styled.div<{ $imageUrl?: string | null }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ $imageUrl, theme }) =>
    $imageUrl
      ? `url(${$imageUrl}) center/cover`
      : theme.colors.accent.green.DEFAULT};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const UserEmail = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Content = styled.main`
  max-width: 1200px;
  margin: 0 auto;
`;

const Section = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes["2xl"]};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const PlaylistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const PlaylistCard = styled(Card)`
  cursor: pointer;
  transition: transform ${({ theme }) => theme.transitions.base};

  &:hover {
    transform: translateY(-4px);
  }
`;

const PlaylistImage = styled.div<{ $imageUrl?: string | null }>`
  width: 100%;
  aspect-ratio: 1;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ $imageUrl, theme }) =>
    $imageUrl
      ? `url(${$imageUrl}) center/cover`
      : theme.colors.bg.tertiary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const PlaylistInfo = styled.div`
  padding: ${({ theme }) => theme.spacing.sm} 0;
`;

const PlaylistName = styled.h4`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const PlaylistMeta = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing["3xl"]};
`;

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
`;

const ErrorMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: #ef4444;
  text-align: center;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing["3xl"]};
`;

const EmptyIcon = styled(Music)`
  width: 64px;
  height: 64px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin: 0 auto ${({ theme }) => theme.spacing.lg};
`;

const EmptyText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, checkAuth, logout } = useAuthStore();
  const { data: playlists, isLoading, error } = usePlaylists();

  useEffect(() => {
    if (!user && isAuthenticated) {
      checkAuth();
    }
  }, [user, isAuthenticated, checkAuth]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (isLoading) {
    return (
      <Container>
        <LoadingContainer>
          <SpinningIcon />
          <p>Loading your playlists...</p>
        </LoadingContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Content>
          <ErrorMessage>
            Failed to load playlists. Please try again later.
          </ErrorMessage>
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <UserInfo>
          <UserAvatar $imageUrl={user?.photoCover}>
            {!user?.photoCover && user?.displayName?.[0]?.toUpperCase()}
          </UserAvatar>
          <UserDetails>
            <UserName>{user?.displayName || "User"}</UserName>
            <UserEmail>{user?.email}</UserEmail>
          </UserDetails>
        </UserInfo>
        <Button variant="secondary" size="sm" onClick={handleLogout}>
          <LogOut size={16} />
          Logout
        </Button>
      </Header>

      <Content>
        <Section>
          <SectionTitle>Your Playlists</SectionTitle>
          {!playlists || playlists.length === 0 ? (
            <EmptyState>
              <EmptyIcon />
              <EmptyText>No playlists found</EmptyText>
            </EmptyState>
          ) : (
            <PlaylistGrid>
              {playlists.map((playlist) => (
                <PlaylistCard key={playlist.id} padding="md">
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
  );
}
