import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock } from "lucide-react";

export type Category = "Events" | "Issues" | "Jobs" | "Good Deeds" | "Donations";

export interface Post {
  id: string;
  type: Category;
  title: string;
  description: string;
  location: string;
  time: string;
  createdAt: string;
  coordinates?: [number, number];
}

const actionByType: Record<Category, { label: string }[]> = {
  Events: [{ label: "RSVP" }, { label: "Get Directions" }],
  Issues: [{ label: "Upvote" }],
  Jobs: [{ label: "Apply" }],
  "Good Deeds": [{ label: "Give Kudos" }],
  Donations: [{ label: "Get Directions" }],
};

export const PostCard = ({ post }: { post: Post }) => {
  const actions = actionByType[post.type];

  return (
    <article className="animate-enter">
      <Card className="shadow-soft hover:shadow-glow transition-shadow">
        <CardContent className="p-5 text-left">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary">{post.type}</Badge>
            <time className="text-sm text-muted-foreground">{post.time}</time>
          </div>
          <h3 className="text-lg font-semibold mb-1">{post.title}</h3>
          <p className="text-sm text-muted-foreground mb-3">{post.description}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" /> {post.location}</span>
            <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" /> {new Date(post.createdAt).toLocaleString()}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {actions.map((a) => (
              <Button key={a.label} size="sm" className="hover-scale">{a.label}</Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </article>
  );
};
