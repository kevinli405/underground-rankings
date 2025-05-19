import { supabase } from '@/lib/supabase';
import SpotifyTrackEmbed from '@/components/SpotifyTrackEmbed';

export default async function RapperPage({ params }: { params: { id: string } }) {
  const { data: rapper, error } = await supabase
    .from('rappers')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !rapper) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] flex-col">
        <div className="text-red-600 mb-4">Error: {error?.message || 'Rapper not found'}</div>
      </div>
    );
  }

  console.log('Rapper data:', {
    name: rapper.name,
    image_url: rapper.image_url,
    spotify_url: rapper.spotify_url,
    elo: rapper.elo_rating
  });

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="flex flex-col items-center mb-8">
        <img 
          src={rapper.image_url} 
          alt={rapper.name}
          style={{ width: '192px', height: '192px', objectFit: 'cover', borderRadius: '50%', marginBottom: '8px' }}
        />

        <h1 className="text-4xl font-bold" style={{ margin: '8px 0' }}>{rapper.name}</h1>

        <a 
          href={rapper.spotify_url || '#'} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            backgroundColor: '#1DB954', 
            color: 'white',
            padding: '8px 24px',
            borderRadius: '9999px',
            marginTop: '8px',
            textDecoration: 'none'
          }}
        >
          View on Spotify
        </a>
      </div>

      <div className="bg-white rounded-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-gray-600 text-sm">ELO Rating</div>
            <div className="text-2xl font-bold">{rapper.elo_rating}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-gray-600 text-sm">Total Matches</div>
            <div className="text-2xl font-bold">{rapper.total_matches}</div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Top Tracks</h2>
          <div className="space-y-4">
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
      </div>
    </div>
  );
} 