"use client";

import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);

  const verifyUserEmail = useCallback(async () => {
    try {
      await axios.post("/api/users/verifyemail", {
        token: searchParams.get("token"),
      });
      setVerified(true);
    } catch (error) {
      setError(true);
      if (axios.isAxiosError(error) && error.response) {
        console.log(error.response.data);
      } else {
        console.log(error);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      verifyUserEmail();
    }
  }, [searchParams, verifyUserEmail]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl">Verify Email</h1>
      <h2 className="p-2 bg-orange-500 text-black">
        {searchParams.get("token") ?? "no token"}
      </h2>
      {verified && <Link href="/login">Login</Link>}
      {error && <h2 className="text-2xl bg-red-500 text-black">Error</h2>}
    </div>
  );
}
