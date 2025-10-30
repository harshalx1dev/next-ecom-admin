"use server";

import { MainNav } from "./main-nav"
import { StoreSwitcher } from "./store-switcher"
import { ThemeToggle } from "./theme-toggle";
import { fetchAxios } from "@/lib/utils";
import { ResponseBody, Store } from "@/lib/types";

export const NavBar = async () => {
  let availableStores: Store[] = [];

  try {
    const { data } = await fetchAxios<ResponseBody<Store[]>>('get', '/api/stores');
    if (data.data?.length) availableStores = data.data;
  } catch (error) {
    console.error('[ERROR] [NAVBAR]', error);
  }

  return (
    <div className="border-b">
      <div className="flex items-center px-4 h-16">
        <StoreSwitcher items={availableStores} />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}