import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gem, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Toaster, toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
interface TipModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  creatorId: string;
  creatorName: string;
}
export function TipModal({ isOpen, onOpenChange, creatorId, creatorName }: TipModalProps) {
  const { data: tokenData } = useQuery<{ balance: number }>({
    queryKey: ['tokens'],
    queryFn: () => api('/api/tokens'),
    enabled: isOpen,
  });
  const tipSchema = z.object({
    amount: z.coerce.number().positive("Amount must be positive").max(tokenData?.balance ?? 0, "Insufficient balance"),
  });
  const form = useForm<z.infer<typeof tipSchema>>({
    resolver: zodResolver(tipSchema),
    defaultValues: { amount: 100 },
  });
  const queryClient = useQueryClient();
  const tipMutation = useMutation({
    mutationFn: (data: { amount: number; creatorId: string }) => api('/api/tokens/tip', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: (_, variables) => {
      toast.success(`Successfully tipped ${variables.amount} tokens to ${creatorName}!`);
      queryClient.invalidateQueries({ queryKey: ['tokens'] });
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(`Tipping failed: ${error.message}`);
    }
  });
  const onSubmit = (data: z.infer<typeof tipSchema>) => {
    tipMutation.mutate({ amount: data.amount, creatorId });
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send a Tip to {creatorName}</DialogTitle>
          <DialogDescription>
            Show your appreciation! Your current balance is <span className="font-bold text-primary">{tokenData?.balance ?? 0}</span> tokens.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type="number" placeholder="100" {...field} className="pl-8" />
                      <Gem className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" className="btn-gradient" disabled={tipMutation.isPending}>
                {tipMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Tip
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
      <Toaster richColors />
    </Dialog>
  );
}