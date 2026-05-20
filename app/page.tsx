"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { DataTable } from "@/components/DataTable";
import { dummyRecords, TableData } from "@/utils/dummydata";

export default function Home() {
  const [data, setData] = useState<TableData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setData(dummyRecords);
        setError(null);
      } catch (err) {
        setError("Failed to fetch data.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="p-4 md:p-8">
        <DataTable initialData={data} setData={setData} isLoading={isLoading} error={error} />
      </div>
    </main>
  );
}