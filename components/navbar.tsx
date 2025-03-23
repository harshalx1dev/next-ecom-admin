"use server";

import { UserButton } from "@clerk/nextjs"
import { MainNav } from "./main-nav"
import { StoreSwitcher } from "./store-switcher"
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ecomDb } from "@/lib/ecom-db";

export const NavBar = async () => {
  const { userId } = await auth(); 

  if (!userId) return redirect('/sign-in');

  const availableStores = await ecomDb.store.findMany({
    where: {
      userId
    }
  });

  return (
    <div className="border-b">
      <div className="flex items-center px-4 h-16">
        <StoreSwitcher items={availableStores} />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <UserButton appearance={{
            elements: {
              userButtonAvatarBox: 'md:min-w-10 md:min-h-10'
            }
          }} />
        </div>
      </div>
    </div>
  )
}