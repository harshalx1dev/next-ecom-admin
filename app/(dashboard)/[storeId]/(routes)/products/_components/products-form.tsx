"use client";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { ImageUpload } from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category, Color, Image, Product, Size } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as zod from "zod";

type ProductWithImages = Product & {
  images: Image[];
};

interface ProductsFormProps {
  initialData: ProductWithImages | null;
  categories: Category[];
  sizes: Size[];
  colors: Color[];
}

const formSchema = zod.object({
  name: zod.string().min(1),
  images: zod.object({ url: zod.string() }).array().default([]),
  price: zod.coerce.number().min(1),
  categoryId: zod.string().min(1),
  sizeId: zod.string().min(1),
  colorId: zod.string().min(1),
  isFeatured: zod.boolean().optional(),
  isArchived: zod.boolean().optional(),
});

type ProductsFormSchema = zod.infer<typeof formSchema>;

export const ProductsForm = ({
  initialData,
  categories,
  sizes,
  colors,
}: ProductsFormProps) => {
  const params = useParams();
  const navRouter = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<ProductsFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          images: initialData.images || [],
          price: parseFloat(String(initialData.price)),
        }
      : {
          name: "",
          images: [],
          price: 0,
          categoryId: "",
          sizeId: "",
          colorId: "",
          isFeatured: false,
          isArchived: false,
        },
  });

  const title = initialData ? "Edit Product" : "Create Product";
  const description = initialData
    ? "Change the label or image of the product"
    : "Add a new product";
  const toastMessage = initialData ? "Product updated." : "Product created.";
  const action = initialData ? "Save Changes" : "Create";

  const productsSubmitHandler = (values: ProductsFormSchema) => {
    startTransition(async () => {
      try {
        let productRes;

        if (initialData) {
          productRes = await axios.patch(
            `/api/${params.storeId}/products/${params.productId}`,
            values
          );
        } else {
          productRes = await axios.post(
            `/api/${params.storeId}/products`,
            values
          );
        }

        if (productRes.status != 200) {
          console.log(productRes);
          throw new Error("Something went wrong!");
        }

        const responseData = productRes.data;

        if (responseData.status != "success") {
          console.log(responseData);
          throw new Error("Something went wrong!");
        }

        toast.success(toastMessage);
        navRouter.push(`/${params.storeId}/products`);
      } catch (error) {
        console.log("PRODUCT_FORM_SUBMIT", error);
        toast.error("Something went wrong!");
      }
    });
  };

  const deleteProductHandler = () => {
    startTransition(async () => {
      try {
        const deleteProductRes = await axios.delete(
          `/api/${params.storeId}/products/${params.productId}`
        );

        if (deleteProductRes.status != 200) {
          console.log(deleteProductRes);
          throw new Error("Something went wrong!");
        }

        const responseData = deleteProductRes.data;

        if (responseData.status != "success") {
          console.log(responseData);
          throw new Error("Something went wrong!");
        }

        setOpen(false);
        toast.success("Product deleted successfully!");

        navRouter.push(`/${params.storeId}/products`);
      } catch (error) {
        console.log("PRODUCT_FORM_DELETE", error);
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
        onConfirm={deleteProductHandler}
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
          onSubmit={form.handleSubmit(productsSubmitHandler)}
        >
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Product Images</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value.map((image) => image.url)}
                      disabled={isPending}
                      onChange={(url) =>
                        field.onChange([...form.getValues("images"), { url }])
                      }
                      onRemove={(url) =>
                        field.onChange([
                          ...form
                            .getValues("images")
                            .filter((image) => image.url !== url),
                        ])
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <div className="grid grid-cols-3 gap-8 items-start">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="Product name"
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
              name="price"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Product Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={isPending}
                        placeholder="Product price"
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
              name="categoryId"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="cursor-pointer w-full">
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select a category"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="sizeId"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Size</FormLabel>
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="cursor-pointer w-full">
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select a size"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sizes.map((size) => (
                          <SelectItem key={size.id} value={size.id}>
                            {size.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="colorId"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="cursor-pointer w-full">
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select a color"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {colors.map((color) => (
                          <SelectItem key={color.id} value={color.id}>
                            {color.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => {
                return (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        className="cursor-pointer w-5 h-5"
                        onCheckedChange={field.onChange}
                        checked={field.value}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="cursor-pointer">Featured</FormLabel>
                      <FormDescription>
                        If checked, this product will appear on home page.
                      </FormDescription>
                    </div>
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => {
                return (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        className="cursor-pointer w-5 h-5"
                        onCheckedChange={field.onChange}
                        checked={field.value}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="cursor-pointer">Archive</FormLabel>
                      <FormDescription>
                        If checked, this product will not appear anywhere on the
                        site.
                      </FormDescription>
                    </div>
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
