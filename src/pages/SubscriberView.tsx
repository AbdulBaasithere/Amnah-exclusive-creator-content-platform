import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { ContentCard } from "@/components/content/ContentCard";
import { SubscriptionTierCard } from "@/components/content/SubscriptionTierCard";
import { Gem, Lock, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { TokenPurchaseModal } from "@/components/modals/TokenPurchaseModal";
import { Toaster, toast } from "sonner";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { Creator, ContentItem, Tier, Subscription } from "@shared/types";
import { Skeleton } from "@/components/ui/skeleton";
interface CreatorViewData {
  creator: Creator;
  content: ContentItem[];
  tiers: Tier[];
  subscription: Subscription;
}
export function SubscriberView() {
  const { creatorId } = useParams<{ creatorId: string }>();
  const [isTokenModalOpen, setTokenModalOpen] = useState(false);
  const { data, isLoading, error } = useQuery<CreatorViewData>({
    queryKey: ['creator', creatorId],
    queryFn: () => api(`/api/creator/${creatorId}`),
    enabled: !!creatorId,
  });
  if (isLoading) {
    return <SubscriberViewSkeleton />;
  }
  if (error) {
    return (
      <AppLayout container>
        <div className="flex flex-col items-center justify-center h-96 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <AlertTriangle className="w-12 h-12 text-red-500" />
          <h2 className="mt-4 text-xl font-semibold">Failed to load creator page</h2>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      </AppLayout>
    );
  }
  const { creator, content, tiers, subscription } = data!;
  const hasSubscription = subscription.active;
  const subscribedTierIndex = tiers.findIndex(t => t.id === subscription.tierId);
  const canViewContent = (contentTierId: string) => {
    if (!hasSubscription) return false;
    const contentTierIndex = tiers.findIndex(t => t.id === contentTierId);
    return contentTierIndex <= subscribedTierIndex;
  };
  return (
    <AppLayout container>
      <div className="space-y-8 md:space-y-12">
        {/* Creator Header */}
        <header className="text-center space-y-4">
          <img src={creator.avatar} alt={creator.name} className="w-24 h-24 rounded-full mx-auto ring-4 ring-primary/20" />
          <h1 className="text-4xl font-bold font-display">{creator.name}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">{creator.bio}</p>
          <Button onClick={() => setTokenModalOpen(true)}>
            <Gem className="mr-2 h-4 w-4" /> Tip Tokens
          </Button>
        </header>
        {/* Subscription Tiers */}
        {!hasSubscription && (
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-center">Join a Tier to Unlock Content</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tiers.map(tier => (
                <SubscriptionTierCard key={tier.id} tier={tier} onSubscribe={() => toast.success(`Subscribed to ${tier.name}!`)} />
              ))}
            </div>
          </section>
        )}
        {/* Content Feed */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Latest Content</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.map(item => {
              const isLocked = !canViewContent(item.tierId);
              return (
                <div key={item.id} className="relative">
                  <ContentCard content={item} />
                  {isLocked && (
                    <div className="absolute inset-0 bg-black/70 rounded-2xl flex flex-col items-center justify-center text-white p-4 space-y-4 backdrop-blur-sm">
                      <Lock className="w-12 h-12" />
                      <h3 className="text-xl font-bold text-center">Unlock this post</h3>
                      <p className="text-center text-sm">Subscribe to the '{tiers.find(t => t.id === item.tierId)?.name}' tier or higher to view.</p>
                      <Button className="btn-gradient">Subscribe to Unlock</Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
      <TokenPurchaseModal isOpen={isTokenModalOpen} onOpenChange={setTokenModalOpen} />
      <Toaster richColors />
    </AppLayout>
  );
}
function SubscriberViewSkeleton() {
  return (
    <AppLayout container>
      <div className="space-y-8 md:space-y-12">
        <header className="text-center space-y-4">
          <Skeleton className="w-24 h-24 rounded-full mx-auto" />
          <Skeleton className="h-10 w-64 mx-auto" />
          <Skeleton className="h-4 w-full max-w-2xl mx-auto" />
          <Skeleton className="h-4 w-3/4 max-w-xl mx-auto" />
          <Skeleton className="h-10 w-32 mx-auto" />
        </header>
        <section className="space-y-6">
          <Skeleton className="h-8 w-48 mx-auto" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton className="h-64 w-full rounded-lg" />
            <Skeleton className="h-64 w-full rounded-lg" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        </section>
      </div>
    </AppLayout>
  );
}