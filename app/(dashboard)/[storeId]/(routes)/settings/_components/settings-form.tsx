"use client";

import { AlertModal } from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/ui/api-alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useOrigin } from "@/hooks/use-origin";
import { zodResolver } from "@hookform/resolvers/zod";
import { Store } from "@/lib/types";
import axios from "axios";
import { Trash } from "lucide-react";
import useRouter from "@/hooks/use-router";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as zod from "zod";

interface SettingsFormProps {
  initialData: Store;
}

const formSchema = zod.object({
  name: zod.string().min(1),
});

type SettingsFormSchema = zod.infer<typeof formSchema>;

export const SettingsForm = ({ initialData }: SettingsFormProps) => {
  const origin = useOrigin();
  const navRouter = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<SettingsFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const settingsSubmitHandler = (values: SettingsFormSchema) => {
    startTransition(async () => {
      try {
        const patchStoreRes = await axios.patch(
          `/api/stores/${initialData.id}`,
          values
        );

        if (patchStoreRes.status != 200) {
          console.log(patchStoreRes);
          throw new Error("Something went wrong!");
        }

        const responseData = patchStoreRes.data;

        if (responseData.status != "success") {
          console.log(responseData);
          throw new Error("Something went wrong!");
        }

        toast.success("Store updated successfully!");

        navRouter.refresh();
      } catch (error) {
        console.log("SETTINGS_FORM_STORE_UPDATE", error);
        toast.error("Something went wrong!");
      }
    });
  };

  const deleteStoreHandler = () => {
    startTransition(async () => {
      try {
        const deleteStoreRes = await axios.delete(`/api/stores/${initialData.id}`);

        if (deleteStoreRes.status != 200) {
          console.log(deleteStoreRes);
          throw new Error("Something went wrong!");
        }

        const responseData = deleteStoreRes.data;

        if (responseData.status != "success") {
          console.log(responseData);
          throw new Error("Something went wrong!");
        }

        setOpen(false);
        toast.success("Store deleted successfully!");

        navRouter.push('/');
      } catch (error) {
        console.log("SETTINGS_FORM_STORE_DELETE", error);
        toast.error("Something went wrong!");
      }
    })
  }

  return (
    <>
      <AlertModal loading={isPending} open={open} onClose={() => setOpen(false)} onConfirm={deleteStoreHandler} />
      <div className="flex items-center justify-between">
        <Heading title="Settings" description="Manage your store preferences" />
        <Button
          disabled={isPending}
          className="cursor-pointer"
          variant={"destructive"}
          size={"icon"}
          onClick={() => setOpen(true)}
        >
          <Trash className="w-4 h-4" />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form
          className="space-y-8 w-full"
          onSubmit={form.handleSubmit(settingsSubmitHandler)}
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="Enter your store name..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <Button
            className="ml-auto cursor-pointer"
            size={"lg"}
            type="submit"
            disabled={isPending}
          >
            Save Changes
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert title="NEXT_API_URL" description={`${origin}/api/${initialData.id}`} variant="public" />
    </>
  );
};
