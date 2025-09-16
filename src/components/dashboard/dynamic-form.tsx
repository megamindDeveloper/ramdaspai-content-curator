"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ContentType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DialogFooter } from "../ui/dialog";
import { useToast } from "@/hooks/use-toast";

type DynamicFormProps = {
  type: ContentType;
  onFormSubmit: (data: Record<string, any>) => void;
};

export function DynamicForm({ type, onFormSubmit }: DynamicFormProps) {
  const { toast } = useToast();

  // Define fields based on content type
  const fields = useMemo(() => {
    if (type === "Reels") {
      return [
        { name: "name", label: "Name", type: "text" },
        { name: "designation", label: "Designation", type: "text" },
        { name: "reelsUrl", label: "Reels URL", type: "url" },
        { name: "order", label: "Order Number", type: "int" },
        { name: "thumbnail", label: "Thumbnail", type: "file", description: "Upload a thumbnail image." },
      ];
    }
    if (type === "Screenshots") {
      return [{ name: "screenshot", label: "Screenshot", type: "file", description: "Upload a single image." }];
    }
    if (type === "Greetings") {
      return [
        { name: "name", label: "Name", type: "text" },
        { name: "position", label: "Position", type: "text" },
        { name: "coverImage", label: "Cover Image", type: "file", description: "Upload a cover image." },
        { name: "greetingsImage", label: "Greetings Image", type: "file", description: "Upload a greetings image." },
      ];
    }
    return [];
  }, [type]);


  // Build Zod schema dynamically
  const formSchema = useMemo(() => {
    const shape: Record<string, z.ZodTypeAny> = {};
    fields.forEach((field) => {
      if (field.type === "url") {
        shape[field.name] = z.string().url("Please enter a valid URL").min(1, "This field is required");
      } else if (field.type === "file") {
        shape[field.name] = z.any().refine((val) => val instanceof FileList && val.length > 0, "File is required");
      } else {
        shape[field.name] = z.string().min(1, "This field is required");
      }
    });
    return z.object(shape);
  }, [fields]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const processedValues: Record<string, any> = {};

    // Convert FileList to File
    Object.entries(values).forEach(([key, value]) => {
      if (value instanceof FileList) {
        processedValues[key] = value[0];
      } else {
        processedValues[key] = value;
      }
    });

    onFormSubmit(processedValues);
    toast({
      title: "Success!",
      description: `Your ${type} content has been added.`,
    });
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {fields.map((field) => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: hookField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input
                    type={field.type}
                    placeholder={field.type !== "file" ? `Enter ${field.label}` : undefined}
                    {...(field.type === "file" ? { onChange: (e) => hookField.onChange(e.target.files) } : hookField)}
                    value={field.type === "file" ? undefined : hookField.value || ""}
                  />
                </FormControl>
                {field.description && <FormDescription>{field.description}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        {fields.length > 0 && (
          <DialogFooter>
            <Button type="submit" className="w-full sm:w-auto">
              Submit
            </Button>
          </DialogFooter>
        )}
      </form>
    </Form>
  );
}
