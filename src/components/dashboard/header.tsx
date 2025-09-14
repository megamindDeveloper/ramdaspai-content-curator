"use client";

import { Button } from "@/components/ui/button";
import { Plus, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth-context";

type HeaderProps = {
  onAddClick: () => void;
};

export function Header({ onAddClick }: HeaderProps) {
  const { signOut } = useAuth();
  return (
    <header className="flex items-center justify-between p-4 sm:p-6 border-b bg-card">
      <h1 className="text-2xl font-bold tracking-tight">Content Curator</h1>
      <div className="flex items-center gap-4">
        <Button onClick={onAddClick} className="bg-primary hover:bg-primary/90 text-primary-foreground">
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
