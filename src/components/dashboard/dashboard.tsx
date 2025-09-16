"use client";

import { useState, useEffect } from "react";
import { Header } from "./header";
import { ContentGrid } from "./content-grid";
import { AddContentModal } from "./add-content-modal";
import { ContentList } from "./content-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { ContentItem, ContentType } from "@/lib/types";
import { deleteContent, saveContentToFirebase, updateContent, } from "@/lib/firebase-functions";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { EditModal } from "./EditModal";

const contentCategories: ContentType[] = ["Reels", "Screenshots", "Greetings"];

const categoryDisplayNames: Record<ContentType, string> = {
  Reels: "Social Media Reels",
  Screenshots: "Social Media Screenshots",
  Greetings: "Professional Greetings",
};
export default function Dashboard() {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);

  // 🔥 Fetch data from Firestore (live updates)
  useEffect(() => {
    // store all unsubscribe functions
    const unsubscribers = contentCategories.map((type) => {
      const colRef = collection(db, type);
      const q = query(colRef, orderBy("order", "asc")); // Firestore sorts within this type

      return onSnapshot(q, (snapshot) => {
        const items: ContentItem[] = snapshot.docs.map((doc) => {
          const docData = doc.data();
          const orderValue = docData.order ?? 0; // fallback to 0 if missing
          return {
            id: doc.id,
            type,
            data: docData.data || docData,
            createdAt: docData.createdAt?.toDate
              ? docData.createdAt.toDate()
              : new Date(docData.createdAt || Date.now()),
            order: orderValue,
          };
        });

        // Move invalid/zero orders to the end
        const sortedItems = [
          ...items.filter((item) => item.order && item.order > 0),
          ...items.filter((item) => !item.order || item.order <= 0),
        ];

        // ✅ merge with other types and sort globally
        setContentItems((prev) => {
          // keep only items from other collections
          const otherTypes = prev.filter((item) => item.type !== type);
          const merged = [...otherTypes, ...sortedItems];

          // 🔑 global sort across all types
          return merged.sort(
            (a, b) => (a.order ?? Infinity) - (b.order ?? Infinity)
          );
        });
      });
    });

    // cleanup on unmount
    return () => unsubscribers.forEach((unsub) => unsub());
  }, []);

  // 🔥 Add new content
  const handleAddContent = async (type: ContentType, data: Record<string, any>) => {
    await saveContentToFirebase(type, data);
    setIsModalOpen(false);
  };

  // 🔥 Save edited content
  const handleSave = async (id: string, data: Record<string, any>) => {
    if (!editingItem) return;
    await updateContent(editingItem.type, id, data);
    setEditingItem(null);
  };

  // 🔥 Delete content
  const handleDelete = async (id: string, type: string) => {
    if (!confirm("Are you sure you want to delete this?")) return;
    await deleteContent(type, id);
  };

  // Group items by type
  const contentByType = {
    Reels: contentItems.filter((item) => item.type === "Reels"),
    Screenshots: contentItems.filter((item) => item.type === "Screenshots"),
    Greetings: contentItems.filter((item) => item.type === "Greetings"),
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header onAddClick={() => setIsModalOpen(true)} />

      <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-6">
        {/* Top stats grid */}
        <ContentGrid content={contentByType} />

        {/* Tabs with recent submissions */}
        <Tabs defaultValue={contentCategories[0]} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Recent Submissions</h2>
            <TabsList>
              {contentCategories.map((category) => (
                <TabsTrigger key={category} value={category}>
                 {categoryDisplayNames[category]}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {contentCategories.map((category) => (
            <TabsContent key={category} value={category}>
              <ContentList
                items={contentByType[category]}
                onEdit={(item) => setEditingItem(item)}
                onDelete={(id) => handleDelete(id, category)}
              />
            </TabsContent>
          ))}
        </Tabs>
      </main>

      {/* Edit Modal */}
      <EditModal
        item={editingItem}
        onSave={handleSave}
        onClose={() => setEditingItem(null)}
      />

      {/* Add Modal */}
      <AddContentModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onContentAdd={handleAddContent}
      />
    </div>
  );
}
