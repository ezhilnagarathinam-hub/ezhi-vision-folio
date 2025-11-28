import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Heart, Share2, ChevronRight, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image_url: string | null;
  published: boolean;
  created_at: string;
}

interface PostDialogProps {
  post: Post | null;
  posts: Post[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PostDialog = ({ post, posts, open, onOpenChange }: PostDialogProps) => {
  const [liked, setLiked] = useState(false);
  const { toast } = useToast();

  if (!post) return null;

  const currentIndex = posts.findIndex(p => p.id === post.id);
  const hasNext = currentIndex < posts.length - 1;
  const nextPost = hasNext ? posts[currentIndex + 1] : null;

  const handleLike = () => {
    setLiked(!liked);
    toast({
      title: liked ? "Unliked" : "Liked!",
      description: liked ? "Post removed from favorites" : "Post added to favorites"
    });
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href
      });
    } catch (error) {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Post link copied to clipboard"
      });
    }
  };

  const handleNext = () => {
    if (nextPost) {
      onOpenChange(false);
      setTimeout(() => {
        const nextPostDialog = { ...nextPost };
        onOpenChange(true);
      }, 100);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <DialogTitle className="text-3xl font-bold pr-8">{post.title}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {post.image_url && (
            <img 
              src={post.image_url} 
              alt={post.title}
              className="w-full h-96 object-cover rounded-lg"
            />
          )}

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(post.created_at).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-lg leading-relaxed whitespace-pre-wrap">{post.content}</p>
          </div>

          <div className="flex items-center gap-3 pt-6 border-t">
            <Button
              variant={liked ? "default" : "outline"}
              size="lg"
              onClick={handleLike}
              className="flex items-center gap-2"
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              {liked ? 'Liked' : 'Like'}
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={handleShare}
              className="flex items-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              Share
            </Button>

            {hasNext && (
              <Button
                variant="default"
                size="lg"
                onClick={handleNext}
                className="flex items-center gap-2 ml-auto"
              >
                Next Post
                <ChevronRight className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
