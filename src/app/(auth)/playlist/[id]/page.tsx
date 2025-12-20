"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import styled from "styled-components"
import { Music, ArrowLeft, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { usePlaylists } from "@/lib/hooks/usePlaylists"
import { usePlaylistTracks } from "@/lib/hooks/usePlaylistTracks"

const TRACKS_PER_PAGE = 50

export default function PlaylistPreviewPage() {
  const params = useParams()
  const router = useRouter()
  const playlistId = params.id as string
  const [currentPage, setCurrentPage] = useState(0)

  const { data: playlists, isLoading: isLoadingPlaylist } = usePlaylists()
  const playlist = playlists?.find((p) => p.id === playlistId)
  const { data: tracksData, isLoading: isLoadingTracks } = usePlaylistTracks(
    playlistId,
    currentPage * TRACKS_PER_PAGE,
    TRACKS_PER_PAGE
  )

  const formatDuration = (durationMs: number) => {
    const minutes = Math.floor(durationMs / 60000)
    const seconds = Math.floor((durationMs % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleBack = () => {
    router.push("/dashboard")
  }

  const handleConvert = () => {
    console.log("Converting playlist:", playlistId)
  }

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (tracksData?.hasNext) {
      setCurrentPage(currentPage + 1)
    }
  }

  if (isLoadingPlaylist) {
    return (
      <Container>
        <LoadingContainer>
          <SpinningIcon />
          <p>Loading playlist...</p>
        </LoadingContainer>
      </Container>
    )
  }

  if (!playlist) {
    return (
      <Container>
        <ErrorMessage>Playlist not found</ErrorMessage>
      </Container>
    )
  }

  const totalPages = Math.ceil((tracksData?.total || 0) / TRACKS_PER_PAGE)
  const startTrack = currentPage * TRACKS_PER_PAGE + 1
  const endTrack = Math.min((currentPage + 1) * TRACKS_PER_PAGE, tracksData?.total || 0)

  return (
    <Container>
      <TopBar>
        <Logo onClick={() => router.push("/")}>PlaySwap</Logo>
      </TopBar>

      <PlaylistHeader>
        <PlaylistCoverLarge $hasImage={!!playlist.imageUrl}>
          {playlist.imageUrl ? (
            <img src={playlist.imageUrl} alt={playlist.name} />
          ) : (
            <PlaylistCoverText>{getInitials(playlist.name)}</PlaylistCoverText>
          )}
        </PlaylistCoverLarge>
        <PlaylistDetails>
          <PlaylistType>⚡ Playlist</PlaylistType>
          <PlaylistTitle>{playlist.name}</PlaylistTitle>
          {playlist.description && (
            <PlaylistDescription>{playlist.description}</PlaylistDescription>
          )}
          <PlaylistStats>
            <span>
              Created by <StatAccent>{playlist.ownerName}</StatAccent>
            </span>
            <span>
              <StatAccent>{playlist.trackCount}</StatAccent> tracks
            </span>
          </PlaylistStats>
        </PlaylistDetails>
      </PlaylistHeader>

      {isLoadingTracks ? (
        <LoadingContainer>
          <SpinningIcon />
          <p>Loading tracks...</p>
        </LoadingContainer>
      ) : (
        <>
          <TrackTable>
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Album</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {tracksData?.items.map((track, index) => (
                <tr key={track.id}>
                  <TrackNumber>{startTrack + index}</TrackNumber>
                  <td>
                    <TrackTitleCell>
                      <TrackCoverSmall $imageUrl={track.imageUrl} />
                      <div>
                        <TrackTitle>{track.name}</TrackTitle>
                        <TrackArtist>{track.artist}</TrackArtist>
                      </div>
                    </TrackTitleCell>
                  </td>
                  <TrackAlbum>{track.album}</TrackAlbum>
                  <TrackDuration>{formatDuration(track.durationMs)}</TrackDuration>
                </tr>
              ))}
            </tbody>
          </TrackTable>

          {totalPages > 1 && (
            <PaginationContainer>
              <PaginationInfo>
                Showing {startTrack}-{endTrack} of {tracksData?.total} tracks
              </PaginationInfo>
              <PaginationButtons>
                <PaginationButton onClick={handlePrevPage} disabled={currentPage === 0}>
                  <ChevronLeft size={20} />
                  Previous
                </PaginationButton>
                <PageIndicator>
                  Page {currentPage + 1} of {totalPages}
                </PageIndicator>
                <PaginationButton onClick={handleNextPage} disabled={!tracksData?.hasNext}>
                  Next
                  <ChevronRight size={20} />
                </PaginationButton>
              </PaginationButtons>
            </PaginationContainer>
          )}
        </>
      )}

      <ActionsBar>
        <Button variant="secondary" size="md" onClick={handleBack}>
          <ArrowLeft size={20} />
          Back to Playlists
        </Button>
        <Button variant="gradient" size="md" onClick={handleConvert}>
          Convert to YouTube
        </Button>
      </ActionsBar>
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

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing["3xl"]};
  color: ${({ theme }) => theme.colors.text.secondary};
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

const PlaylistHeader = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing["2xl"]};
  padding: ${({ theme }) => theme.spacing["2xl"]} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.DEFAULT};
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};
`

const PlaylistCoverLarge = styled.div<{ $hasImage: boolean }>`
  width: 240px;
  height: 240px;
  background: ${({ $hasImage, theme }) =>
    $hasImage ? theme.colors.bg.tertiary : theme.gradients.primary};
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(16, 185, 129, 0.3);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  ${({ $hasImage }) =>
    !$hasImage &&
    `
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background:
        repeating-linear-gradient(
          0deg,
          rgba(255,255,255,0.1) 0px,
          transparent 1px,
          transparent 20px
        ),
        repeating-linear-gradient(
          90deg,
          rgba(255,255,255,0.1) 0px,
          transparent 1px,
          transparent 20px
        );
      opacity: 0.3;
    }
  `}
`

const PlaylistCoverText = styled.div`
  font-size: 96px;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: -3px;
  z-index: 1;
`

const PlaylistDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const PlaylistType = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.letterSpacing.wider};
  color: ${({ theme }) => theme.colors.accent.green.DEFAULT};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`

const PlaylistTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes["5xl"]};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
  margin-bottom: ${({ theme }) => theme.spacing.base};
  color: ${({ theme }) => theme.colors.text.primary};
