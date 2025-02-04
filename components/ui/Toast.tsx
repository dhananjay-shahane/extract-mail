// components/ui/toast.tsx

import React from "react";

export const Toaster = () => {
  return (
    <div className="fixed top-4 right-4 z-50">
      {/* Toast container will go here */}
    </div>
  );
};

// Export custom toast functions for success and error messages
export const toast = {
  success: (message: string) => {
    // Create a toast element for success
    const toastElement = document.createElement("div");
    toastElement.className =
      "bg-green-500 text-white p-4 mb-4 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform";
    toastElement.innerText = message;

    // Append the toast message to the toast container
    const toastContainer = document.querySelector(".fixed.top-4.right-4");
    toastContainer?.appendChild(toastElement);

    // Remove the toast after 4 seconds
    setTimeout(() => {
      toastElement.remove();
    }, 4000);
  },

  error: (message: string) => {
    // Create a toast element for error
    const toastElement = document.createElement("div");
    toastElement.className =
      "bg-red-500 text-white p-4 mb-4 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform";
    toastElement.innerText = message;

    // Append the toast message to the toast container
    const toastContainer = document.querySelector(".fixed.top-4.right-4");
    toastContainer?.appendChild(toastElement);

    // Remove the toast after 4 seconds
    setTimeout(() => {
      toastElement.remove();
    }, 4000);
  },
};
