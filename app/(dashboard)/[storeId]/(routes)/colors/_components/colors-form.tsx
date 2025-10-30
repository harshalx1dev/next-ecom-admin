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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Color } from "@/lib/types";
import axios from "axios";
import { Trash } from "lucide-react";
import useRouter from "@/hooks/use-router";
import { useParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as zod from "zod";

interface ColorsFormProps {
  initialData: Color | null;
}

const formSchema = zod.object({
  name: zod.string().min(1),
  value: zod
    .string()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, {
      message: "Invalid hex color. Must be #RGB, #RRGGBB, or #RRGGBBAA.",
    }),
});

type ColorsFormSchema = zod.infer<typeof formSchema>;

export const ColorsForm = ({ initialData }: ColorsFormProps) => {
  const params = useParams();
  const navRouter = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<ColorsFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { name: "", value: "" },
  });

  const title = initialData ? "Edit Color" : "Create Color";
  const description = initialData
    ? "Change the label or image of the color"
    : "Add a new color";
  const toastMessage = initialData ? "Color updated." : "Color created.";
  const action = initialData ? "Save Changes" : "Create";

  const colorsSubmitHandler = (values: ColorsFormSchema) => {
    startTransition(async () => {
      try {
        let colorRes;

        if (initialData) {
          colorRes = await axios.patch(
            `/api/${params.storeId}/colors/${params.colorId}`,
            values
          );
        } else {
          colorRes = await axios.post(`/api/${params.storeId}/colors`, values);
        }

        if (colorRes.status != 200) {
          console.log(colorRes);
          throw new Error("Something went wrong!");
        }

        const responseData = colorRes.data;

        if (responseData.status != "success") {
          console.log(responseData);
          throw new Error("Something went wrong!");
        }

        toast.success(toastMessage);
        navRouter.push(`/${params.storeId}/colors`);
      } catch (error) {
        console.log("Color_FORM_SUBMIT", error);
        toast.error("Something went wrong!");
      }
    });
  };

  const colorHandler = () => {
    startTransition(async () => {
      try {
        const colorRes = await axios.delete(
          `/api/${params.storeId}/colors/${params.colorId}`
        );

        if (colorRes.status != 200) {
          console.log(colorRes);
          throw new Error("Something went wrong!");
        }

        const responseData = colorRes.data;

        if (responseData.status != "success") {
          console.log(responseData);
          throw new Error("Something went wrong!");
        }

        setOpen(false);
        toast.success("Color deleted successfully!");

        navRouter.push(`/${params.storeId}/colors`);
      } catch (error) {
        console.log("Color_FORM_DELETE", error);
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
        onConfirm={colorHandler}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData ? (
          <Button
            disabled={isPending}
            className="cursor-pointer"
            variant={"destructive"}
            color={"icon"}
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
          onSubmit={form.handleSubmit(colorsSubmitHandler)}
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Color Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="Color label"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Color Value</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-x-2">
                        <Input
                          disabled={isPending}
                          placeholder="Color value"
                          {...field}
                        />
                        <div
                          className="border p-4 rounded-full"
                          style={{ backgroundColor: field.value }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <Button
            className="ml-auto cursor-pointer"
            color={"lg"}
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
