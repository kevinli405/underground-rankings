'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { User } from '@supabase/supabase-js';

interface UserVote {
  id: string;
  created_at: string;
  winner: {
    id: string;
    name: string;
    image_url: string;
  };
  loser: {
    id: string;
    name: string;
    image_url: string;
  };
}

interface VoteResponse {
  id: string;
  created_at: string;
  winner: {
    id: string;
    name: string;
    image_url: string;
  };
  loser: {
    id: string;
    name: string;
    image_url: string;
  };
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [votes, setVotes] = useState<UserVote[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [favoriteRapper, setFavoriteRapper] = useState<string>('-');
  const [memberSince, setMemberSince] = useState<string>('-');
  const [isLoading, setIsLoading] = useState(true);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        // Reset state when no user is logged in
        setVotes([]);
        setTotalVotes(0);
        setFavoriteRapper('-');
        setMemberSince('-');
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        // Reset state when user signs out
        setVotes([]);
        setTotalVotes(0);
        setFavoriteRapper('-');
        setMemberSince('-');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch user's votes with rapper details
      const { data: votesData, error: votesError } = await supabase
        .from('votes')
        .select(`
          id,
          created_at,
          winner:winner_id (id, name, image_url),
          loser:loser_id (id, name, image_url)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (votesError) {
        console.error('Error fetching votes:', votesError);
        throw votesError;
      }

      if (votesData) {
        const typedVotes = votesData as unknown as VoteResponse[];
        setVotes(typedVotes);
        setTotalVotes(typedVotes.length);

        // Calculate favorite rapper (most voted for)
        const rapperVotes = new Map<string, number>();
        typedVotes.forEach(vote => {
          const winnerId = vote.winner.id;
          rapperVotes.set(winnerId, (rapperVotes.get(winnerId) || 0) + 1);
        });
        
        const favorite = Array.from(rapperVotes.entries())
          .sort((a, b) => b[1] - a[1])[0];
        
        if (favorite) {
          const { data: rapperData, error: rapperError } = await supabase
            .from('rappers')
            .select('name')
            .eq('id', favorite[0])
            .single();
          
          if (rapperError) {
            console.error('Error fetching favorite rapper:', rapperError);
          } else {
            setFavoriteRapper(rapperData?.name || '-');
          }
        }
      }

      // Get member since date from auth user
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.created_at) {
        setMemberSince(new Date(user.created_at).toLocaleDateString());
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          name: error.name,
          stack: error.stack
        });
      }
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              email_confirmed: true
            }
          }
        });
        if (signUpError) throw signUpError;
        
        // Sign in immediately after sign up
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (signInError) throw signInError;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during authentication');
    }
  };

  const handleSignOut = async () => {
    // Reset state before signing out
    setVotes([]);
    setTotalVotes(0);
    setFavoriteRapper('-');
    setMemberSince('-');
    setEmail('');
    setPassword('');
    await supabase.auth.signOut();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Your Information</h2>
            {user ? (
              <div className="space-y-2">
                <p className="text-gray-600">Email: {user.email}</p>
                <button
                  onClick={handleSignOut}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex space-x-4 mb-4">
                  <button
                    onClick={() => setIsSignUp(false)}
                    className={`px-4 py-2 rounded ${!isSignUp ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setIsSignUp(true)}
                    className={`px-4 py-2 rounded ${isSignUp ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    Sign Up
                  </button>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                  )}
                  <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    {isSignUp ? 'Sign Up' : 'Sign In'}
                  </button>
                </form>
              </div>
            )}
          </div>
          
          {user && (
            <>
              <div>
                <h2 className="text-xl font-semibold mb-2">Your Voting History</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  {votes.length > 0 ? (
                    <div className="space-y-4">
                      {votes.map((vote) => (
                        <div key={vote.id} className="flex items-center justify-between p-2 bg-white rounded">
                          <div className="flex items-center space-x-4">
                            <div className="relative w-10 h-10">
                              <Image
                                src={vote.winner.image_url}
                                alt={vote.winner.name}
                                fill
                                className="rounded-full object-cover"
                              />
                            </div>
                            <span className="font-medium">{vote.winner.name}</span>
                          </div>
                          <span className="text-gray-500">vs</span>
                          <div className="flex items-center space-x-4">
                            <span className="font-medium">{vote.loser.name}</span>
                            <div className="relative w-10 h-10">
                              <Image
                                src={vote.loser.image_url}
                                alt={vote.loser.name}
                                fill
                                className="rounded-full object-cover"
                              />
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(vote.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No votes yet. Start voting to see your history!</p>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Stats</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Total Votes</p>
                    <p className="text-2xl font-bold">{totalVotes}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Favorite Rapper</p>
                    <p className="text-2xl font-bold">{favoriteRapper}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="text-2xl font-bold">{memberSince}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 