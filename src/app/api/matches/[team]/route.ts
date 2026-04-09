import { NextResponse } from 'next/server';
import matchesData from '@/data/predictions.json';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ team: string }> }
) {
  const { team: teamParam } = await params;
  const team = teamParam.replace(/-/g, ' ').toLowerCase();

  const filtered = matchesData.matches.filter(
    (m: any) => 
      m.home_team.toLowerCase() === team || 
      m.away_team.toLowerCase() === team
  );

  return NextResponse.json(filtered);
}
