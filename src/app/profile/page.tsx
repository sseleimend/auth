"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = useState(null);

  const onLogout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logout successfully");
      router.push("/login");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  const getUserDetails = async () => {
    const res = await axios.get("/api/users/me");
    setData(res.data.data._id);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Toaster />
      <h1>Profile</h1>
      <h2>{data && <Link href={`/profile/${data}`}>{data}</Link>}</h2>
      <hr />
      <button
        className="bg-blue-500  mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={onLogout}
      >
        Logout
      </button>
      <button
        className="bg-green-500  mt-4 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        onClick={getUserDetails}
      >
        Get details
      </button>
    </div>
  );
}
