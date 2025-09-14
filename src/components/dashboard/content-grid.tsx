import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ContentItem } from "@/lib/types";
import { Clapperboard, Camera } from "lucide-react";

type ContentGridProps = {
  content: {
    Reels: ContentItem[];
    Screenshots: ContentItem[];
  };
};

const contentCategories = [
  {
    type: "Reels",
    title: "Reels",
    icon: Clapperboard,
  },
  {
    type: "Screenshots",
    title: "Screenshots",
    icon: Camera,
  },
] as const;

export function ContentGrid({ content }: ContentGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {contentCategories.map((category) => {
        const items = content[category.type];
        const Icon = category.icon;
        return (
          <Card key={category.type}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                {category.title}
              </CardTitle>
              <Icon className="w-5 h-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{items.length}</div>
              <p className="text-xs text-muted-foreground">
                {items.length === 1 ? "item" : "items"} curated
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
