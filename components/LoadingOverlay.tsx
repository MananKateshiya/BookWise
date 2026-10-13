"use client";

import { BookOpenText } from "lucide-react";

const LoadingOverlay = ({ message = "Synthesizing your book..." }: { message?: string }) => {
  return (
    <div className="loading-wrapper" role="status" aria-live="polite">
      <div className="loading-shadow-wrapper bg-[#fff6e5]">
        <div className="loading-shadow">
          <BookOpenText className="loading-animation h-12 w-12 text-[#663820]" />
          <p className="loading-title">{message}</p>
          <div className="loading-progress">
            <div className="loading-progress-item">
              <span className="loading-progress-status" />
              <span>Preparing your interactive interview</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
