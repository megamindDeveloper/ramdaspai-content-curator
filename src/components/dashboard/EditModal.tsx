"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ContentItem } from "@/lib/types";
import Image from "next/image";

// Friendly labels and field order
const fieldOrderMap: Record<string, string[]> = {
  Reels: ["name", "designation", "reelsUrl", "thumbnailUrl"],
  Screenshots: [ "screenshotUrl"],
  Greetings: ["name", "position", "coverImageUrl", "greetingsImageUrl"],
};

const fieldLabelMap: Record<string, string> = {
  name: "Name",
  designation: "Designation",
  reelsUrl: "Video URL",
  thumbnailUrl: "Cover Image",
  screenshotUrl: "Image",
  description: "Description",
  position: "Position",
  coverImageUrl: "Cover Image",
  greetingsImageUrl: "Greeting Image",
};

// Fallback formatter
const formatLabel = (key: string) => fieldLabelMap[key] || key
  .replace(/([A-Z])/g, " $1")
  .replace(/_/g, " ")
  .toLowerCase()
  .replace(/\b\w/g, (c) => c.toUpperCase());

type EditModalProps = {
  item: ContentItem | null;
  onSave: (id: string, data: Record<string, any>) => void;
  onClose: () => void;
};

export function EditModal({ item, onSave, onClose }: EditModalProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData(item.data || {});
      setPreviews({});
    }
  }, [item]);

  if (!item) return null;

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));

    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreviews((prev) => ({ ...prev, [key]: url }));
    }
  };

  const handleSave = async () => {
    try {
      setUploading(true);
      const updatedData: Record<string, any> = { ...formData };

      for (const [key, value] of Object.entries(formData)) {
        if (value instanceof File) {
          const storageRef = ref(storage, `${item.type}/${Date.now()}-${value.name}`);
          await uploadBytes(storageRef, value);
          const downloadURL = await getDownloadURL(storageRef);
          updatedData[key] = downloadURL;
        }
      }

      onSave(item.id, updatedData);
      onClose();
    } catch (err) {
      console.error("Error updating:", err);
    } finally {
      setUploading(false);
    }
  };

  // Use defined order for this content type, fallback to object keys
  const fieldsToRender = (fieldOrderMap[item.type] || Object.keys(formData))
    .filter((key) => key !== "createdAt" && key !== "updatedAt");

  return (
    <Dialog open={!!item} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {item.type}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {fieldsToRender.map((key) => {
            const value = formData[key];
            const isImageField =
              key.toLowerCase().includes("image") ||
              key.toLowerCase().includes("thumbnail") ||
              key.toLowerCase().includes("screenshot");

            return (
              <div key={key}>
                <label className="block text-sm font-medium mb-1">{formatLabel(key)}</label>

                {/* Show current image OR preview */}
                {isImageField && (
                  <div className="mb-2">
                    <Image
                      src={previews[key] || (typeof value === "string" ? value : "")}
                      alt={key}
                      width={120}
                      height={120}
                      className="rounded border object-cover"
                    />
                  </div>
                )}

                {isImageField ? (
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleChange(key, e.target.files?.[0] || value)}
                  />
                ) : (
                  <Input
                    type="text"
                    value={typeof value === "string" ? value : ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                  />
                )}
              </div>
            );
          })}
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} disabled={uploading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={uploading}>
            {uploading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
