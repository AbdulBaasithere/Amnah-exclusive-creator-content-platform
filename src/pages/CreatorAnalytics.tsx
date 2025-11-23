import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MOCK_ANALYTICS_DATA, MOCK_CREATOR } from "@shared/mock-data";
import { DollarSign, Users, BarChart2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col space-y-1">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {label}
            </span>
            {payload.map((p: any, i: number) => (
              <span key={i} className="font-bold" style={{ color: p.color }}>
                {p.name === 'earnings' ? `$${p.value.toLocaleString()}` : p.value.toLocaleString()}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return null;
};
export function CreatorAnalytics() {
  const totalEarnings = MOCK_ANALYTICS_DATA.earnings.reduce((sum, item) => sum + item.earnings, 0);
  const totalSubscribers = MOCK_ANALYTICS_DATA.subscribers[MOCK_ANALYTICS_DATA.subscribers.length - 1].subscribers;
  return (
    <AppLayout container>
      <div className="space-y-8 md:space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-display">Analytics</h1>
          <p className="text-muted-foreground">Your performance overview for the last 6 months.</p>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalEarnings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Last 6 months</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSubscribers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${MOCK_CREATOR.balance.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Ready for payout</p>
            </CardContent>
          </Card>
        </div>
        {/* Main Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Earnings & Subscriber Growth</CardTitle>
            <CardDescription>A look at your monthly revenue and subscriber count.</CardDescription>
          </CardHeader>
          <CardContent className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_ANALYTICS_DATA.earnings.map((e, i) => ({ ...e, subscribers: MOCK_ANALYTICS_DATA.subscribers[i].subscribers }))}>
                <defs>
                  <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSubscribers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area yAxisId="left" type="monotone" dataKey="earnings" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorEarnings)" />
                <Area yAxisId="right" type="monotone" dataKey="subscribers" stroke="hsl(var(--muted-foreground))" fillOpacity={1} fill="url(#colorSubscribers)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        {/* Top Content Table */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Content</CardTitle>
            <CardDescription>Your most popular and profitable posts.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                  <TableHead className="text-right">Earnings</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_ANALYTICS_DATA.topContent.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell className="text-right">{item.views.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${item.earnings.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}