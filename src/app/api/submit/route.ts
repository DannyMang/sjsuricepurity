import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { TestResult } from '@/lib/models/TestResult';

export async function POST(request: Request) {
  try {
    const { score, answers } = await request.json();

    await connectDB();
    
    const result = new TestResult({
      score,
      answers
    });

    await result.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving test result:', error);
    return NextResponse.json(
      { error: 'Failed to save test result' },
      { status: 500 }
    );
  }
} 