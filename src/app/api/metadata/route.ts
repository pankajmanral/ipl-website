import { NextResponse } from 'next/server';
import matchesData from '@/data/predictions.json';

export async function GET() {
  const { matches, ...metadata } = matchesData;
  return NextResponse.json(metadata);
}
