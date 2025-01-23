"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, Suspense, useState } from "react";

function SearchParamsHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const access_token = searchParams.get("access_token");

    if (access_token) {
      localStorage.setItem("access_token", access_token);
    }
  }, [searchParams]);

  return null;
}

export default function LoggedIn() {
  const [data, setData] = useState([]);

  const handleGet50Recent = async () => {
    const accessToken = localStorage.getItem("access_token");

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
      setData(data.items);
    } catch (error) {
      console.error("Error in handleGet50Recent:", error);
    }
  };

  return (
    <div >
      {data.length == 0 && (
        <div className="-mt-[200px] space-y-[16px] flex flex-col justify-center items-center h-screen">
          <h1>whatsup dwag</h1>

          <Suspense fallback={<div>Loading...</div>}>
            <SearchParamsHandler />
          </Suspense>

          <Button onClick={handleGet50Recent}>
            get your 20 sucked songs (but no only 20 mf)
          </Button>
          <p>no track found dude</p>
        </div>
      )}

      <div className="ml-[30px] mt-[70px]">
        {/* Render the data */}
        {data.length > 0 ? (
          data.map((item: any, index: any) => (
            // <div
            //   key={index}
            //   className="p-4 bg-white shadow-md rounded-lg flex items-center space-x-4"
            // >
            //   <p>{index}</p>
            //   <img
            //     src={item.track.album.images[0]?.url || "/placeholder.jpg"}
            //     alt={item.track.name}
            //     className="w-16 h-16 object-cover rounded"
            //   />
            //   <div>
            //     <p className="font-semibold text-lg">{item.track.name}</p>
            //     <p className="text-gray-500">{item.track.artists[0].name}</p>
            //   </div>
            // </div>
            <div key={index}>
              <p>
                {index + 1}. {item.track.name}
              </p>
            </div>
          ))
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
