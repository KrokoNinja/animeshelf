"use client";

import Link from "next/link";
import SearchBar from "./SearchBar";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { Loader2 } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <h1 className="text-2xl font-bold text-black">AnimeShelf</h1>
            </Link>
            <SearchBar />
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="secondary" size="sm" asChild>
              <Link href="/discover">
                <Plus className="h-4 w-4 mr-2" />
                Add Anime
              </Link>
            </Button>

            <Unauthenticated>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">Sign In</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm">Sign Up</Button>
              </SignUpButton>
            </Unauthenticated>

            <Authenticated>
              <UserButton />
            </Authenticated>

            <AuthLoading>
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </AuthLoading>

            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}