export default function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to Underground Rankings</h1>
      <p className="text-xl mb-8">
        Discover and vote on the best underground rappers. Help build the definitive ranking system for underground hip-hop.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <a
          href="/vote"
          className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 transition"
        >
          <h2 className="text-2xl font-bold mb-2">Vote Now</h2>
          <p>Compare rappers head-to-head and influence the rankings</p>
        </a>
        <a
          href="/leaderboard"
          className="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 transition"
        >
          <h2 className="text-2xl font-bold mb-2">View Rankings</h2>
          <p>Check out the current standings and top performers</p>
        </a>
      </div>
    </div>
  );
}
