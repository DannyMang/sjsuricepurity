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
  "Ate Panda for a week straight?",
  "Went to the SRAC?",
  "Went to the SRAC but went back cause it was too crowded?",
  "Ate @ the best food spot on campus (Halal Shack) for a week straight?",
  "Ate DC food?",
  "Commuter student?",
  "Couldn't find parking on first day of campus?",
  "Went to a career fair on campus?",
  "Got a job/internship from the career fair?",
  "Went to SpartanFest?",
  "Forgot student ID?",
  "Forgot student ID at the door and had to awkwardly wait until someone opened it for you?",
  "Stopped by somebody on 7th Street?",
  "Had to table on 7th Street?",
  "Played intramural sports with classmates or friends?",
  "Taken a picture with Sammy?",
  "Has ever used the Sammy app?",
  "Joined a frat/soroity?",
  "Joined a sorority?",
  "Went bowling in the SU?",
  "Taken the South campus garage bus?",
  "Held hands w/ someone on campus?",
  "Kissed someone on campus?",
  "Been on a date w/ someone on campus?",
  "Been on a date/ taken on a date to Westfield Valley Fair?",
  "Slept in car during school?",
  "Got a parking ticket?",
  "Had class scheduling date so bad that you ended up taking a professer with < 1.0 on RMP?",
  "Taken a picture with Sammy?",
  "Used a LYFT/ Lime scooter?",
  "Active user of the r/SJSU reddit?",
  "Active user on the SJSU Discord?",
  "Was in the SU during the Panda Express fire?",
  "Ate Taco Bell for a week straight?",
  "Tried the campus sushi?",
  "Tried the Ginger Market boba?",
  "Tried Tea Degree?",
  "Tried Campus Burger?",
  "Ride a scooter on campus?",
  "Had to carry a group project?",
  "Been the one that got carried in a group project?",
  "Placed a review on RMP?",
  "Hated a professor so much you had to let it all out on RMP?",
  "Organized an event on campus?",
  "Been part of student gov/ council?",
  "Held a leadership position in a student org?",
  "Have a big/little in a sorority/frat/club?",
  "Dated their big/little in a sorority/frat/club?",
  "Pulled an all-nighter for an assignment or exam?",
  "Attended a lecture without doing the assigned reading?",
  "Been to an SJSU football game at CEFCU Stadium?",
  "Had a crush on one of your professors or TAs?",
  "Parked illegally near campus or even in the employee parking?",
  "Visited Christmas in the Park during winter break season?",
  "Gone ice skating at Downtown Ice near campus?",
  "Had a roommate conflict while living in student housing?",
  "Gone on a date with someone from another Bay Area university (e.g., Stanford, UC Berkeley)?",
  "Dated a professor/ TA?",
  "Played basketball or volleyball at SRAC courts?",
  "Walked under the Student Union archway?",
  "Spent >1 hr in a parking structure to secure a parking spot?",
  "Car hit in parking lot?",
  "Got rejected from every UC?"
];

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    console.log('Attempting to connect to MongoDB...');
    await connectDB();
    console.log('Successfully connected to MongoDB');

    const totalTests = await TestResult.countDocuments();
    console.log('Total tests:', totalTests);

    const aggregateResult = await TestResult.aggregate([
      { $group: { _id: null, averageScore: { $avg: '$score' } } }
    ]);
    console.log('Aggregate result:', aggregateResult);

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
    console.log('Question stats:', questionStats);

    return NextResponse.json({
      totalTests,
      averageScore,
      questionStats: questionStats.map(stat => ({
        question: questions[stat._id] || `Question ${stat._id + 1}`,
        count: stat.count,
        percentage: stat.count / totalTests
      }))
    });
  } catch (error) {
    console.error('Detailed error in stats route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics', details: (error as Error).message },
      { status: 500 }
    );
  }
} 