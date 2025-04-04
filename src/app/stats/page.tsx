'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface QuestionStat {
  question: string;
  count: number;
  percentage: number;
}

interface Stats {
  totalTests: number;
  averageScore: number;
  questionStats: QuestionStat[];
}

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log('Fetching stats...');
        const response = await fetch('/api/stats');
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error response:', errorData);
          throw new Error(`Failed to fetch statistics: ${errorData.details || 'Unknown error'}`);
        }
        
        const data = await response.json();
        console.log('Stats data:', data);
        setStats(data);
      } catch (err: unknown) {
        console.error('Detailed fetch error:', err);
        setError(`Error loading statistics: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <main style={{ 
        minHeight: "100vh", 
        backgroundColor: "#f5f0e6",
        fontFamily: "Times New Roman, Times, serif",
        position: "relative",
        padding: "2rem 1rem",
        color: "#000"
      }}>
        <div style={{ 
          maxWidth: "800px",
          margin: "1rem auto",
          padding: "2rem",
          backgroundColor: "rgba(253, 246, 227, 0.95)",
          border: "2px solid #e6d5b8",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(210, 190, 160, 0.15)",
          textAlign: "center",
          color: "#000"
        }}>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#000" }}>
            Loading statistics...
          </h1>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main style={{ 
        minHeight: "100vh", 
        backgroundColor: "#f5f0e6",
        fontFamily: "Times New Roman, Times, serif",
        position: "relative",
        padding: "2rem 1rem",
        color: "#000"
      }}>
        <div style={{ 
          maxWidth: "800px",
          margin: "1rem auto",
          padding: "2rem",
          backgroundColor: "rgba(253, 246, 227, 0.95)",
          border: "2px solid #e6d5b8",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(210, 190, 160, 0.15)",
          textAlign: "center",
          color: "#000"
        }}>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#000", marginBottom: "1rem" }}>
            Error
          </h1>
          <p style={{ color: "#000" }}>{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ 
      minHeight: "100vh", 
      backgroundColor: "#f5f0e6",
      fontFamily: "Times New Roman, Times, serif",
      position: "relative",
      padding: "2rem 1rem",
      color: "#000"
    }}>
      <div style={{ 
        maxWidth: "800px",
        margin: "1rem auto",
        padding: "2rem",
        backgroundColor: "rgba(253, 246, 227, 0.95)",
        border: "2px solid #e6d5b8",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(210, 190, 160, 0.15)",
        color: "#000",
        backgroundImage: "url(/images/head.png)",
        backgroundSize: "60px 60px",
        backgroundRepeat: "repeat",
        position: "relative"
      }}>
        <div style={{
          backgroundColor: "rgba(253, 246, 227, 0.95)",
          padding: "2rem",
          borderRadius: "8px"
        }}>
          <h1 style={{ 
            fontSize: "2.5rem", 
            fontWeight: "bold", 
            textAlign: "center", 
            marginBottom: "2rem",
            color: "#000"
          }}>
            SJSU Purity Test Statistics
          </h1>
          
          <h2 style={{ 
            fontSize: "2rem", 
            fontWeight: "bold", 
            marginBottom: "1.5rem",
            color: "#000"
          }}>
            Overall Statistics
          </h2>
          
          <p style={{ 
            fontSize: "1.25rem", 
            marginBottom: "0.5rem",
            color: "#000"
          }}>
            Total Tests Taken: {stats?.totalTests || 0}
          </p>
          
          <p style={{ 
            fontSize: "1.25rem", 
            marginBottom: "2rem",
            color: "#000"
          }}>
            Average Score: {stats?.averageScore.toFixed(2) || 0}
          </p>
          
          <h2 style={{ 
            fontSize: "2rem", 
            fontWeight: "bold", 
            marginBottom: "1.5rem",
            color: "#000"
          }}>
            Question Statistics
          </h2>
          
          {stats?.questionStats.map((stat, index) => (
            <div key={index} style={{ marginBottom: "1.5rem", color: "#000" }}>
              <p style={{ 
                fontSize: "1.25rem", 
                marginBottom: "0.25rem",
                color: "#000",
                fontWeight: "normal"
              }}>
                {stat.question}
              </p>
              <p style={{ 
                fontSize: "1.1rem", 
                color: "#000",
                marginBottom: "0.5rem"
              }}>
                {stat.count} people ({(stat.percentage * 100).toFixed(1)}% of test takers)
              </p>
              <hr style={{ 
                border: "none", 
                height: "1px", 
                backgroundColor: "#000", 
                margin: "0.5rem 0"
              }}/>
            </div>
          ))}
          
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <Link
              href="/"
              style={{
                backgroundColor: "#8b0000",
                color: "white",
                border: "1px solid #8b0000",
                borderRadius: "0",
                padding: "8px 20px",
                fontFamily: "Times New Roman, Times, serif",
                fontSize: "1.3rem",
                fontWeight: "700",
                cursor: "pointer",
                textDecoration: "none",
                display: "inline-block"
              }}
            >
              Take the Test
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
} 