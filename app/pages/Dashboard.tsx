"use client";

import { useState } from "react";
import { Toaster, toast } from "@/components/ui/Toast";

interface ContactEntry {
  email?: string;
  source: string;
}

export default function Dashboard() {
  const [url, setUrl] = useState<string>("");
  const [contactList, setContactList] = useState<ContactEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    // Validate URL input
    if (!url.trim()) {
      setError("Please enter a valid URL");
      return;
    }

    // Check if the URL has already been processed
    const existingEntry = contactList.find((entry) => entry.source === url);
    if (existingEntry) {
      toast.error("This URL has already been processed.");
      return;
    }

    // Start loading and clear any previous errors
    setLoading(true);
    setError(null);

    try {
      // Fetch data from the API
      const response = await fetch(
        `/api/scrape?url=${encodeURIComponent(url)}`
      );
      const data = await response.json();

      // Handle API errors
      if (data.error) {
        throw new Error(data.error);
      }

      // Check if emails are present in the response
      if (data.emails && data.emails.length > 0) {
        // Create unique email entries
        const newEntries: ContactEntry[] = [
          ...new Set([
            ...data.emails.map((email: string) =>
              JSON.stringify({ email, source: url })
            ),
          ]),
        ].map((item) => JSON.parse(item));

        // Update the contact list and show success message
        setContactList((prev) => [...prev, ...newEntries]);
        toast.success("Email details extracted successfully!");
        setUrl(""); // Clear the URL input
      } else {
        toast.error("No emails found!");
      }
    } catch (err: unknown) {
      // Handle errors
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to fetch contact details");
      }
    } finally {
      // Stop loading regardless of success or failure
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${text} copied!`);
  };

  const handleCopyAll = () => {
    const allEmails = contactList.map((entry) => entry.email).join(", ");
    navigator.clipboard.writeText(allEmails);
    toast.success("All emails copied!");
  };

  const handleSendBulkMail = () => {
    toast.error("Bulk mail sending functionality is not implemented yet.");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 p-4 md:p-8 w-full">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Input Section */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="flex-1 py-3 px-4 rounded-lg border border-gray-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 ease-out hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : null}
              {loading ? "Processing..." : "Extract Emails"}
            </button>
          </div>
          {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        </div>

        {/* Results Section */}
        {contactList.length > 0 && (
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-neutral-600 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Extracted Emails ({contactList.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleSendBulkMail}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  Bulk Email
                </button>
                <button
                  onClick={handleCopyAll}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  Copy All
                </button>
              </div>
            </div>

            {/* Scrollable Table */}
            <div className="overflow-auto max-h-[calc(90vh-200px)]">
              <table className="w-full divide-y divide-gray-200 dark:divide-neutral-600">
                <thead className="bg-gray-50 dark:bg-neutral-700 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                      Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Email Address
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-neutral-600">
                  {contactList.map((entry, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 hidden md:table-cell">
                        <a
                          href={entry.source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline truncate max-w-[200px] inline-block"
                        >
                          {entry.source}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 font-medium">
                        {entry.email || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button
                          onClick={() => entry.email && handleCopy(entry.email)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors px-3 py-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                          Copy
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <Toaster />
      </div>
    </div>
  );
}
