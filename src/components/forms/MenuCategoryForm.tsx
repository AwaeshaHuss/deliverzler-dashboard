
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
import { Textarea } from '@/components/ui/textarea';
import type { MenuCategory } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { addMenuCategory, updateMenuCategory } from '@/lib/actions';
import { Loader2 } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  imageUrl: z.string().url('Must be a valid URL.'),
  dataAiHint: z.string().optional(),
});

type MenuCategoryFormValues = z.infer<typeof formSchema>;

interface MenuCategoryFormProps {
  category?: MenuCategory | null;
  onSuccess?: () => void;
}

export default function MenuCategoryForm({ category, onSuccess }: MenuCategoryFormProps) {
  const { toast } = useToast();
  const isEditing = !!category;

  const defaultValues = isEditing
    ? {
        name: category.name,
        description: category.description,
        imageUrl: category.imageUrl,
        dataAiHint: category.dataAiHint,
      }
    : {
        name: '',
        description: '',
        imageUrl: PlaceHolderImages.find(img => img.id === 'user-avatar-1')?.imageUrl || '',
        dataAiHint: PlaceHolderImages.find(img => img.id === 'user-avatar-1')?.imageHint || '',
      };

  const form = useForm<MenuCategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: MenuCategoryFormValues) => {
    try {
      if (isEditing && category) {
        await updateMenuCategory(category.id, data);
        toast({ title: 'Success', description: 'Menu category updated.' });
      } else {
        await addMenuCategory(data as Omit<MenuCategory, 'id'>);
        toast({ title: 'Success', description: 'Menu category added.' });
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
                <Input placeholder="Pizza" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Classic Italian dishes." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormDescription>The URL for the category's image.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? 'Save Changes' : 'Create Category'}
        </Button>
      </form>
    </Form>
  );
}
