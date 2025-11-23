import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
export interface Tier {
  id: string;
  creatorId: string;
  name: string;
  price: number;
  benefits: string[];
}
interface SubscriptionTierCardProps {
  tier: Tier;
  isCreatorView?: boolean;
  onSubscribe?: (tierId: string) => void;
}
export function SubscriptionTierCard({ tier, isCreatorView = false, onSubscribe }: SubscriptionTierCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{tier.name}</CardTitle>
        <CardDescription>
          <span className="text-3xl font-bold text-foreground">${tier.price}</span>
          /month
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-2">
          {tier.benefits.map((benefit, i) => (
            <li key={i} className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-muted-foreground">{benefit}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        {isCreatorView ? (
          <Button variant="outline" className="w-full">Edit Tier</Button>
        ) : (
          <Button className="w-full btn-gradient" onClick={() => onSubscribe?.(tier.id)}>Subscribe</Button>
        )}
      </CardFooter>
    </Card>
  );
}