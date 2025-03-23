"use client";

import { Store } from "@prisma/client";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "./ui/command";
import { useStoreModal } from "@/hooks/use-store-modal";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { CheckIcon, ChevronsUpDown, PlusCircle, Store as StoreIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;

interface StoreSwitcherProps extends PopoverTriggerProps {
  items: Store[];
}

export const StoreSwitcher = ({ className, items }: StoreSwitcherProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { onOpen } = useStoreModal();
  const { storeId } = useParams();
  const navRouter = useRouter();

  const formattedItems = items?.map(item => ({ label: item.name, value: item.id }));
  const currentStore = items?.find(store => store.id === storeId);

  const storeSelectHandler = (store: { label: string, value: string }) => {
    setPopoverOpen(false);
    navRouter.push(`/${store.value}`);
  }

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button className={cn('min-w-[200px] justify-between', className)} variant={'outline'} size={'sm'} role="combobox" aria-expanded={popoverOpen} aria-label="Select a store">
          <StoreIcon className="mr-2 w-4 h-4" />
          {currentStore?.name}
          <ChevronsUpDown className="ml-auto w-4 h-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Command>
          <CommandEmpty>No Stores Found!</CommandEmpty>
          <CommandList>
            <CommandInput placeholder="Find store..." />
            <CommandGroup heading="Stores">
              {formattedItems?.map(item => {
                return (
                  <CommandItem key={item.value} className="text-sm" onSelect={() => storeSelectHandler(item)}>
                    <StoreIcon className="mr-2 h-4 w-4" />
                    {item.label}
                    <CheckIcon className={cn('ml-auth w-4 h-4', item.value === currentStore?.id ? 'opacity-100' : 'opacity-0')} />
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem onSelect={() => {
                setPopoverOpen(false);
                onOpen();
              }}>
                <PlusCircle className="mr-2 w-5 h-5" />
                Create Store
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
};