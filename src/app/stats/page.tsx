'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface QuestionStat {
  question: string;
  count: number;
  percentage: number;
}

interface ScoreBucket {
  range: string;
  count: number;
}

interface Stats {
  totalTests: number;
  medianScore: number;
  mostSelected: QuestionStat[];
  leastSelected: QuestionStat[];
  scoreDistribution: ScoreBucket[];
}

function QuestionRankList({
  title,
  stats
}: {
  title: string;
  stats: QuestionStat[] | undefined;
}) {
  return (
    <>
      <h2 style={{
        fontSize: "2rem",
        fontWeight: "bold",
        marginBottom: "1.5rem",
        color: "#000"
      }}>
        {title}
      </h2>

      {stats && stats.length > 0 ? stats.map((stat, index) => (
        <div key={`${title}-${index}`} style={{ marginBottom: "1.5rem", color: "#000" }}>
          <p style={{
            fontSize: "1.25rem",
            marginBottom: "0.25rem",
            color: "#000",
            fontWeight: "normal"
          }}>
            {index + 1}. {stat.question}
          </p>
          <p style={{
            fontSize: "1.1rem",
            color: "#000",
            marginBottom: "0.5rem"
          }}>
            {stat.count} {stat.count === 1 ? 'person' : 'people'} ({(stat.percentage * 100).toFixed(1)}% of test takers)
          </p>
          <hr style={{
            border: "none",
            height: "1px",
            backgroundColor: "#000",
            margin: "0.5rem 0"
          }}/>
        </div>
      )) : (
        <p style={{ fontSize: "1.1rem", marginBottom: "2rem", color: "#000" }}>
          No responses yet.
        </p>
      )}
    </>
  );
}

function ScoreDistributionChart({ buckets }: { buckets: ScoreBucket[] | undefined }) {
  const maxCount = Math.max(1, ...(buckets ?? []).map((bucket) => bucket.count));

  return (
    <div style={{
      marginBottom: "2.5rem",
      padding: "1.25rem 1rem 1rem 1rem",
      border: "1px solid #e6d5b8",
      backgroundColor: "rgba(245, 240, 230, 0.65)"
    }}>
      <div style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: "0.75rem",
        height: "220px",
        borderBottom: "2px solid #8b0000",
        padding: "0 0.25rem"
      }}>
        {(buckets ?? []).map((bucket) => {
          const heightPercent = (bucket.count / maxCount) * 100;
          return (
            <div
              key={bucket.range}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
                height: "100%",
                minWidth: 0
              }}
            >
              <span style={{
                fontSize: "0.95rem",
                marginBottom: "0.35rem",
                color: "#000",
                fontWeight: "700"
              }}>
                {bucket.count}
              </span>
              <div
                title={`${bucket.range}: ${bucket.count} test takers`}
                style={{
                  width: "70%",
                  maxWidth: "64px",
                  height: `${Math.max(heightPercent, bucket.count > 0 ? 6 : 0)}%`,
                  minHeight: bucket.count > 0 ? "8px" : "0px",
                  backgroundColor: "#8b0000",
                  border: bucket.count > 0 ? "1px solid #5c0000" : "none"
                }}
              />
            </div>
          );
        })}
      </div>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "0.75rem",
        marginTop: "0.6rem",
        padding: "0 0.25rem"
      }}>
        {(buckets ?? []).map((bucket) => (
          <div
            key={`${bucket.range}-label`}
            style={{
              flex: 1,
              textAlign: "center",
              fontSize: "0.95rem",
              color: "#000",
              minWidth: 0
            }}
          >
            {bucket.range}
          </div>
        ))}
      </div>
    </div>
  );
}

function StatsContent() {
  const searchParams = useSearchParams();
  const score = searchParams.get('score');
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

  const resultsHref = score ? `/results?score=${encodeURIComponent(score)}` : '/results';

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
            marginBottom: "1.25rem",
            color: "#000"
          }}>
            Median Score: {stats?.medianScore != null ? Number(stats.medianScore).toFixed(stats.medianScore % 1 === 0 ? 0 : 1) : 0}
          </p>

          <h3 style={{
            fontSize: "1.4rem",
            fontWeight: "bold",
            marginBottom: "0.75rem",
            color: "#000"
          }}>
            Score Distribution
          </h3>

          <ScoreDistributionChart buckets={stats?.scoreDistribution} />

          <QuestionRankList title="Most Selected Questions" stats={stats?.mostSelected} />
          <QuestionRankList title="Least Selected Questions" stats={stats?.leastSelected} />

          <div style={{
            textAlign: "center",
            marginTop: "2rem",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "1rem"
          }}>
            <Link
              href={resultsHref}
              style={{
                border: "2px solid #8b0000",
                color: "#8b0000",
                backgroundColor: "transparent",
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
              Back to Results
            </Link>
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

export default function StatsPage() {
  return (
    <Suspense fallback={
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
    }>
      <StatsContent />
    </Suspense>
  );
}
