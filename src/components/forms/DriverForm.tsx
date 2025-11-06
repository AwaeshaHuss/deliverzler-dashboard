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
import type { Driver } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { addDriver, updateDriver } from '@/lib/actions';
import { Loader2 } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Must be a valid email.'),
  phone: z.string().min(10, 'Must be a valid phone number.'),
  vehicle: z.string().min(3, 'Vehicle description is required.'),
  status: z.enum(['Approved', 'Pending', 'Rejected']),
  availability: z.enum(['Online', 'Offline', 'Busy']),
  avatarUrl: z.string().url('Must be a valid URL.'),
  dataAiHint: z.string(),
});

type DriverFormValues = z.infer<typeof formSchema>;

interface DriverFormProps {
  driver?: Driver | null;
  onSuccess?: () => void;
}

export default function DriverForm({ driver, onSuccess }: DriverFormProps) {
  const { toast } = useToast();
  const isEditing = !!driver;

  const defaultValues = isEditing
    ? driver
    : {
        name: '',
        email: '',
        phone: '',
        vehicle: '',
        status: 'Pending' as const,
        availability: 'Offline' as const,
        avatarUrl: PlaceHolderImages.find(img => img.id === 'driver-avatar-1')?.imageUrl || '',
        dataAiHint: PlaceHolderImages.find(img => img.id === 'driver-avatar-1')?.imageHint || '',
      };

  const form = useForm<DriverFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: DriverFormValues) => {
    try {
      if (isEditing && driver) {
        await updateDriver(driver.id, data);
        toast({ title: 'Success', description: 'Driver updated.' });
      } else {
        const newDriver: Omit<Driver, 'id'> = {
          ...data,
          dateJoined: new Date().toISOString(),
        };
        await addDriver(newDriver);
        toast({ title: 'Success', description: 'Driver created.' });
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
                <Input placeholder="Jane Smith" {...field} />
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
                <Input type="email" placeholder="driver@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="123-456-7890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="vehicle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehicle</FormLabel>
              <FormControl>
                <Input placeholder="Toyota Camry" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                >
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="availability"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Availability</FormLabel>
                <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                >
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="Offline">Offline</SelectItem>
                    <SelectItem value="Busy">Busy</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
          control={form.control}
          name="avatarUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avatar URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/avatar.jpg" {...field} />
              </FormControl>
               <FormDescription>The URL for the driver's avatar image.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? 'Save Changes' : 'Create Driver'}
        </Button>
      </form>
    </Form>
  );
}
