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
import type { MenuItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { addMenuItem, updateMenuItem } from '@/lib/actions';
import { Loader2 } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  category: z.string().min(2, 'Category must be at least 2 characters.'),
  price: z.coerce.number().positive('Price must be a positive number.'),
  imageUrl: z.string().url('Must be a valid URL.'),
  dataAiHint: z.string().optional(),
});

type MenuItemFormValues = z.infer<typeof formSchema>;

interface MenuItemFormProps {
  menuItem?: MenuItem | null;
  onSuccess?: () => void;
}

export default function MenuItemForm({ menuItem, onSuccess }: MenuItemFormProps) {
  const { toast } = useToast();
  const isEditing = !!menuItem;

  const defaultValues = isEditing
    ? {
        name: menuItem.name,
        description: menuItem.description,
        category: menuItem.category,
        price: menuItem.price,
        imageUrl: menuItem.imageUrl,
        dataAiHint: menuItem.dataAiHint,
      }
    : {
        name: '',
        description: '',
        category: '',
        price: 0,
        imageUrl: PlaceHolderImages.find(img => img.id === 'menu-item-1')?.imageUrl || '',
        dataAiHint: PlaceHolderImages.find(img => img.id === 'menu-item-1')?.imageHint || '',
      };

  const form = useForm<MenuItemFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: MenuItemFormValues) => {
    try {
      const itemData = {
        ...data,
        options: [], // Add default empty arrays
        addons: [],  // Add default empty arrays
      }

      if (isEditing && menuItem) {
        await updateMenuItem(menuItem.id, itemData);
        toast({ title: 'Success', description: 'Menu item updated.' });
      } else {
        await addMenuItem(itemData as Omit<MenuItem, 'id'>);
        toast({ title: 'Success', description: 'Menu item added.' });
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
                <Input placeholder="Margherita Pizza" {...field} />
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
                <Textarea placeholder="Classic pizza with tomato, mozzarella, and basil." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder="Pizza" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
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
              <FormDescription>The URL for the item's image.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? 'Save Changes' : 'Create Item'}
        </Button>
      </form>
    </Form>
  );
}
