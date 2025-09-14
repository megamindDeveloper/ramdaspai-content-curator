"use client";

import { useState } from "react";
import { ContentItem } from "@/lib/types";
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

// Format field names to human-readable form (camelCase → "Camel Case")
function formatFieldName(key: string) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
}

// Render values: images, long strings, FileLists
function renderValue(value: any) {
  if (typeof value === "string") {
    if (value.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
      return (
        <img
          src={value}
          alt="preview"
          className="h-12 w-12 object-cover rounded"
        />
      );
    }
    if (value.length > 50) return value.substring(0, 47) + "...";
    return value;
  }

  if (value instanceof FileList) {
    return Array.from(value).map((file) => file.name).join(", ");
  }

  return JSON.stringify(value);
}

export function ContentList({ items, onEdit, onDelete }: ContentListProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = items.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  if (items.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-12">
        <h3 className="text-lg font-semibold">
          No content in this category yet
        </h3>
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
              <TableHead>Details</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="capitalize">{item.type}</TableCell>

                <TableCell>
                  <div className="space-y-1 text-sm">
                    {item.data && typeof item.data === "object" ? (
                      Object.entries(item.data)
                        .filter(
                          ([key]) =>
                            key !== "createdAt" && key !== "updatedAt"
                        )
                        .map(([key, value]) => (
                          <div key={key} className="flex gap-2">
                            <span className="font-semibold text-muted-foreground">
                              {formatFieldName(key)}:
                            </span>
                            <span className="break-all">{renderValue(value)}</span>
                          </div>
                        ))
                    ) : (
                      <span className="text-muted-foreground">
                        No details available
                      </span>
                    )}
                  </div>
                </TableCell>

                <TableCell className="text-right space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit?.(item)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete?.(item.id)}
                  >
                    Delete
                  </Button>
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
                onClick={(e) => {
                  e.preventDefault();
                  handlePreviousPage();
                }}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : undefined
                }
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
                onClick={(e) => {
                  e.preventDefault();
                  handleNextPage();
                }}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : undefined
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}
