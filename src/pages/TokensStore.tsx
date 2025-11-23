import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MOCK_CREATOR } from "@shared/mock-data";
import { Gem, PlusCircle, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { TokenPurchaseModal } from "@/components/modals/TokenPurchaseModal";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { TokenTransaction } from "@shared/types";
import { Skeleton } from "@/components/ui/skeleton";
interface TokensData {
  balance: number;
  transactions: TokenTransaction[];
}
export function TokensStore() {
  const [isModalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery<TokensData>({
    queryKey: ['tokens'],
    queryFn: () => api('/api/tokens'),
  });
  const handlePurchaseSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['tokens'] });
  };
  if (isLoading) {
    return <TokensStoreSkeleton />;
  }
  if (error) {
    return (
      <AppLayout container>
        <div className="flex flex-col items-center justify-center h-96 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <AlertTriangle className="w-12 h-12 text-red-500" />
          <h2 className="mt-4 text-xl font-semibold">Failed to load token data</h2>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      </AppLayout>
    );
  }
  const { balance, transactions } = data!;
  return (
    <AppLayout container>
      <div className="space-y-8 md:space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-display">My Tokens</h1>
            <p className="text-muted-foreground">Purchase and manage your virtual currency.</p>
          </div>
          <Button className="btn-gradient" onClick={() => setModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Buy More Tokens
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Current Balance</span>
              <div className="flex items-center gap-2 text-3xl font-bold text-primary">
                <Gem className="w-6 h-6" />
                <span>{balance.toLocaleString()}</span>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>{format(new Date(tx.ts), "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      <div className="font-medium">{tx.reason}</div>
                      {tx.creatorId && <div className="text-sm text-muted-foreground">To: {MOCK_CREATOR.name}</div>}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={tx.amount > 0 ? "default" : "destructive"} className={tx.amount > 0 ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"}>
                        {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <TokenPurchaseModal isOpen={isModalOpen} onOpenChange={setModalOpen} onPurchaseSuccess={handlePurchaseSuccess} />
    </AppLayout>
  );
}
function TokensStoreSkeleton() {
  return (
    <AppLayout container>
      <div className="space-y-8 md:space-y-12">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-8 w-24" />
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}