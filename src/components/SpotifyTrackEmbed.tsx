interface SpotifyTrackEmbedProps {
  trackId: string | null;
  trackName: string | null;
}

export default function SpotifyTrackEmbed({ trackId, trackName }: SpotifyTrackEmbedProps) {
  if (!trackId) {
    return (
      <div className="bg-gray-100 rounded p-2 text-sm text-gray-500">
        No preview available for {trackName || 'this track'}
      </div>
    );
  }

  return (
    <div className="w-full h-[80px] bg-gray-100 rounded overflow-hidden">
      <iframe
        src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`}
        width="100%"
        height="80"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    </div>
  );
} 