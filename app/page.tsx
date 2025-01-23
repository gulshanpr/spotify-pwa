"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/api/login");
  };
  return (
    <div className="-mt-[200px] space-y-[16px] flex flex-col justify-center items-center h-screen">
      <h1>hey login first</h1>
      <Button onClick={handleLogin}>click me shawty</Button>
    </div>
  );
}
