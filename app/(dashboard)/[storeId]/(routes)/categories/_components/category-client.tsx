"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import useRouter from "@/hooks/use-router";
import { useParams } from "next/navigation";
import { CategoryColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

export const CategoryClient = ({
  categories,
}: {
  categories: CategoryColumn[];
}) => {
  const router = useRouter();
  const params = useParams();

  if (!categories) categories = [];

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Categories (${categories.length})`}
          description="Manage categories for your store"
        />
        <Button
          className="cursor-pointer"
          onClick={() => router.push(`/${params.storeId}/categories/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={categories} searchKey="name" />
      <Heading title="APIs" description="API Routes for Categories" />
      <Separator />
      <ApiList entityName="categories" entityNameId="categoryId" />
    </>
  );
};
