import { NextResponse } from 'next/server';
import matchesData from '@/data/predictions.json';

export async function GET() {
  // Return all matches
  return NextResponse.json(matchesData.matches);
}
