"use client";

import { Button } from "@/components/ui/button";

const ResumeButton = () => {
  return (
    <Button
      onClick={() => {
        window.open("/resume.pdf");
      }}
    >
      Resume
    </Button>
  );
};

export default ResumeButton;
