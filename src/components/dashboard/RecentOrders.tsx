'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';
import { useCollection } from '@/firebase';
import type { Order } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';

export default function RecentOrders() {
  const { data: orders, isLoading } = useCollection<Order>('orders');
  const recentOrders = orders?.slice(0, 5) || [];

  if (isLoading) {
    return (
       <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-40" />
            </div>
            <Skeleton className="h-5 w-16" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {recentOrders.map((order) => (
          <div key={order.id} className="flex items-center gap-4">
            <Avatar className="hidden h-9 w-9 sm:flex">
              <AvatarImage
                src={order.customer.avatarUrl}
                alt="Avatar"
                data-ai-hint={order.customer.dataAiHint}
              />
              <AvatarFallback>
                {order.customer.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="grid gap-1 flex-1">
              <p className="text-sm font-medium leading-none">
                {order.customer.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {order.customer.name.toLowerCase().replace(' ', '.')}
                @example.com
              </p>
            </div>
            <div className="ml-auto font-medium">
              +${order.total.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      <Button asChild className="w-full" variant="outline">
        <Link href="/orders">
          View All Orders <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
