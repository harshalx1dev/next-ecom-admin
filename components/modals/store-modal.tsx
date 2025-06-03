"use client";

import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Modal } from "../ui/modal";
import { useStoreModal } from "@/hooks/use-store-modal";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { useTransition } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const StoreFormSchema = zod.object({
  name: zod.string().min(1)
})

export const StoreModal = () => {
  const { isOpen, onClose } = useStoreModal();
  const [isPending, startTransition] = useTransition();
  const form = useForm<zod.infer<typeof StoreFormSchema>>({
    resolver: zodResolver(StoreFormSchema),
    defaultValues: {
      name: '',
    }
  });

  const handleStoreSubmit = async (values: zod.infer<typeof StoreFormSchema>) => {
    startTransition(async () => {
      try {
        form.reset();

        const createStoreRes = await axios.post('/api/stores', values);

        if (createStoreRes.status != 200) {
          console.log(createStoreRes);
          throw new Error('Something went wrong!');
        }

        const responseData = createStoreRes.data;

        if (responseData.status != 'success') {
          console.log(responseData);
          throw new Error('Something went wrong!');
        }

        const storeData = responseData.data;

        window.location.assign(`/${storeData.id}`)
      } catch (error) {
        console.log('STORE_MODAL', error);
        toast.error('Something went wrong!')
      }
    })
  }

  return (
    <Modal title="Create Store" description="Add a new store to manage your products and categories" isOpen={isOpen} onClose={onClose}>
      <div>
        <div className="space-y-4 pt-2 pb4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleStoreSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Store Name</FormLabel>
                      <FormControl>
                        <Input disabled={isPending} placeholder="Enter your E-Commerce Store Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
              <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button disabled={isPending} className="cursor-pointer" variant={'outline'}>Cancel</Button>
                <Button disabled={isPending} className="cursor-pointer" variant={'default'} type="submit">Create</Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  )
}