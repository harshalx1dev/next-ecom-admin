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
import { zodResolver } from "@hookform/resolvers/zod";
import { Billboard } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as zod from "zod";

interface BillboardsFormProps {
  initialData: Billboard | null;
}

const formSchema = zod.object({
  label: zod.string().min(1),
  imageUrl: zod.string().min(1),
});

type BillboardsFormSchema = zod.infer<typeof formSchema>;

export const BillboardsForm = ({ initialData }: BillboardsFormProps) => {
  const params = useParams();
  const navRouter = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<BillboardsFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { label: "", imageUrl: "" },
  });

  const title = initialData ? "Edit Billboard" : "Create Billboard";
  const description = initialData
    ? "Change the label or image of the billboard"
    : "Add a new billboard";
  const toastMessage = initialData
    ? "Billboard updated."
    : "Billboard created.";
  const action = initialData ? "Save Changes" : "Create";

  const billboardsSubmitHandler = (values: BillboardsFormSchema) => {
    startTransition(async () => {
      try {
        let billboardRes;

        if (initialData) {
          billboardRes = await axios.patch(
            `/api/${params.storeId}/billboards/${params.billboardId}`,
            values
          );
        } else {
          billboardRes = await axios.post(
            `/api/${params.storeId}/billboards`,
            values
          );
        }

        if (billboardRes.status != 200) {
          console.log(billboardRes);
          throw new Error("Something went wrong!");
        }

        const responseData = billboardRes.data;

        if (responseData.status != "success") {
          console.log(responseData);
          throw new Error("Something went wrong!");
        }

        toast.success(toastMessage);
        navRouter.push(`/${params.storeId}/billboards`);
      } catch (error) {
        console.log("BILLBOARD_FORM_SUBMIT", error);
        toast.error("Something went wrong!");
      }
    });
  };

  const deleteBillboardHandler = () => {
    startTransition(async () => {
      try {
        const deleteBillboardRes = await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);

        if (deleteBillboardRes.status != 200) {
          console.log(deleteBillboardRes);
          throw new Error("Something went wrong!");
        }

        const responseData = deleteBillboardRes.data;

        if (responseData.status != "success") {
          console.log(responseData);
          throw new Error("Something went wrong!");
        }

        setOpen(false);
        toast.success("Billboard deleted successfully!");

        navRouter.push(`/${params.storeId}/billboards`);
      } catch (error) {
        console.log("BILLBOARD_FORM_DELETE", error);
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
        onConfirm={deleteBillboardHandler}
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
          onSubmit={form.handleSubmit(billboardsSubmitHandler)}
        >
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Background Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value ? [field.value] : []}
                      disabled={isPending}
                      onChange={(url) => field.onChange(url)}
                      onRemove={() => field.onChange("")}
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
              name="label"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Label</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="Billboard label"
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
