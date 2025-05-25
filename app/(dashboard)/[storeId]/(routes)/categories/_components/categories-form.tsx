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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useOrigin } from "@/hooks/use-origin";
import { zodResolver } from "@hookform/resolvers/zod";
import { Billboard, Category } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as zod from "zod";

interface CategoriesFormProps {
  initialData: Category | null;
  billboards: Billboard[]
}

const formSchema = zod.object({
  name: zod.string().min(1),
  billboardId: zod.string().min(1),
});

type CategoriesFormSchema = zod.infer<typeof formSchema>;

export const CategoriesForm = ({ initialData, billboards }: CategoriesFormProps) => {
  const params = useParams();
  const origin = useOrigin();
  const navRouter = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<CategoriesFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { name: "", billboardId: "" },
  });

  const title = initialData ? "Edit Category" : "Create Category";
  const description = initialData
    ? "Change the label or image of the category"
    : "Add a new category";
  const toastMessage = initialData ? "Category updated." : "Category created.";
  const action = initialData ? "Save Changes" : "Create";

  const categoriesSubmitHandler = (values: CategoriesFormSchema) => {
    startTransition(async () => {
      try {
        let categoryRes;

        if (initialData) {
          categoryRes = await axios.patch(
            `/api/${params.storeId}/categories/${params.categoryId}`,
            values
          );
        } else {
          categoryRes = await axios.post(
            `/api/${params.storeId}/categories`,
            values
          );
        }

        if (categoryRes.status != 200) {
          console.log(categoryRes);
          throw new Error("Something went wrong!");
        }

        const responseData = categoryRes.data;

        if (responseData.status != "success") {
          console.log(responseData);
          throw new Error("Something went wrong!");
        }

        toast.success(toastMessage);
        navRouter.push(`/${params.storeId}/categories`);
      } catch (error) {
        console.log("CATEGORY_FORM_SUBMIT", error);
        toast.error("Something went wrong!");
      }
    });
  };

  const deleteCategoryHandler = () => {
    startTransition(async () => {
      try {
        const deleteCategoryRes = await axios.delete(
          `/api/${params.storeId}/categories/${params.categoryId}`
        );

        if (deleteCategoryRes.status != 200) {
          console.log(deleteCategoryRes);
          throw new Error("Something went wrong!");
        }

        const responseData = deleteCategoryRes.data;

        if (responseData.status != "success") {
          console.log(responseData);
          throw new Error("Something went wrong!");
        }

        setOpen(false);
        toast.success("Category deleted successfully!");

        navRouter.push(`/${params.storeId}/categories`);
      } catch (error) {
        console.log("CATEGORY_FORM_DELETE", error);
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
        onConfirm={deleteCategoryHandler}
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
          onSubmit={form.handleSubmit(categoriesSubmitHandler)}
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="Category label"
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
              name="billboardId"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Billboard</FormLabel>
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select a billboard"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {billboards.map(billboard => {
                          return (
                            <SelectItem key={billboard.id} value={billboard.id}>{billboard.label}</SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
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