`

const PlaylistDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  max-width: 600px;
  line-height: ${({ theme }) => theme.lineHeight.relaxed};
`

const PlaylistStats = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.quaternary};

  span {
    display: flex;
    align-items: center;
    gap: 6px;
  }
`

const StatAccent = styled.span`
  color: ${({ theme }) => theme.colors.accent.green.DEFAULT};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`

const TrackTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border.DEFAULT};
  }

  th {
    text-align: left;
    font-size: ${({ theme }) => theme.fontSizes.xs};
    text-transform: uppercase;
    letter-spacing: ${({ theme }) => theme.letterSpacing.wider};
    color: ${({ theme }) => theme.colors.text.quaternary};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
    padding: ${({ theme }) => theme.spacing.base} ${({ theme }) => theme.spacing.md};
  }

  td {
    padding: ${({ theme }) => theme.spacing.base} ${({ theme }) => theme.spacing.md};
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }

  tbody tr {
    transition: all ${({ theme }) => theme.transitions.fast};

    &:hover {
      background: rgba(16, 185, 129, 0.05);
    }
  }
`

const TrackNumber = styled.td`
  color: ${({ theme }) => theme.colors.text.quaternary};
  width: 60px;
  font-variant-numeric: tabular-nums;
`

const TrackTitleCell = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.base};
`

const TrackCoverSmall = styled.div<{ $imageUrl: string | null }>`
  width: 48px;
  height: 48px;
  background: ${({ $imageUrl, theme }) =>
    $imageUrl ? `url(${$imageUrl}) center/cover` : theme.gradients.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
`

const TrackTitle = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`

const TrackArtist = styled.div`
  color: ${({ theme }) => theme.colors.text.quaternary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`

const TrackAlbum = styled.td`
  color: ${({ theme }) => theme.colors.text.quaternary};
`

const TrackDuration = styled.td`
  color: ${({ theme }) => theme.colors.text.quaternary};
  text-align: right;
  font-variant-numeric: tabular-nums;
`

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl} 0;
  margin-top: ${({ theme }) => theme.spacing.xl};
`

const PaginationInfo = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.quaternary};
`

const PaginationButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.base};
  align-items: center;
`

const PaginationButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.base}`};
  background: ${({ theme }) => theme.effects.glass.background};
  border: 1px solid ${({ theme }) => theme.effects.glass.border};
  color: ${({ theme }) => theme.colors.text.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.base};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`

const PageIndicator = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: 0 ${({ theme }) => theme.spacing.base};
`

const ActionsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl} 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border.DEFAULT};
  margin-top: ${({ theme }) => theme.spacing["2xl"]};
`
