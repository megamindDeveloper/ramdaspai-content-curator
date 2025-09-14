"use client";

import { Button } from "@/components/ui/button";
import { Plus, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth-context";
import Image from "next/image";

type HeaderProps = {
  onAddClick: () => void;
};

export function Header({ onAddClick }: HeaderProps) {
  const { signOut } = useAuth();

  return (
    <header className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 border-b bg-card">
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="relative w-52 h-20">
          <Image
            src="/image.png" // replace with your logo path
            alt="MAHE Logo"
            fill
            className="object-contain"
          />
        </div>

        {/* Title + Subtitle */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">MAHE Content Management Portal
          </h1>
          <p className="text-sm text-muted-foreground">
            Dashboard — Dr. Ramdas Pai
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-4 mt-4 sm:mt-0">
        <Button
          onClick={onAddClick}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Content
        </Button>

        <Button onClick={signOut} variant="outline">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </header>
  );
}
