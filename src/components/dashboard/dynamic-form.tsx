"use client";

import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateInputFields } from "@/ai/flows/generate-input-fields";
import type { ContentType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { DialogFooter } from "../ui/dialog";

type DynamicFormProps = {
  type: ContentType;
  onFormSubmit: (data: Record<string, any>) => void;
};

const fieldConfig: Record<string, { label: string; type: string; placeholder?: string; description?: string }> = {
  youtubeUrl: { label: "YouTube URL", type: "url", placeholder: "https://youtube.com/watch?v=..." },
  imageUrl: { label: "Image", type: "file", description: "Upload a single image." },
  reelsUrl: { label: "Reels URL", type: "url", placeholder: "https://instagram.com/reel/..." },
  thumbnail: { label: "Thumbnail", type: "file", description: "Upload a thumbnail for the Reel." },
  screenshot1: { label: "Screenshot 1", type: "file" },
  screenshot2: { label: "Screenshot 2", type: "file" },
  screenshot3: { label: "Screenshot 3", type: "file" },
  screenshot4: { label: "Screenshot 4", type: "file" },
  screenshot5: { label: "Screenshot 5", type: "file" },
};

export function DynamicForm({ type, onFormSubmit }: DynamicFormProps) {
  const [fields, setFields] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const formSchema = useMemo(() => {
    const shape: Record<string, z.ZodTypeAny> = {};
    fields.forEach((field) => {
      if (field.includes("Url")) {
        shape[field] = z.string().url({ message: "Please enter a valid URL." }).min(1, "This field is required.");
      } else {
        const isFile = typeof window !== 'undefined' && typeof FileList !== 'undefined'
        if (isFile) {
            shape[field] = z.instanceof(FileList).refine((files) => files?.length > 0, "File is required.");
        } else {
            shape[field] = z.any();
        }
      }
    });
    return z.object(shape);
  }, [fields]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const fetchFields = async () => {
      setIsLoading(true);
      form.reset();
      try {
        const result = await generateInputFields({ contentType: type });
        setFields(result.fields);
      } catch (error) {
        console.error("Failed to generate form fields:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not generate form fields. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFields();
  }, [type, form, toast]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate submission delay
    onFormSubmit(values);
    setIsSubmitting(false);
    toast({
        title: "Success!",
        description: `Your ${type} content has been added.`,
    });
  };

  const renderField = (fieldName: string) => {
    const config = fieldConfig[fieldName];
    if (!config) return null;

    return (
      <FormField
        key={fieldName}
        control={form.control}
        name={fieldName}
        render={({ field }) => {
            const { onChange, ...rest } = field;
            return (
              <FormItem>
                <FormLabel>{config.label}</FormLabel>
                <FormControl>
                  <Input
                    type={config.type}
                    placeholder={config.placeholder}
                    {...(config.type === 'file' ? {
                        onChange: (e) => onChange(e.target.files)
                    } : { onChange, ...rest })}
                    value={config.type === 'file' ? undefined : field.value}
                  />
                </FormControl>
                {config.description && <FormDescription>{config.description}</FormDescription>}
                <FormMessage />
              </FormItem>
            );
        }}
      />
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {fields.map(renderField)}
        {fields.length > 0 && (
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        )}
      </form>
    </Form>
  );
}
