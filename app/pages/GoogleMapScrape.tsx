"use client";

import { useState, FormEvent } from "react";
import { FaEnvelope, FaPhone } from "react-icons/fa";

interface ScrapeResult {
  title?: string;
  link?: string;
  address?: string;
  website?: string;
}

export default function Home() {
  const [query, setQuery] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [results, setResults] = useState<ScrapeResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/getlinks/scrap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, location }),
      });

      const data = await response.json();
      console.log(data);

      setResults(data.results || []);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  // Function to copy the website link to clipboard
  const copyToClipboard = (link: string) => {
    navigator.clipboard.writeText(link).then(() => {
      alert("Link copied to clipboard!");
    });
  };

  return (
    <div className="flex flex-1 overflow-auto dark:bg-neutral-900">
      <div className="p-2 md:p-10 rounded-tl-2xl w-full h-full">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-neutral-700 p-6 rounded-lg shadow-md flex flex-wrap gap-4"
        >
          <div className="flex-1 min-w-[200px] items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full p-2 border rounded dark:bg-neutral-600 dark:text-white dark:border-neutral-500"
              placeholder="e.g., Coffee shops"
              required
            />
          </div>

          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2 border rounded dark:bg-neutral-600 dark:text-white dark:border-neutral-500"
              placeholder="e.g., New York"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 w-full md:w-auto rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? "Scraping..." : "Scrape Links"}
          </button>
        </form>

        {results.length > 0 && (
          <div className="mt-8 overflow-x-auto">
            <div className="max-h-96 overflow-auto">
              <table className="w-full border-collapse border border-neutral-300 dark:border-neutral-600">
                <thead>
                  <tr className="bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100">
                    <th className="px-4 py-2 text-left font-semibold">
                      Sr No.
                    </th>
                    <th className="px-4 py-2 text-left font-semibold hidden md:table-cell">
                      Name
                    </th>
                    <th className="px-4 py-2 text-left font-semibold">
                      Address
                    </th>
                    <th className="px-4 py-2 text-center font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr
                      key={index}
                      className="bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      <td className="border border-neutral-300 dark:border-neutral-600 px-4 py-2 text-neutral-900 dark:text-neutral-100">
                        {index + 1}
                      </td>
                      <td className="border border-neutral-300 dark:border-neutral-600 px-4 py-2 text-neutral-500 dark:text-neutral-400 hidden md:table-cell">
                        {result.title || "-"}
                      </td>
                      <td className="border border-neutral-300 dark:border-neutral-600 px-4 py-2 text-neutral-900 dark:text-neutral-100">
                        {result.address || "-"}
                      </td>
                      <td className="border border-neutral-300 dark:border-neutral-600 px-4 py-2 text-center">
                        {result.website && (
                          <button
                            onClick={() => copyToClipboard(`${result.website}`)}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600"
                          >
                            {result.website ? <FaEnvelope /> : <FaPhone />}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
