import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { MOCK_CREATOR, MOCK_CONTENT_ITEMS, MOCK_TIERS, MOCK_SUBSCRIPTION } from "@shared/mock-data";
import { ContentCard } from "@/components/content/ContentCard";
import { SubscriptionTierCard } from "@/components/content/SubscriptionTierCard";
import { Gem, Lock } from "lucide-react";
import { useState } from "react";
import { TokenPurchaseModal } from "@/components/modals/TokenPurchaseModal";
import { Toaster, toast } from "sonner";
export function SubscriberView() {
  const [isTokenModalOpen, setTokenModalOpen] = useState(false);
  const hasSubscription = MOCK_SUBSCRIPTION.active;
  const subscribedTierIndex = MOCK_TIERS.findIndex(t => t.id === MOCK_SUBSCRIPTION.tierId);
  const canViewContent = (contentTierId: string) => {
    if (!hasSubscription) return false;
    const contentTierIndex = MOCK_TIERS.findIndex(t => t.id === contentTierId);
    return contentTierIndex <= subscribedTierIndex;
  };
  return (
    <AppLayout container>
      <div className="space-y-8 md:space-y-12">
        {/* Creator Header */}
        <header className="text-center space-y-4">
          <img src={MOCK_CREATOR.avatar} alt={MOCK_CREATOR.name} className="w-24 h-24 rounded-full mx-auto ring-4 ring-primary/20" />
          <h1 className="text-4xl font-bold font-display">{MOCK_CREATOR.name}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">{MOCK_CREATOR.bio}</p>
          <Button onClick={() => setTokenModalOpen(true)}>
            <Gem className="mr-2 h-4 w-4" /> Tip Tokens
          </Button>
        </header>
        {/* Subscription Tiers */}
        {!hasSubscription && (
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-center">Join a Tier to Unlock Content</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_TIERS.map(tier => (
                <SubscriptionTierCard key={tier.id} tier={tier} onSubscribe={() => toast.success(`Subscribed to ${tier.name}!`)} />
              ))}
            </div>
          </section>
        )}
        {/* Content Feed */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Latest Content</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_CONTENT_ITEMS.map(item => {
              const isLocked = !canViewContent(item.tierId);
              return (
                <div key={item.id} className="relative">
                  <ContentCard content={item} />
                  {isLocked && (
                    <div className="absolute inset-0 bg-black/70 rounded-2xl flex flex-col items-center justify-center text-white p-4 space-y-4 backdrop-blur-sm">
                      <Lock className="w-12 h-12" />
                      <h3 className="text-xl font-bold text-center">Unlock this post</h3>
                      <p className="text-center text-sm">Subscribe to the '{MOCK_TIERS.find(t => t.id === item.tierId)?.name}' tier or higher to view.</p>
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