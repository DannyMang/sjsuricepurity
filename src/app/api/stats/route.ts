import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { TestResult } from '@/lib/models/TestResult';

const questions = [
  "Current student at SJSU?",
  "Thought about dropping out of school?",
  "Applied to (or in) graduate school at SJSU?",
  "On scholarship?",
  "Stayed at a dorm freshman year?",
  "Came from a Bay Area High School?",
  "Slept on campus at the MLK?",
  "Camped a study room?",
  "Encountered a homeless person in the MLK / study room?",
  "Tried Sparcos?",
  "Went to Sparcos at midnight after a concert/rave and had to wait forever?",
  "Went to a rave?",
  "Joined a student organization?",
  "Joined a cultural organization?",
  "Joined an academic club?",
  "Been to a frat party?",
  "Been to a frat party and ended up getting too drunk and puking?",
  "Smoked on campus?",
  "Drank on campus?",
  "Vaped in class?",
  "Went to the student union for a meal?",
  "Went to the student union and stole a meal?",
  "Went to the Ginger Market?",
  "Went to the Ginger Market and stole a meal?",
  "Ordered food delivery to campus?",
  "Cheated on an exam?",
  "Used AI tools to complete homework?",
  "Been late to class?",
  "Caught using AI tools to complete homework?",
  "Skipped a class?",
  "Been caught skipping class by a professor?",
  "Skipped a whole class for the whole semester?",
  "Attended less than 5 lectures through a term?",
  "Turned in an assignment at 11:59?",
  "Pulled an all-nighter to finish a project or study for an exam?",
  "Dropped a class after the first week?",
  "Changed your major?",
  "Ate Panda for a week straight?"
];

export async function GET() {
  try {
    await connectDB();

    const totalTests = await TestResult.countDocuments();
    const aggregateResult = await TestResult.aggregate([
      { $group: { _id: null, averageScore: { $avg: '$score' } } }
    ]);
    const averageScore = aggregateResult[0]?.averageScore || 0;

    const questionStats = await TestResult.aggregate([
      { $unwind: { path: '$answers', includeArrayIndex: 'questionIndex' } },
      {
        $group: {
          _id: '$questionIndex',
          count: { $sum: { $cond: ['$answers', 1, 0] } }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const stats = {
      totalTests,
      averageScore,
      questionStats: questionStats.map(stat => ({
        question: questions[stat._id] || `Question ${stat._id + 1}`,
        count: stat.count,
        percentage: stat.count / totalTests
      }))
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
} 