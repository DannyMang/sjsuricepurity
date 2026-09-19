'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';

function percentileLabel(value: number) {
  const remainder = value % 100;
  if (remainder >= 11 && remainder <= 13) {
    return `${value}th`;
  }

  switch (value % 10) {
    case 1:
      return `${value}st`;
    case 2:
      return `${value}nd`;
    case 3:
      return `${value}rd`;
    default:
      return `${value}th`;
  }
}

// Create a client component that uses useSearchParams
function ResultsContent() {
  const searchParams = useSearchParams();
  const score = searchParams.get('score');
  const [copied, setCopied] = useState(false);
  const [percentile, setPercentile] = useState<number | null>(null);

  useEffect(() => {
    if (score === null || score === '') {
      return;
    }

    const fetchPercentile = async () => {
      try {
        const response = await fetch(`/api/percentile?score=${encodeURIComponent(score)}`);
        if (!response.ok) {
          return;
        }

        const data = await response.json();
        if (typeof data.percentile === 'number') {
          setPercentile(data.percentile);
        }
      } catch (error) {
        console.error('Error loading percentile:', error);
      }
    };

    fetchPercentile();
  }, [score]);

  const shareResult = () => {
    const shareText = `I got ${score} on the SJSU Purity Test! Try it yourself:`;
    const shareUrl = window.location.origin;
    
    navigator.clipboard.writeText(`${shareText} ${shareUrl}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{ 
      maxWidth: "800px",
      width: "calc(100% - 2rem)",
      margin: "1rem auto",
      padding: "2rem",
      backgroundColor: "rgba(253, 246, 227, 0.95)",
      border: "2px solid #e6d5b8",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(210, 190, 160, 0.15)",
      color: "#000" // Ensure text color is black
    }}>
      <div style={{ textAlign: "center" }}>
        <Image 
          src="/sjsuricepurity.png" 
          alt="The Official SJSU Purity Test"
          width={600}
          height={200}
          style={{ 
            maxWidth: "600px", 
            width: "100%", 
            height: "auto",
            margin: "0 auto 1.5rem auto",
            display: "block"
          }}
        />
        
        <h1 style={{ 
          fontSize: "2rem", 
          fontWeight: "bold", 
          marginBottom: "2rem",
          color: "#000"
        }}>
          Your SJSU Purity Score
        </h1>
        
        <div style={{ 
          fontSize: "3.5rem", 
          fontWeight: "bold", 
          marginBottom: percentile === null ? "2.25rem" : "0.4rem",
          color: "#000"
        }}>
          {score}
        </div>

        {percentile !== null && (
          <p style={{
            fontSize: "1rem",
            fontStyle: "italic",
            marginBottom: "1.75rem",
            color: "#000"
          }}>
            That's the {percentileLabel(percentile)} percentile of test takers.
          </p>
        )}

        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          gap: "1rem"
        }}>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              onClick={shareResult}
              style={{
                backgroundColor: "#8b0000",
                color: "white",
                border: "1px solid #8b0000",
                borderRadius: "0",
                padding: "0.75rem 2rem",
                fontFamily: "Times New Roman, Times, serif",
                fontSize: "1.25rem",
                fontWeight: "700",
                cursor: "pointer"
              }}
            >
              {copied ? 'Copied!': 'Share Result'}
            </button>
            <Link
              href="/"
              style={{
                border: "2px solid #8b0000",
                color: "#8b0000",
                padding: "0.75rem 2rem",
                fontSize: "1.25rem",
                textDecoration: "none",
                fontFamily: "Times New Roman, Times, serif",
                fontWeight: "700"
              }}
            >
              Take the test again
            </Link>
          </div>
          <Link
            href={score ? `/stats?score=${encodeURIComponent(score)}` : '/stats'}
            style={{
              border: "2px solid #8b0000",
              color: "#8b0000",
              padding: "0.75rem 2rem",
              fontSize: "1.25rem",
              textDecoration: "none",
              fontFamily: "Times New Roman, Times, serif",
              fontWeight: "700"
            }}
          >
            View Statistics
          </Link>
          <div style={{
            marginTop: "2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.35rem",
            color: "#000",
            fontSize: "1.1rem"
          }}>
            <span>Updated by Rachel.</span>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem"
            }}>
              <span>Originally created by Daniel U.</span>
              <a
                href="https://x.com/danielung19"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  lineHeight: 0
                }}
              >
                <Image
                  src="/x.png"
                  alt="Daniel U. on X"
                  width={20}
                  height={20}
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function Results() {
  return (
    <main style={{ 
      minHeight: "100vh", 
      backgroundColor: "#f5f0e6",
      fontFamily: "Times New Roman, Times, serif",
      position: "relative",
      padding: "2rem 1rem",
      color: "#000"
    }}>
      <Suspense fallback={
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
          <h1 style={{ 
            fontSize: "2rem", 
            fontWeight: "bold",
            color: "#000"
          }}>
            Loading results...
          </h1>
        </div>
      }>
        <ResultsContent />
      </Suspense>
    </main>
  );
}