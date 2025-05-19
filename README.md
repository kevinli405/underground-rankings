# Underground Rankings

A web application for ranking underground rappers using an ELO rating system. Users can vote on head-to-head matchups between rappers to determine their rankings.

## Features

- User authentication with Supabase
- Head-to-head voting system
- ELO-based ranking algorithm
- Leaderboard with detailed statistics
- Individual rapper profiles
- User profiles with voting history

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Authentication & Database)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/underground-rankings.git
cd underground-rankings
```

2. Install dependencies:
```bash
npm install
```

3. Create a Supabase project and get your API keys from the Supabase dashboard.

4. Create a `.env.local` file in the root directory with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database Schema

The application uses the following database tables in Supabase:

- `rappers`: Stores information about each rapper
- `matches`: Records of head-to-head matchups
- `votes`: User voting history
- `profiles`: Extended user profile information

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
