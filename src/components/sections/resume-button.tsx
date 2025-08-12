"use client";

import { Button } from "@/components/ui/button";

const ResumeButton = () => {
  return (
    <Button
      onClick={() => {
        window.open("/resume.pdf");
      }}
    >
    <Button asChild>
      <a
        href="/resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open resume PDF in a new tab"
      >
        Resume
      </a>
    </Button>
  );
};

export default ResumeButton;
