export type Rapper = {
  id: string;
  name: string;
  image_url: string;
  spotify_id: string | null;
  spotify_url: string | null;
  popularity: number | null;
  followers: number | null;
  // First track
  top_track: string | null;
  top_track_id: string | null;
  top_track_spotify_url: string | null;
  top_track_album: string | null;
  top_track_album_image: string | null;
  // Second track
  second_track: string | null;
  second_track_id: string | null;
  second_track_spotify_url: string | null;
  second_track_album: string | null;
  second_track_album_image: string | null;
  // Third track
  third_track: string | null;
  third_track_id: string | null;
  third_track_spotify_url: string | null;
  third_track_album: string | null;
  third_track_album_image: string | null;
  // Voting system
  elo_rating: number;
  total_matches: number;
  created_at: string;
};

export type Vote = {
  id: string;
  winner_id: string;
  loser_id: string;
  created_at: string;
}; 