"use client";

import { useState } from "react";
import type { ContentItem, ContentType } from "@/lib/types";
import { Header } from "./header";
import { ContentGrid } from "./content-grid";
import { AddContentModal } from "./add-content-modal";

export default function Dashboard() {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddContent = (type: ContentType, data: Record<string, any>) => {
    const newItem: ContentItem = {
      id: crypto.randomUUID(),
      type,
      data,
    };
    setContentItems((prevItems) => [...prevItems, newItem]);
    setIsModalOpen(false);
  };

  const contentByType = {
    YouTube: contentItems.filter((item) => item.type === "YouTube"),
    Images: contentItems.filter((item) => item.type === "Images"),
    Reels: contentItems.filter((item) => item.type === "Reels"),
    Screenshots: contentItems.filter((item) => item.type === "Screenshots"),
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header onAddClick={() => setIsModalOpen(true)} />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <ContentGrid content={contentByType} />
      </main>
      <AddContentModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onContentAdd={handleAddContent}
      />
    </div>
  );
}
