"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation"

export const MainNav = ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname();
  const params = useParams();

  const routes = [
    {
      title: 'Overview',
      href: `/${params.storeId}`,
      active: pathname === `/${params.storeId}` ? true : false
    },
    {
      title: 'Billboards',
      href: `/${params.storeId}/billboards`,
      active: pathname === `/${params.storeId}/billboards` ? true : false
    },
    {
      title: 'Categories',
      href: `/${params.storeId}/categories`,
      active: pathname === `/${params.storeId}/categories` ? true : false
    },
    {
      title: 'Settings',
      href: `/${params.storeId}/settings`,
      active: pathname === `/${params.storeId}/settings` ? true : false
    },
  ]

  return (
    <nav className={cn('flex items-center space-x-4 lg:space-x-6', className)}>
      {routes.map((route, key) => <Link className={cn('text-sm font-medium transition-colors hover:text-primary', route.active ? 'text-black dark:text-white' : 'text-muted-foreground')} key={key} href={route.href}>{route.title}</Link>)}
    </nav>
  )
}