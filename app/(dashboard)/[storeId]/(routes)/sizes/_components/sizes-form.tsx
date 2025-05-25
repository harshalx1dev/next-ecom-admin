"use client";

import { AlertModal } from "@/components/modals/alert-modal";
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
import { ImageUpload } from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useOrigin } from "@/hooks/use-origin";
import { zodResolver } from "@hookform/resolvers/zod";
import { Size } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as zod from "zod";

interface SizesFormProps {
  initialData: Size | null;
}

const formSchema = zod.object({
  name: zod.string().min(1),
  value: zod.string().min(1),
});

type SizesFormSchema = zod.infer<typeof formSchema>;

export const SizesForm = ({ initialData }: SizesFormProps) => {
  const params = useParams();
  const origin = useOrigin();
  const navRouter = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<SizesFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { name: "", value: "" },
  });

  const title = initialData ? "Edit Size" : "Create Size";
  const description = initialData
    ? "Change the label or image of the size"
    : "Add a new size";
  const toastMessage = initialData ? "Size updated." : "Size created.";
  const action = initialData ? "Save Changes" : "Create";

  const sizesSubmitHandler = (values: SizesFormSchema) => {
    startTransition(async () => {
      try {
        let sizeRes;

        if (initialData) {
          sizeRes = await axios.patch(
            `/api/${params.storeId}/sizes/${params.sizeId}`,
            values
          );
        } else {
          sizeRes = await axios.post(`/api/${params.storeId}/sizes`, values);
        }

        if (sizeRes.status != 200) {
          console.log(sizeRes);
          throw new Error("Something went wrong!");
        }

        const responseData = sizeRes.data;

        if (responseData.status != "success") {
          console.log(responseData);
          throw new Error("Something went wrong!");
        }

        toast.success(toastMessage);
        navRouter.push(`/${params.storeId}/sizes`);
      } catch (error) {
        console.log("SIZe_FORM_SUBMIT", error);
        toast.error("Something went wrong!");
      }
    });
  };

  const sizeHandler = () => {
    startTransition(async () => {
      try {
        const sizeRes = await axios.delete(
          `/api/${params.storeId}/sizes/${params.sizeId}`
        );

        if (sizeRes.status != 200) {
          console.log(sizeRes);
          throw new Error("Something went wrong!");
        }

        const responseData = sizeRes.data;

        if (responseData.status != "success") {
          console.log(responseData);
          throw new Error("Something went wrong!");
        }

        setOpen(false);
        toast.success("Size deleted successfully!");

        navRouter.push(`/${params.storeId}/sizes`);
      } catch (error) {
        console.log("SIZe_FORM_DELETE", error);
        toast.error("Something went wrong!");
      }
    });
  };

  return (
    <>
      <AlertModal
        loading={isPending}
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={sizeHandler}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData ? (
          <Button
            disabled={isPending}
            className="cursor-pointer"
            variant={"destructive"}
            size={"icon"}
            onClick={() => setOpen(true)}
          >
            <Trash className="w-4 h-4" />
          </Button>
        ) : (
          ""
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          className="space-y-8 w-full"
          onSubmit={form.handleSubmit(sizesSubmitHandler)}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Size Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="Size label"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Size Value</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="Size value"
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
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  );
};
