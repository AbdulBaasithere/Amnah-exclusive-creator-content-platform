import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowRight, Clapperboard, Code, Download, Edit, Gem, ShieldCheck, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
const featureCards = [
  {
    icon: <Edit className="w-8 h-8 text-primary" />,
    title: "Creator-First Tools",
    description: "Manage your content, subscribers, and earnings with a powerful, intuitive dashboard.",
  },
  {
    icon: <Users className="w-8 h-8 text-primary" />,
    title: "Subscription Tiers",
    description: "Create custom recurring subscription tiers with unique benefits for your audience.",
  },
  {
    icon: <Gem className="w-8 h-8 text-primary" />,
    title: "Token-Based Tipping",
    description: "Receive one-time tips and gifts from your supporters via our virtual token system.",
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-primary" />,
    title: "Secure Content Gating",
    description: "Protect your exclusive content and ensure it's only accessible to paying subscribers.",
  },
  {
    icon: <Clapperboard className="w-8 h-8 text-primary" />,
    title: "Multi-Content Support",
    description: "Upload videos, digital downloads, private posts, code snippets, and more.",
  },
  {
    icon: <Download className="w-8 h-8 text-primary" />,
    title: "Digital Goods",
    description: "Sell digital products like e-books, software, and design assets directly to your audience.",
  },
];
const pricingTiers = [
  {
    name: "Explorer",
    price: "$9",
    features: ["Basic Content Access", "Community Chat", "Email Updates"],
    cta: "Choose Plan",
  },
  {
    name: "Creator Pro",
    price: "$29",
    features: ["All Explorer Features", "Exclusive Videos", "Source Code Downloads", "Priority Support"],
    cta: "Choose Plan",
    popular: true,
  },
  {
    name: "VIP Access",
    price: "$99",
    features: ["All Creator Pro Features", "1-on-1 Coaching Session", "Early Access to Content", "Direct Messaging"],
    cta: "Choose Plan",
  },
];
export function HomePage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <ThemeToggle className="fixed top-4 right-4" />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-100/50 via-indigo-100/50 to-teal-100/50 dark:from-orange-900/20 dark:via-indigo-900/20 dark:to-teal-900/20" />
          <div className="absolute inset-0 bg-grid-black/[0.05] dark:bg-grid-white/[0.05]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="py-24 md:py-32 lg:py-40 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-5xl md:text-7xl font-display font-bold text-balance leading-tight">
                  Monetize Your Skills,
                  <br />
                  <span className="text-gradient bg-gradient-primary">Empower Your Audience</span>
                </h1>
                <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
                  CraftLedger is the exclusive platform for creators to share premium content, build a loyal community, and earn a sustainable income.
                </p>
                <div className="mt-10 flex justify-center gap-4">
                  <Button asChild size="lg" className="btn-gradient px-8 py-4 text-lg font-semibold hover:-translate-y-0.5 transition-all duration-200">
                    <Link to="/creator/c1">Start a Creator Profile</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="px-8 py-4 text-lg font-semibold hover:-translate-y-0.5 transition-all duration-200">
                    <Link to="/creator/c1">Explore Creators <ArrowRight className="ml-2 w-5 h-5" /></Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        {/* Features Section */}
        <section className="py-16 md:py-24 bg-secondary/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-semibold">Everything You Need to Succeed</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A complete toolkit for professional creators to build a thriving digital business.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featureCards.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Card className="h-full text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <CardHeader>
                      <div className="mx-auto bg-primary/5 rounded-full p-3 w-fit">
                        {feature.icon}
                      </div>
                      <CardTitle className="mt-4">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        {/* Pricing Preview Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-semibold">Flexible Tiers for Every Creator</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                An example of how you can structure your subscription offerings.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingTiers.map((tier) => (
                <Card key={tier.name} className={`flex flex-col ${tier.popular ? 'border-primary shadow-primary' : ''}`}>
                  {tier.popular && (
                    <div className="bg-primary text-primary-foreground text-center text-sm font-bold py-1 rounded-t-lg">
                      Most Popular
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{tier.name}</CardTitle>
                    <p className="text-4xl font-bold">{tier.price}<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col">
                    <ul className="space-y-3 text-muted-foreground flex-grow">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-center">
                          <Code className="w-4 h-4 mr-2 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className={`mt-6 w-full ${tier.popular ? 'btn-gradient' : ''}`} variant={tier.popular ? 'default' : 'outline'}>
                      {tier.cta}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="py-8 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} CraftLedger. Built with ❤️ at Cloudflare.</p>
        </div>
      </footer>
    </div>
  );
}