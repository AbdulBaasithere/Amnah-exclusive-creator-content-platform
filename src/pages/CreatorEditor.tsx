import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { MOCK_TIERS } from "@shared/mock-data";
import { Toaster, toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, UploadCloud, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { ContentItem } from "@shared/types";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
const contentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  type: z.enum(["video", "download", "post"]),
  tierId: z.string().min(1, "Please select a tier"),
  publishDate: z.date().optional(),
});
type ContentFormData = z.infer<typeof contentSchema>;
interface CreatorEditorProps {
  onSave?: () => void;
}
export function CreatorEditor({ onSave }: CreatorEditorProps) {
  const { contentId } = useParams<{ contentId?: string }>();
  const isEditMode = !!contentId;
  const queryClient = useQueryClient();
  const { data: existingContent, isLoading: isLoadingContent } = useQuery<ContentItem>({
    queryKey: ['content', contentId],
    queryFn: () => api(`/api/content/${contentId}`),
    enabled: isEditMode,
  });
  const form = useForm<ContentFormData>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "post",
      tierId: "",
    },
  });
  useEffect(() => {
    if (existingContent) {
      form.reset({
        title: existingContent.title,
        description: existingContent.description,
        type: existingContent.type,
        tierId: existingContent.tierId,
        publishDate: existingContent.publishedAt ? new Date(existingContent.publishedAt) : undefined,
      });
    }
  }, [existingContent, form]);
  const saveContentMutation = useMutation({
    mutationFn: (newContent: Omit<ContentItem, 'id' | 'creatorId' | 'status' | 'attachments'>) => {
      const endpoint = isEditMode ? `/api/content/${contentId}` : '/api/content';
      const method = isEditMode ? 'PUT' : 'POST';
      return api<ContentItem>(endpoint, {
        method,
        body: JSON.stringify(newContent),
      });
    },
    onSuccess: () => {
      toast.success(`Content ${isEditMode ? 'updated' : 'saved'} successfully!`);
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['content', contentId] });
      if (!isEditMode) form.reset();
      if (onSave) onSave();
    },
    onError: (error) => {
      toast.error(`Failed to save content: ${error.message}`);
    }
  });
  const onSubmit = (data: ContentFormData) => {
    const submissionData = {
      ...data,
      description: data.description || '',
      publishDate: data.publishDate ? data.publishDate.toISOString() : undefined,
    };
    saveContentMutation.mutate(submissionData as any);
  };
  if (isLoadingContent) {
    return <div>Loading editor...</div>;
  }
  return (
    <div className="p-1">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="My Awesome New Video" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="A short description of your content..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select content type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="post">Text Post</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="download">Digital Download</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tierId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Required Tier</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a tier to gate content" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {MOCK_TIERS.map(tier => (
                        <SelectItem key={tier.id} value={tier.id}>{tier.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <Label>Attachments (Optional)</Label>
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-input px-6 py-10">
              <div className="text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                <div className="mt-4 flex text-sm leading-6 text-muted-foreground">
                  <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary/80">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs leading-5 text-muted-foreground">PNG, JPG, GIF, PDF up to 10MB</p>
              </div>
            </div>
          </div>
          <FormField
            control={form.control}
            name="publishDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Schedule Publish Date (Optional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" disabled={saveContentMutation.isPending}>Save as Draft</Button>
            <Button type="submit" className="btn-gradient" disabled={saveContentMutation.isPending}>
              {saveContentMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? 'Update Content' : 'Publish Now'}
            </Button>
          </div>
        </form>
      </Form>
      <Toaster richColors />
    </div>
  );
}