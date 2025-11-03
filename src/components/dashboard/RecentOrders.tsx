import { orders } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';

export default function RecentOrders() {
  const recentOrders = orders.slice(0, 5);

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
                {order.customer.name.toLowerCase().replace(' ', '.')}@example.com
              </p>
            </div>
            <div className="ml-auto font-medium">
              +${order.total.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      <Link href="/orders" legacyBehavior>
        <Button className="w-full" variant="outline">
          View All Orders <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}
