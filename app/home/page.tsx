'use client';

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

function SearchParamsHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const access_token = searchParams.get("access_token");

    if (access_token) {
      localStorage.setItem("access_token", access_token);
      console.log("Access token stored in localStorage:", access_token);
    }
  }, [searchParams]);

  return null;
}

export default function LoggedIn() {
  const handleGet50Recent = async () => {
    const accessToken = localStorage.getItem("access_token");
    console.log("Access token in localStorage:", accessToken);
    if (!accessToken) {
      console.log("Access token not found in localStorage.");
      return;
    }

    try {
      const response = await fetch("/api/hasListened", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ access_token: accessToken }),
      });

      if (!response.ok) {
        console.error(
          "Error fetching recent listenings:",
          await response.json()
        );
        return;
      }

      const data = await response.json();
      console.log("Recent 50 listenings:", data);
    } catch (error) {
      console.error("Error in handleGet50Recent:", error);
    }
  };

  return (
    <div>
      <h1>Welcome to Spotify App!</h1>
      
      <Suspense fallback={<div>Loading...</div>}>
        <SearchParamsHandler />
      </Suspense>
      
      <button onClick={handleGet50Recent}>
        Click to Get Your 50 Most Recent Listenings
      </button>
    </div>
  );
}
