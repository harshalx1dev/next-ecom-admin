"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import useRouter from "@/hooks/use-router";
import { SizeColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

export const SizeClient = ({
  sizes,
}: {
  sizes: SizeColumn[];
}) => {
  const router = useRouter();
  const params = useParams();

  if (!sizes) sizes = [];

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Sizes (${sizes.length})`}
          description="Manage sizes for your store"
        />
        <Button
          className="cursor-pointer"
          onClick={() => router.push(`/${params.storeId}/sizes/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={sizes} searchKey="name" />
      <Heading title="APIs" description="API Routes for Sizes" />
      <Separator />
      <ApiList entityName="sizes" entityNameId="sizeId" />
    </>
  );
};
