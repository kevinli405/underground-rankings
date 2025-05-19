import Image from 'next/image';
import { Rapper } from '@/lib/database.types';
import SpotifyTrackEmbed from './SpotifyTrackEmbed';

interface RapperCardProps {
  rapper: Rapper;
  onVote: () => void;
}

export default function RapperCard({ rapper, onVote }: RapperCardProps) {
  return (
    <div 
      onClick={onVote}
      className="bg-white rounded-lg shadow-lg p-6 cursor-pointer transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-105 hover:bg-gray-50"
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-32 h-32 rounded-full overflow-hidden">
          <Image
            src={rapper.image_url}
            alt={rapper.name}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">{rapper.name}</h2>
          <p className="text-gray-500 text-sm">
            ELO: {rapper.elo_rating}
          </p>
          {rapper.spotify_url && (
            <a 
              href={rapper.spotify_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-green-600 hover:text-green-700 mt-1 block"
              onClick={(e) => e.stopPropagation()}
            >
              View on Spotify
            </a>
          )}
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <h3 className="text-sm font-semibold text-gray-600 mb-3">Top Tracks:</h3>
        <SpotifyTrackEmbed 
          trackId={rapper.top_track_id}
          trackName={rapper.top_track}
        />
        <SpotifyTrackEmbed 
          trackId={rapper.second_track_id}
          trackName={rapper.second_track}
        />
        <SpotifyTrackEmbed 
          trackId={rapper.third_track_id}
          trackName={rapper.third_track}
        />
      </div>
    </div>
  );
} 