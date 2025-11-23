import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, PlusCircle, Users, FileText, ArrowRight, AlertTriangle, PenSquare } from "lucide-react";
import { ContentCard } from "@/components/content/ContentCard";
import { SubscriptionTierCard } from "@/components/content/SubscriptionTierCard";
import { PayoutRequestModal } from "@/components/modals/PayoutRequestModal";
import { MOCK_ANALYTICS_DATA } from "@shared/mock-data";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CreatorEditor } from "./CreatorEditor";
import { Link } from "react-router-dom";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { Creator, ContentItem, Tier } from "@shared/types";
import { Skeleton } from "@/components/ui/skeleton";
interface DashboardData {
  creator: Creator;
  content: ContentItem[];
  tiers: Tier[];
  topTippers: { user: { id: string; name: string; avatar: string; }; amount: number; }[];
}
export function CreatorDashboard() {
  const [isPayoutModalOpen, setPayoutModalOpen] = useState(false);
  const [isEditorSheetOpen, setEditorSheetOpen] = useState(false);
  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: () => api('/api/dashboard'),
  });
  if (isLoading) {
    return <DashboardSkeleton />;
  }
  if (error) {
    return (
      <AppLayout container>
        <div className="flex flex-col items-center justify-center h-96 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <AlertTriangle className="w-12 h-12 text-red-500" />
          <h2 className="mt-4 text-xl font-semibold">Failed to load dashboard</h2>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      </AppLayout>
    );
  }
  const { creator, content, tiers, topTippers } = data!;
  return (
    <AppLayout container>
      <div className="space-y-8 md:space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-display">Creator Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {creator.name}!</p>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${creator.balance.toFixed(2)}</div>
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
              <div className="text-2xl font-bold">{content.length}</div>
              <p className="text-xs text-muted-foreground">+5 since last month</p>
            </CardContent>
          </Card>
          <Card className="flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Earnings Preview</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">Last 6 months</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-end p-0">
              <ResponsiveContainer width="100%" height={60}>
                <AreaChart data={MOCK_ANALYTICS_DATA.earnings} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                   <defs>
                    <linearGradient id="colorEarningsPreview" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--background))",
                      borderColor: "hsl(var(--border))",
                      fontSize: "12px",
                      padding: "4px 8px",
                    }}
                    labelFormatter={() => ''}
                    formatter={(value: number) => [`${value}`, 'Earnings']}
                  />
                  <Area type="monotone" dataKey="earnings" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#colorEarningsPreview)" />
                </AreaChart>
              </ResponsiveContainer>
              <Link to="/analytics" className="text-xs font-semibold text-primary text-center py-2 hover:underline">
                View Analytics <ArrowRight className="inline h-3 w-3" />
              </Link>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Content Library */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-semibold">Content Library</h2>
            {content.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {content.map(item => (
                  <ContentCard key={item.id} content={item} isCreatorView />
                ))}
              </div>
            ) : (
              <Card className="flex flex-col items-center justify-center text-center p-12 border-dashed">
                <PenSquare className="w-16 h-16 text-muted-foreground" />
                <h3 className="mt-4 text-xl font-semibold">No content yet</h3>
                <p className="mt-2 text-muted-foreground">Start by creating your first piece of exclusive content.</p>
                <Button className="mt-6 btn-gradient" onClick={() => setEditorSheetOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Content
                </Button>
              </Card>
            )}
          </div>
          {/* Tiers & Tippers */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Subscription Tiers</h2>
              <div className="space-y-4">
                {tiers.map(tier => (
                  <SubscriptionTierCard key={tier.id} tier={tier} isCreatorView />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Top Tippers</h2>
              <Card>
                <CardContent className="p-4">
                  <ul className="space-y-4">
                    {topTippers.map(tipper => (
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
      <PayoutRequestModal isOpen={isPayoutModalOpen} onOpenChange={setPayoutModalOpen} balance={creator.balance} />
    </AppLayout>
  );
}
function DashboardSkeleton() {
  return (
    <AppLayout container>
      <div className="space-y-8 md:space-y-12">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-48 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card><CardHeader><Skeleton className="h-4 w-24" /></CardHeader><CardContent><Skeleton className="h-8 w-32" /><Skeleton className="h-3 w-24 mt-1" /></CardContent></Card>
          <Card><CardHeader><Skeleton className="h-4 w-24" /></CardHeader><CardContent><Skeleton className="h-8 w-32" /><Skeleton className="h-3 w-24 mt-1" /></CardContent></Card>
          <Card><CardHeader><Skeleton className="h-4 w-24" /></CardHeader><CardContent><Skeleton className="h-8 w-32" /><Skeleton className="h-3 w-24 mt-1" /></CardContent></Card>
          <Card><CardHeader><Skeleton className="h-4 w-24" /></CardHeader><CardContent><Skeleton className="h-16 w-full" /></CardContent></Card>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-64 w-full rounded-lg" />
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
          </div>
          <div className="space-y-8">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-8 w-32 mt-4" />
            <Skeleton className="h-48 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}