'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  const [answers, setAnswers] = useState<boolean[]>(new Array(100).fill(false));
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const checkedCount = answers.filter(Boolean).length;
    const score = Math.round(((questions.length - checkedCount) / questions.length) * 100);

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          score,
          answers: answers.slice(0, questions.length)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit results');
      }

      router.push(`/results?score=${score}`);
    } catch (error) {
      console.error('Error submitting results:', error);
      router.push(`/results?score=${score}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckboxChange = (index: number) => {
    const newAnswers = [...answers];
    newAnswers[index] = !newAnswers[index];
    setAnswers(newAnswers);
  };

  return (
    <main className="min-h-screen py-8" style={{ 
      backgroundColor: "#f5f0e6",
      fontFamily: "Times New Roman, Times, serif",
      position: "relative",
      color: "#000"
    }}>
      <div style={{ 
        maxWidth: "800px",
        width: "calc(100% - 2rem)",
        margin: "1rem auto",
        padding: "2rem",
        backgroundColor: "rgba(253, 246, 227, 0.95)",
        border: "2px solid #e6d5b8",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(210, 190, 160, 0.15)",
        color: "#000"
      }}>
        <div style={{ textAlign: "center", marginBottom: "1.3rem" }}>
          <Image
            src="/sjsuricepurity.png" 
            alt="The Official SJSU Purity Test"
            style={{ 
              maxWidth: "600px", 
              width: "100%", 
              height: "auto",
              margin: "0 auto 1.5rem auto",
              display: "block"
            }}
          />
        </div>
        
        <div style={{ 
          textAlign: "center", 
          marginBottom: "2rem",
          lineHeight: "1.5",
          maxWidth: "600px",
          margin: "0 auto 2rem auto",
          fontSize: "17.6px",
          color: "#000"
        }}>
          The first ever SJSU Purity Test. Serving as a way for students to bond and track 
          their experiences throughout their time at San Jose State University. It is a 
          voluntary opportunity for students to reflect on their unique university journey.
        </div>

        <p style={{ 
          textAlign: "center",
          fontWeight: "900",
          marginBottom: "1rem",
          fontSize: "17.6px",
          color: "#000"
        }}>
          Caution: This is not a bucket list. You are beyond cooked if you complete all the items on this list.
        </p>

        <p style={{ 
          textAlign: "center",
          marginBottom: "2rem",
          fontSize: "17.6px",
          color: "#000"
        }}>
          Click on every item you have done. Your purity score will be calculated at the end.
        </p>

        <div style={{ 
          maxWidth: "650px",
          margin: "0 auto",
          color: "#000"
        }}>
          {questions.map((question, index) => (
            <div key={index} style={{ 
              display: "flex", 
              alignItems: "center", 
              marginBottom: "0.5rem",
              position: "relative",
              paddingLeft: "2rem",
              color: "#000"
            }}>
              <span style={{
                position: "absolute",
                left: "0",
                minWidth: "1.5rem",
                textAlign: "right",
                fontSize: "16px",
                color: "#000"
              }}>{index + 1}.</span>
              <input
                type="checkbox"
                id={`question-${index}`}
                checked={answers[index]}
                onChange={() => handleCheckboxChange(index)}
                style={{ marginRight: "0.5rem" }}
              />
              <label 
                htmlFor={`question-${index}`}
                style={{ 
                  fontSize: "16px", 
                  lineHeight: "1.4",
                  color: "#000"
                }}
              >
                {question}
              </label>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            style={{
              backgroundColor: isSubmitting ? "#a0a0a0" : "#8b0000",
              color: "white",
              border: `1px solid ${isSubmitting ? "#a0a0a0" : "#8b0000"}`,
              borderRadius: "0",
              padding: "8px 20px",
              fontFamily: "Times New Roman, Times, serif",
              fontSize: "1.3rem",
              fontWeight: "700",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              position: "relative",
              minWidth: "200px"
            }}
          >
            {isSubmitting ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                <div style={{ 
                  width: "20px", 
                  height: "20px", 
                  border: "3px solid #ffffff",
                  borderTop: "3px solid transparent",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite"
                }} />
                <span>Calculating...</span>
              </div>
            ) : (
              "Calculate My Score"
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}
