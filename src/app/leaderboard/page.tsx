'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Rapper } from '@/lib/database.types';

export default function LeaderboardPage() {
  const [rappers, setRappers] = useState<Rapper[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTopRappers() {
      try {
        const { data, error } = await supabase
          .from('rappers')
          .select('*')
          .order('elo_rating', { ascending: false })
          .limit(20);

        if (error) throw error;
        setRappers(data || []);
      } catch (err) {
        console.error('Error fetching rappers:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch rappers');
      } finally {
        setIsLoading(false);
      }
    }

    fetchTopRappers();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-8">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Top Underground Rappers</h1>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="divide-y divide-gray-200">
          {rappers.map((rapper, index) => (
            <Link 
              href={`/rapper/${rapper.id}`} 
              key={rapper.id}
              className="flex items-center p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0 w-12 text-2xl font-bold text-gray-500 text-center">
                {index + 1}
              </div>
              <div className="flex-shrink-0 relative w-16 h-16 rounded-full overflow-hidden">
                <Image
                  src={rapper.image_url}
                  alt={rapper.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="ml-4 flex-grow">
                <h2 className="text-lg font-semibold text-gray-900">{rapper.name}</h2>
                <p className="text-sm text-gray-500">Top Track: {rapper.top_track}</p>
              </div>
              <div className="flex-shrink-0 ml-4">
                <div className="text-lg font-semibold text-blue-600">
                  {rapper.elo_rating}
                </div>
                <div className="text-sm text-gray-500">
                  {rapper.total_matches} matches
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 