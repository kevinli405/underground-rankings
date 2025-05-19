import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              Underground Rankings
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link href="/vote" className="hover:text-gray-300">
              Vote
            </Link>
            <Link href="/leaderboard" className="hover:text-gray-300">
              Leaderboard
            </Link>
            <Link href="/profile" className="hover:text-gray-300">
              Profile
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 