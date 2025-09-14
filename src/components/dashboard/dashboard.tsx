"use client";

import { useState } from "react";
import type { ContentItem, ContentType } from "@/lib/types";
import { Header } from "./header";
import { ContentGrid } from "./content-grid";
import { AddContentModal } from "./add-content-modal";
import { ContentList } from "./content-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const contentCategories: ContentType[] = ["Reels", "Screenshots", "Greetings"];

export default function Dashboard() {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddContent = (type: ContentType, data: Record<string, any>) => {
    const newItem: ContentItem = {
      id: crypto.randomUUID(),
      type,
      data,
      createdAt: new Date(),
    };
    setContentItems((prevItems) => [newItem, ...prevItems]);
    setIsModalOpen(false);
  };

  const contentByType = {
    Reels: contentItems.filter((item) => item.type === "Reels"),
    Screenshots: contentItems.filter((item) => item.type === "Screenshots"),
    Greetings: contentItems.filter((item) => item.type === "Greetings"),
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header onAddClick={() => setIsModalOpen(true)} />
      <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-6">
        <ContentGrid content={contentByType} />
        
        <Tabs defaultValue={contentCategories[0]} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Recent Submissions</h2>
            <TabsList>
              {contentCategories.map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          {contentCategories.map((category) => (
            <TabsContent key={category} value={category}>
              <ContentList items={contentByType[category]} />
            </TabsContent>
          ))}
        </Tabs>

      </main>
      <AddContentModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onContentAdd={handleAddContent}
      />
    </div>
  );
}
