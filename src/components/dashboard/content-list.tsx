import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ContentItem } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

type ContentListProps = {
  items: ContentItem[];
};

function renderValue(value: any) {
    if (typeof value === 'string') {
        return value;
    }
    if (value instanceof FileList) {
        return Array.from(value).map(file => file.name).join(', ');
    }
    return JSON.stringify(value);
}

export function ContentList({ items }: ContentListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-12">
        <h3 className="text-lg font-semibold">No content added yet</h3>
        <p>Click "Add Content" to get started.</p>
      </div>
    );
  }

  return (
    <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Recent Submissions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
            <Card key={item.id}>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg">{item.type}</CardTitle>
                        <CardDescription>
                            {new Date(item.createdAt).toLocaleString()}
                        </CardDescription>
                    </div>
                    <Badge variant="secondary">{item.type}</Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2 text-sm">
                {Object.entries(item.data).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-3 gap-2">
                        <span className="font-semibold capitalize text-muted-foreground">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="col-span-2 break-all">{renderValue(value)}</span>
                    </div>
                ))}
                </div>
            </CardContent>
            </Card>
        ))}
        </div>
    </div>
  );
}
