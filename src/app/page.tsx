import Image from "next/image";

import { Button } from "@/components/ui/button";
import { SVGIcon } from "@/components/ui/icon";
import { D3Icon, DruidIcon, TrinoIcon } from "@/data/svgIcons";
export default function Home(): React.ReactElement {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="container mx-auto px-6 py-16 lg:px-8">
        <main className="flex flex-col items-center text-center space-y-12 max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Welcome to Your
              <span className="text-primary block mt-2">Personal Website</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl leading-relaxed">
              Built with Next.js, TypeScript, and a modern design system. Ready
              to showcase your professional journey with style.
            </p>
          </div>

          {/* Logo */}
          <Image
            className="opacity-80 invert"
            src="/next.svg"
            alt="Next.js logo"
            width={200}
            height={45}
            priority
          />

          {/* Getting Started Section */}
          <div className="bg-card text-card-foreground rounded-lg p-8 w-full max-w-2xl border border-border">
            <h2 className="text-2xl font-semibold mb-6 text-primary">
              Getting Started
            </h2>
            <div className="space-y-4 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium mt-1">
                  1
                </div>
                <p className="text-muted-foreground">
                  Get started by editing{" "}
                  <code className="bg-muted px-2 py-1 rounded text-sm font-mono text-foreground">
                    src/app/page.tsx
                  </code>
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-sm font-medium mt-1">
                  2
                </div>
                <p className="text-muted-foreground">
                  Save and see your changes instantly with hot reload.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center items-center">
            <Button variant="secondary">Deploy now</Button>
            <Button>Primary</Button>
            <Button variant="outline">Secondary</Button>
          </div>
          {/* Icons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md items-center justify-center">
            <SVGIcon
              size="large"
              className="text-[#16838d]"
              border
              image={DruidIcon}
            />
            <SVGIcon size="medium" className="text-[#6d3be3]" image={D3Icon} />
            <SVGIcon
              size="small"
              border
              image={TrinoIcon}
              className="text-[#4ab4dc]"
            />
          </div>
          {/* Footer Links */}
          <div className="flex flex-wrap justify-center gap-8 pt-8 border-t border-border w-full max-w-2xl">
            <a
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/file.svg"
                alt="File icon"
                width={16}
                height={16}
                className="opacity-70"
              />
              Learn
            </a>
            <a
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/window.svg"
                alt="Window icon"
                width={16}
                height={16}
                className="opacity-70"
              />
              Examples
            </a>
            <a
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/globe.svg"
                alt="Globe icon"
                width={16}
                height={16}
                className="opacity-70"
              />
              Go to nextjs.org →
            </a>
          </div>
        </main>
      </div>
    </div>
  );
}
