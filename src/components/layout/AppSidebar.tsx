'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  Bell,
  Home,
  LogOut,
  Shield,
  ShoppingCart,
  Star,
  Tag,
  Truck,
  Users,
  Utensils,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/menu', label: 'Menu', icon: Utensils },
  { href: '/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/users', label: 'Users', icon: Users },
  { href: '/drivers', label: 'Drivers', icon: Truck },
  { href: '/promotions', label: 'Promotions', icon: Tag },
  { href: '/reviews', label: 'Reviews', icon: Star },
  { href: '/notifications', label: 'Notifications', icon: Bell },
];

export default function AppSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2 justify-center group-data-[collapsible=icon]:justify-start">
          <Shield className="w-9 h-9 text-primary flex-shrink-0" />
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <h1 className="text-lg font-headline font-bold">Deliverzler</h1>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-0">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href} className="px-2">
              <SidebarMenuButton
                asChild
                isActive={isActive(item.href)}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem className="px-2">
            <SidebarMenuButton asChild tooltip="Logout">
              <Link href="/login">
                <LogOut />
                <span>Logout</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
