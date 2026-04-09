import { NextResponse } from 'next/server';
import matchesData from '@/data/predictions.json';

export async function GET(
  request: Request,
  { params }: { params: { team: string } }
) {
  const team = params.team.replace(/-/g, ' ').toLowerCase();

  const filtered = matchesData.matches.filter(
    (m: any) => 
      m.home_team.toLowerCase() === team || 
      m.away_team.toLowerCase() === team
  );

  return NextResponse.json(filtered);
}
