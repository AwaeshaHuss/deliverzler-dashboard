'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { createTargetedNotification } from '@/ai/flows/create-targeted-notifications';
import { Loader2, Send, Wand2 } from 'lucide-react';

const formSchema = z.object({
  recipientType: z.enum(['user', 'driver']),
  situation: z.string().min(10, 'Please describe the situation in more detail.'),
  details: z.string().optional(),
  tone: z.enum(['formal', 'informal', 'friendly', 'urgent']),
});

type FormValues = z.infer<typeof formSchema>;

type GeneratedNotification = {
  title: string;
  body: string;
};

export default function NotificationsPage() {
  const [generatedNotification, setGeneratedNotification] =
    useState<GeneratedNotification | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipientType: 'user',
      situation: '',
      details: '',
      tone: 'friendly',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsGenerating(true);
    setGeneratedNotification(null);
    try {
      const result = await createTargetedNotification(data);
      setGeneratedNotification(result);
      form.setValue('details', result.body); // Use body as new details
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: 'Could not generate notification. Please try again.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSend = () => {
    setIsSending(true);
    // Simulate sending notification
    setTimeout(() => {
      setIsSending(false);
      toast({
        title: 'Notification Sent!',
        description: 'Your notification has been sent to the target audience.',
      });
      setGeneratedNotification(null);
      form.reset();
    }, 1500);
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline">Send Notification</CardTitle>
        <CardDescription>
          Use AI to compose and send targeted push notifications.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="recipientType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipient Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a recipient type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="driver">Driver</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tone</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a tone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="formal">Formal</SelectItem>
                        <SelectItem value="informal">Informal</SelectItem>
                        <SelectItem value="friendly">Friendly</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="situation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Situation</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., 'A new 20% discount on all pizza orders this weekend'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Details / Generated Body</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide more context or edit the generated message here..."
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {generatedNotification && (
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 space-y-2">
                <FormLabel>Generated Title</FormLabel>
                <p className="font-semibold">{generatedNotification.title}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button
              type="submit"
              variant="outline"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              Generate
            </Button>
            <Button
              type="button"
              onClick={handleSend}
              disabled={!generatedNotification || isSending}
            >
              {isSending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Send Notification
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
