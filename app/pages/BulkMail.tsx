"use client";

import { useState } from "react";
import { Toaster, toast } from "@/components/ui/Toast";

interface ContactEntry {
  email?: string;
  source: string;
}

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg w-96">
        {children}
        <button onClick={onClose} className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg">
          Close
        </button>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [contactList, setContactList] = useState<ContactEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBulkMailPopup, setShowBulkMailPopup] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!url.trim()) {
      setError("Please enter a valid URL");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/scrape?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      if (data.error) throw new Error(data.error);

      if (data.emails?.length > 0) {
        const newEntries: ContactEntry[] = [
          ...new Set([...data.emails.map((email: string) => JSON.stringify({ email, source: url }))]),
        ].map((item) => JSON.parse(item));

        setContactList((prev) => [...prev, ...newEntries]);
        toast.success("Email details extracted successfully!");
        setUrl("");
      } else {
        toast.error("No emails found!");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch contact details");
    } finally {
      setLoading(false);
    }
  };

  const handleSendBulkMail = async () => {
    const emailList = contactList.map((entry) => entry.email).join(",");
    if (!emailList) {
      toast.error("No email addresses available.");
      return;
    }
    
    const mailtoLink = `mailto:?bcc=${encodeURIComponent(emailList)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 p-4 md:p-8 w-full">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="flex-1 py-3 px-4 rounded-lg border border-gray-200 dark:border-neutral-600"
            />
            <button onClick={handleSubmit} disabled={loading} className="py-3 px-6 bg-blue-600 text-white rounded-lg">
              {loading ? "Processing..." : "Extract Emails"}
            </button>
          </div>
          {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        </div>

        {contactList.length > 0 && (
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Extracted Emails ({contactList.length})</h3>
              <button onClick={() => setShowBulkMailPopup(true)} className="px-4 py-2 bg-emerald-600 text-white rounded-lg">
                Bulk Email
              </button>
            </div>
          </div>
        )}
      </div>
      <Toaster />

      <Modal isOpen={showBulkMailPopup} onClose={() => setShowBulkMailPopup(false)}>
        <h3 className="text-lg font-semibold">Send Bulk Email</h3>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter subject"
          className="w-full p-2 border rounded mt-2"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter message"
          className="w-full p-2 border rounded mt-2"
          rows={4}
        />
        <button onClick={handleSendBulkMail} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
          Send Mail
        </button>
      </Modal>
    </div>
  );
}