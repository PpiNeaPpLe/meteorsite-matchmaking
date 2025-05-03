import Link from "next/link";
import { DatabaseConnectionStatus } from "@/components/db-connection-status";
import { MainNav } from "@/components/main-nav";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold text-xl">MatchConnect</span>
          </Link>
          <MainNav />
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="hidden md:flex">
            <DatabaseConnectionStatus />
          </div>
          <nav className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/settings/database">
                Database
              </Link>
            </Button>
            
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
} 