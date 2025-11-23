import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Toaster, toast } from "sonner";
interface PayoutRequestModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  balance: number;
}
export function PayoutRequestModal({ isOpen, onOpenChange, balance }: PayoutRequestModalProps) {
  const payoutSchema = z.object({
    amount: z.number().min(50, "Minimum payout is $50").max(balance, "Amount cannot exceed your balance"),
    payoutMethod: z.string().min(1, "Please select a payout method"),
  });
  const form = useForm({
    resolver: zodResolver(payoutSchema),
    defaultValues: {
      amount: Math.min(balance, 50),
      payoutMethod: "paypal",
    },
  });
  const onSubmit = (data: z.infer<typeof payoutSchema>) => {
    console.log("Payout request:", data);
    onOpenChange(false);
    toast.success("Payout request submitted!", {
      description: `Your request for $${data.amount.toFixed(2)} is being processed.`,
    });
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Payout</DialogTitle>
          <DialogDescription>
            Your current available balance is <span className="font-bold text-primary">${balance.toFixed(2)}</span>.
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
                    <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="payoutMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payout Method</FormLabel>
                  <FormControl>
                    {/* In a real app, this would be a select with user's saved methods */}
                    <Input placeholder="PayPal Email / Bank Account" value="creator@example.com" readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" className="btn-gradient">Submit Request</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
      <Toaster richColors />
    </Dialog>
  );
}