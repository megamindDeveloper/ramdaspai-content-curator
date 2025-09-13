import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type HeaderProps = {
  onAddClick: () => void;
};

export function Header({ onAddClick }: HeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 sm:p-6 border-b bg-card">
      <h1 className="text-2xl font-bold tracking-tight">Content Curator</h1>
      <Button onClick={onAddClick} className="bg-primary hover:bg-primary/90 text-primary-foreground">
        <Plus className="w-4 h-4 mr-2" />
        Add Content
      </Button>
    </header>
  );
}
