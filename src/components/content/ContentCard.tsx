import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash2, Clock, Eye } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import type { ContentItem } from "@shared/types";
interface ContentCardProps {
  content: ContentItem;
  isCreatorView?: boolean;
}
const statusColors = {
  published: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  scheduled: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
};
export function ContentCard({ content, isCreatorView = false }: ContentCardProps) {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="aspect-video bg-muted rounded-md mb-4 flex items-center justify-center">
          <span className="text-muted-foreground text-sm">Thumbnail</span>
        </div>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg leading-tight">{content.title}</CardTitle>
          {isCreatorView && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild><Link to={`/editor/${content.id}`} className="w-full flex"><Edit className="mr-2 h-4 w-4" /> Edit</Link></DropdownMenuItem>
                <DropdownMenuItem><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="capitalize">{content.type}</Badge>
          <Badge variant="outline">Tier {content.tierId.slice(-1)}</Badge>
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground flex justify-between items-center">
        <div className="flex items-center gap-1">
          {content.status === 'scheduled' ? <Clock className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          <span>{format(content.publishedAt, "MMM d, yyyy")}</span>
        </div>
        {isCreatorView && <Badge className={`${statusColors[content.status]} capitalize`}>{content.status}</Badge>}
      </CardFooter>
    </Card>
  );
}