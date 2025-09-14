"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ContentType } from "@/lib/types";
import { DynamicForm } from "./dynamic-form";

type AddContentModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onContentAdd: (type: ContentType, data: Record<string, any>) => void;
};

// Map raw types to professional display names
const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  Reels: "Social Media Reels",
  Screenshots: "Screenshots / Covers",
  Greetings: "Greetings / Messages",
};

const contentTypes: ContentType[] = ["Reels", "Screenshots", "Greetings"];

export function AddContentModal({ isOpen, onOpenChange, onContentAdd }: AddContentModalProps) {
  const [selectedType, setSelectedType] = useState<ContentType | null>(null);

  const handleOpenChange = (open: boolean) => {
    if (!open) setSelectedType(null);
    onOpenChange(open);
  };

  const handleFormSubmit = (data: Record<string, any>) => {
    if (selectedType) onContentAdd(selectedType, data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Content</DialogTitle>
          <DialogDescription>
            Select a content type and fill in the details to add it to your collection.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Select onValueChange={(value: ContentType) => setSelectedType(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a content type..." />
            </SelectTrigger>
            <SelectContent>
              {contentTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {CONTENT_TYPE_LABELS[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedType && (
            <DynamicForm
              type={selectedType}
              onFormSubmit={handleFormSubmit}
              key={selectedType}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
