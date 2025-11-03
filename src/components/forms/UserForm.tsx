'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
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
import type { User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { addUser, updateUser } from '@/lib/actions';
import { Loader2 } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { format } from 'date-fns';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Must be a valid email.'),
  status: z.enum(['Active', 'Blocked']),
  avatarUrl: z.string().url('Must be a valid URL.'),
  dataAiHint: z.string().optional(),
  activitySummary: z.string().optional(),
});

type UserFormValues = z.infer<typeof formSchema>;

interface UserFormProps {
  user?: User | null;
  onSuccess?: () => void;
}

export default function UserForm({ user, onSuccess }: UserFormProps) {
  const { toast } = useToast();
  const isEditing = !!user;

  const defaultValues = isEditing
    ? {
        name: user.name,
        email: user.email,
        status: user.status,
        avatarUrl: user.avatarUrl,
        dataAiHint: user.dataAiHint,
        activitySummary: user.activitySummary,
      }
    : {
        name: '',
        email: '',
        status: 'Active' as const,
        avatarUrl: PlaceHolderImages.find(img => img.id === 'user-avatar-1')?.imageUrl || '',
        dataAiHint: PlaceHolderImages.find(img => img.id === 'user-avatar-1')?.imageHint || '',
        activitySummary: '',
      };

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: UserFormValues) => {
    try {
      if (isEditing && user) {
        await updateUser(user.id, data);
        toast({ title: 'Success', description: 'User updated.' });
      } else {
        const newUser: Omit<User, 'id'> = {
            ...data,
            dateJoined: new Date().toISOString(),
            lastOrder: new Date().toISOString(),
            address: 'N/A',
            favorites: 0,
            promoCodes: 0,
            supportTickets: 0,
        }
        await addUser(newUser);
        toast({ title: 'Success', description: 'User created.' });
      }
      onSuccess?.();
      form.reset();
    } catch (error) {
      // The global error handler will display the toast.
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="user@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="avatarUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avatar URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/avatar.jpg" {...field} />
              </FormControl>
               <FormDescription>The URL for the user's avatar image.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="activitySummary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Activity Summary</FormLabel>
              <FormControl>
                <Textarea placeholder="User has a history of late cancellations..." {...field} />
              </FormControl>
              <FormDescription>This is used by the AI moderation tool.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? 'Save Changes' : 'Create User'}
        </Button>
      </form>
    </Form>
  );
}
