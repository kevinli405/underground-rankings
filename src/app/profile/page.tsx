export default function ProfilePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Your Information</h2>
            <p className="text-gray-600">Please sign in to view your profile</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">Your Voting History</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-600">Sign in to see your voting history</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Total Votes</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Favorite Rapper</p>
                <p className="text-2xl font-bold">-</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="text-2xl font-bold">-</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 