"use client";
import Image from "next/image";
import calculateTotalFees from "@/utils/calculateTotalFees";
import { useState } from "react";

export default function Hero() {
  const [pubkey, setPubkey] = useState<string>("");
  const [estimatedFees, setEstimatedFees] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSearch(e: any) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const fees = await calculateTotalFees(pubkey);
      setEstimatedFees(fees);
    } catch (error) {
      console.error("Error fetching fees:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleChange(e: any) {
    setPubkey(e.target.value);
    setEstimatedFees(null);
  }
  return (
    <main className="flex flex-col justify-center items-center min-h-screen px-4">
      <h1 className="text-3xl font-bold text-center mb-6">
        Track Your Solana Gas in the Past 24 Hours
      </h1>
      <p className="text-base text-gray-600 text-center mb-6">
        Uncover your hidden Solana gas charges. Know exactly how much you have
        spent in the past 24 hours.
      </p>
      <input
        type="text"
        placeholder="Enter your wallet address"
        className="p-2 rounded-2xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-black"
        onChange={handleChange}
      />
      <button
        className={`inline-block px-4 py-2 rounded-xl font-semibold text-white bg-indigo-500 hover:bg-indigo-600 mt-3`}
        onClick={handleSearch}
      >
        {isLoading ? "Loading..." : "Search"}
      </button>

      {estimatedFees !== null && (
        <p className="text-lg mt-3 text-center text-white font-semibold">
          Estimated total fees for the past 24 hours: {estimatedFees} SOL
        </p>
      )}

      <p className="text-sm text-center text-gray-400 mt-4 font-bold underline">
        Tool built by{" "}
        <a href="https://campsite.bio/simplysabir" target="_blank">Sabir Khan</a>
      </p>
    </main>
  );
}
