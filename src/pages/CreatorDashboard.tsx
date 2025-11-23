import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, PlusCircle, Users, FileText } from "lucide-react";
import { ContentCard } from "@/components/content/ContentCard";
import { SubscriptionTierCard } from "@/components/content/SubscriptionTierCard";
import { PayoutRequestModal } from "@/components/modals/PayoutRequestModal";
import { MOCK_CREATOR, MOCK_CONTENT_ITEMS, MOCK_TIERS, MOCK_TOP_TIPPERS } from "shared/mock-data";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CreatorEditor } from "./CreatorEditor";
import { Link } from "react-router-dom";
export function CreatorDashboard() {
  const [isPayoutModalOpen, setPayoutModalOpen] = useState(false);
  const [isEditorSheetOpen, setEditorSheetOpen] = useState(false);
  return (
    <AppLayout container>
      <div className="space-y-8 md:space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-display">Creator Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {MOCK_CREATOR.name}!</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setPayoutModalOpen(true)}>Request Payout</Button>
            <Sheet open={isEditorSheetOpen} onOpenChange={setEditorSheetOpen}>
              <SheetTrigger asChild>
                <Button className="btn-gradient">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Content
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Create New Content</SheetTitle>
                </SheetHeader>
                <CreatorEditor onSave={() => setEditorSheetOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${MOCK_CREATOR.balance.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2,350</div>
              <p className="text-xs text-muted-foreground">+180.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Content Items</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{MOCK_CONTENT_ITEMS.length}</div>
              <p className="text-xs text-muted-foreground">+5 since last month</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Content Library */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-semibold">Content Library</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MOCK_CONTENT_ITEMS.map(item => (
                <ContentCard key={item.id} content={item} isCreatorView />
              ))}
            </div>
          </div>
          {/* Tiers & Tippers */}
          <div className="space-y-8">
            {/* Subscription Tiers */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Subscription Tiers</h2>
              <div className="space-y-4">
                {MOCK_TIERS.map(tier => (
                  <SubscriptionTierCard key={tier.id} tier={tier} isCreatorView />
                ))}
              </div>
            </div>
            {/* Top Tippers */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Top Tippers</h2>
              <Card>
                <CardContent className="p-4">
                  <ul className="space-y-4">
                    {MOCK_TOP_TIPPERS.map(tipper => (
                      <li key={tipper.user.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src={tipper.user.avatar} alt={tipper.user.name} className="w-10 h-10 rounded-full" />
                          <div>
                            <p className="font-medium">{tipper.user.name}</p>
                            <p className="text-sm text-muted-foreground">Tipped {tipper.amount} tokens</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <PayoutRequestModal isOpen={isPayoutModalOpen} onOpenChange={setPayoutModalOpen} balance={MOCK_CREATOR.balance} />
    </AppLayout>
  );
}