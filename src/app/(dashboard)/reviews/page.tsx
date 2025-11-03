'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { reviews } from '@/lib/data';
import { summarizeUserReviews } from '@/ai/flows/summarize-user-reviews';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Star, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

type ReviewSummary = {
  summary: string;
  filteredReviews: string[];
};

export default function ReviewsPage() {
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSummarize = async () => {
    setIsLoading(true);
    setSummary(null);
    try {
      const reviewComments = reviews.map((r) => r.comment);
      const result = await summarizeUserReviews({ reviews: reviewComments });
      setSummary(result);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to summarize reviews.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? 'text-accent fill-accent' : 'text-muted-foreground'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-headline">Review Moderation</CardTitle>
                <CardDescription>
                  View and moderate user reviews.
                </CardDescription>
              </div>
              <Button onClick={handleSummarize} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Summarize with AI
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {reviews.map((review, index) => (
              <div key={review.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{review.customerName}</p>
                    <p className="text-xs text-muted-foreground">{review.date}</p>
                  </div>
                  {renderRating(review.rating)}
                </div>
                <p className="mt-2 text-sm text-foreground/80">
                  {summary ? summary.filteredReviews[index] : review.comment}
                </p>
                <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm" className="gap-1"><ThumbsUp className="h-3 w-3" /> Approve</Button>
                    <Button variant="outline" size="sm" className="gap-1"><ThumbsDown className="h-3 w-3" /> Hide</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-1">
        <Card className="sticky top-20">
          <CardHeader>
            <CardTitle className="font-headline">AI Summary</CardTitle>
            <CardDescription>
              Key topics and themes from recent reviews.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            )}
            {summary ? (
              <p className="text-sm">{summary.summary}</p>
            ) : (
              !isLoading && <p className="text-sm text-muted-foreground">Click "Summarize with AI" to generate a summary.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
