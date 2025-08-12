"use client";

import { Button } from "@/components/ui/button";

const PublicationsButton = () => {
  return (
    <Button variant="outline" className="w-35">
      <a href="/publications" aria-label="Open publications page">
        Publications
      </a>
    </Button>
  );
};

export default PublicationsButton;
