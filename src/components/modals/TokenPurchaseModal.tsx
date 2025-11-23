import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Gem, Loader2 } from "lucide-react";
import { useState } from "react";
import { Toaster, toast } from "sonner";
import { addTokenTransaction } from "@shared/mock-data";
interface TokenPurchaseModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onPurchaseSuccess?: (amount: number) => void;
}
const tokenPackages = [
  { amount: 100, price: 1.00 },
  { amount: 500, price: 4.50, popular: true },
  { amount: 1000, price: 8.00 },
  { amount: 5000, price: 35.00 },
];
export function TokenPurchaseModal({ isOpen, onOpenChange, onPurchaseSuccess }: TokenPurchaseModalProps) {
  const [selectedPackage, setSelectedPackage] = useState(tokenPackages[1]);
  const [isLoading, setIsLoading] = useState(false);
  const handlePurchase = () => {
    setIsLoading(true);
    setTimeout(() => {
      addTokenTransaction({
        userId: 'u1',
        amount: selectedPackage.amount,
        reason: 'Token Purchase',
        ts: new Date(),
      });
      onPurchaseSuccess?.(selectedPackage.amount);
      setIsLoading(false);
      onOpenChange(false);
      toast.success(`${selectedPackage.amount} tokens purchased successfully!`);
    }, 1500);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Purchase Tokens</DialogTitle>
          <DialogDescription>Select a package to top up your token balance.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          {tokenPackages.map(pkg => (
            <Card
              key={pkg.amount}
              onClick={() => setSelectedPackage(pkg)}
              className={`cursor-pointer transition-all ${selectedPackage.amount === pkg.amount ? 'ring-2 ring-primary' : 'hover:bg-accent'}`}
            >
              <CardContent className="p-4 text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-xl font-bold">
                  <Gem className="w-5 h-5 text-primary" />
                  <span>{pkg.amount.toLocaleString()}</span>
                </div>
                <p className="text-sm text-muted-foreground">${pkg.price.toFixed(2)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handlePurchase} disabled={isLoading} className="btn-gradient">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Purchase for ${selectedPackage.price.toFixed(2)}
          </Button>
        </DialogFooter>
      </DialogContent>
      <Toaster richColors />
    </Dialog>
  );
}