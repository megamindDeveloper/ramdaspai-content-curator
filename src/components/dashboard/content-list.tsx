"use client";

import { useState } from "react";
import { ContentItem, ContentType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type ContentListProps = {
  items: ContentItem[];
  onEdit?: (item: ContentItem) => void;
  onDelete?: (id: string) => void;
};

const ITEMS_PER_PAGE = 6;

// Render values: truncate long strings
function renderValue(value: any) {
  if (typeof value === "string") {
    if (value.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
      return <img src={value} alt="preview" className="h-12 w-12 object-cover rounded" />;
    }
    if (value.length > 50) return value.substring(0, 47) + "...";
    return value;
  }

  if (value instanceof FileList) {
    return Array.from(value).map((file) => file.name).join(", ");
  }

  return JSON.stringify(value);
}

// Map field order per content type
const fieldOrderMap: Record<ContentType, string[]> = {
  Reels: ["name", "designation", "reelsUrl", "thumbnailUrl"],
  Screenshots: ["screenshotUrl"],
  Greetings: ["name", "position", "coverImageUrl", "greetingsImageUrl"],
};

// Friendly column labels
const fieldLabelMap: Record<string, string> = {
  name: "Name",
  designation: "Designation",
  reelsUrl: "Video URL",
  thumbnailUrl: "Cover Image",
  screenshotUrl: "Screenshot",
  description: "Description",
  position: "Position",
  coverImageUrl: "Cover Image",
  greetingsImageUrl: "Greeting Image",
};

// Fields that are images (to render <img>)
const imageFields = ["thumbnailUrl", "coverImageUrl", "screenshotUrl", "greetingsImageUrl"];

export function ContentList({ items, onEdit, onDelete }: ContentListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = items.slice(startIndex, endIndex);

  const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  if (items.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-12">
        <h3 className="text-lg font-semibold">No content in this category yet</h3>
        <p>Click "Add Content" to get started.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              {currentItems[0] &&
                (fieldOrderMap[currentItems[0].type] || Object.keys(currentItems[0].data)).map((field) => (
                  <TableHead key={field}>{fieldLabelMap[field] || field}</TableHead>
                ))}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="capitalize">{item.type}</TableCell>

                {(fieldOrderMap[item.type] || Object.keys(item.data)).map((field) => {
                  const value = item.data[field];
                  return (
                    <TableCell key={field}>
                      {value
                        ? imageFields.includes(field)
                          ? <img src={value} alt={fieldLabelMap[field]} className="h-12 w-12 object-cover rounded" />
                          : renderValue(value)
                        : "-"}
                    </TableCell>
                  );
                })}

                <TableCell className="text-right space-x-2">
                  <Button size="sm" variant="outline" onClick={() => onEdit?.(item)}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => onDelete?.(item.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => { e.preventDefault(); handlePreviousPage(); }}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
              />
            </PaginationItem>
            <PaginationItem>
              <span className="px-4 text-sm font-medium">
                Page {currentPage} of {totalPages}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => { e.preventDefault(); handleNextPage(); }}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}
