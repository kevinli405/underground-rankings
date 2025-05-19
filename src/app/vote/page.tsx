'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Rapper } from '@/lib/database.types';
import { calculateNewRatings } from '@/lib/elo';
import RapperCard from '@/components/RapperCard';

export default function VotePage() {
  const [rappers, setRappers] = useState<[Rapper | null, Rapper | null]>([null, null]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRandomPair = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Fetching rappers...');
      // Get all rappers first
      const { data: allRappers, error: error1 } = await supabase
        .from('rappers')
        .select('*');

      if (error1) {
        throw new Error(`Error fetching rappers: ${error1.message}`);
      }

      if (!allRappers || allRappers.length < 2) {
        throw new Error('Not enough rappers in the database');
      }

      // Get first random rapper
      const rapper1 = allRappers[Math.floor(Math.random() * allRappers.length)];
      console.log('First rapper:', rapper1);

      // Filter rappers with similar ELO rating
      const similarRappers = allRappers.filter(r => 
        r.id !== rapper1.id && 
        r.elo_rating >= rapper1.elo_rating - 100 &&
        r.elo_rating <= rapper1.elo_rating + 100
      );

      if (similarRappers.length === 0) {
        // If no similar rappers, just get any other rapper
        const otherRappers = allRappers.filter(r => r.id !== rapper1.id);
        const rapper2 = otherRappers[Math.floor(Math.random() * otherRappers.length)];
        console.log('Second rapper (any):', rapper2);
        setRappers([rapper1, rapper2]);
      } else {
        // Get random rapper from similar ELO ratings
        const rapper2 = similarRappers[Math.floor(Math.random() * similarRappers.length)];
        console.log('Second rapper (similar ELO):', rapper2);
        setRappers([rapper1, rapper2]);
      }
    } catch (error) {
      console.error('Error fetching rappers:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while fetching rappers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (winnerId: string, loserId: string) => {
    try {
      const winner = rappers[0]?.id === winnerId ? rappers[0] : rappers[1];
      const loser = rappers[0]?.id === loserId ? rappers[0] : rappers[1];

      if (!winner || !loser) return;

      const [newWinnerRating, newLoserRating] = calculateNewRatings(
        winner.elo_rating,
        loser.elo_rating
      );

      // Update ratings
      await supabase
        .from('rappers')
        .update({ 
          elo_rating: newWinnerRating,
          total_matches: winner.total_matches + 1
        })
        .eq('id', winner.id);

      await supabase
        .from('rappers')
        .update({ 
          elo_rating: newLoserRating,
          total_matches: loser.total_matches + 1
        })
        .eq('id', loser.id);

      // Record the vote
      await supabase
        .from('votes')
        .insert([
          {
            winner_id: winner.id,
            loser_id: loser.id
          }
        ]);

      // Fetch next pair
      fetchRandomPair();
    } catch (error) {
      console.error('Error recording vote:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while recording vote');
    }
  };

  useEffect(() => {
    fetchRandomPair();
  }, []);

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] flex-col">
        <div className="text-red-600 mb-4">Error: {error}</div>
        <button
          onClick={fetchRandomPair}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Who's Better?</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {rappers[0] && (
          <RapperCard
            rapper={rappers[0]}
            onVote={() => rappers[1] && handleVote(rappers[0]!.id, rappers[1].id)}
          />
        )}
        {rappers[1] && (
          <RapperCard
            rapper={rappers[1]}
            onVote={() => rappers[0] && handleVote(rappers[1]!.id, rappers[0].id)}
          />
        )}
      </div>
      <button
        onClick={fetchRandomPair}
        className="mt-8 mx-auto block bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded transition"
      >
        Skip This Pair
      </button>
    </div>
  );
} 