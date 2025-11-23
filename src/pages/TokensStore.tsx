import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MOCK_USER_TOKENS, MOCK_TOKEN_TRANSACTIONS } from "@shared/mock-data";
import { Gem, PlusCircle } from "lucide-react";
import { useState } from "react";
import { TokenPurchaseModal } from "@/components/modals/TokenPurchaseModal";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
export function TokensStore() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [balance, setBalance] = useState(MOCK_USER_TOKENS.balance);
  const handlePurchaseSuccess = (amount: number) => {
    setBalance(prev => prev + amount);
  };
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
                {MOCK_TOKEN_TRANSACTIONS.map(tx => (
                  <TableRow key={tx.id}>
                    <TableCell>{format(tx.ts, "MMM d, yyyy")}</TableCell>
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