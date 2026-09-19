import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { TestResult } from '@/lib/models/TestResult';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawScore = searchParams.get('score');
    const score = rawScore === null ? NaN : Number(rawScore);

    if (!Number.isFinite(score)) {
      return NextResponse.json(
        { error: 'A numeric score is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const totalTests = await TestResult.countDocuments();
    if (totalTests === 0) {
      return NextResponse.json({
        percentile: null,
        totalTests
      });
    }

    const scoresAtOrBelow = await TestResult.countDocuments({ score: { $lte: score } });
    const percentile = Math.round((scoresAtOrBelow / totalTests) * 100);

    return NextResponse.json({
      percentile,
      totalTests
    });
  } catch (error) {
    console.error('Error calculating percentile:', error);
    return NextResponse.json(
      { error: 'Failed to calculate percentile', details: (error as Error).message },
      { status: 500 }
    );
  }
}
