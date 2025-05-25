"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Billboard } from "@prisma/client";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { BillboardColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

export const BillboardClient = ({
  billboards,
}: {
  billboards: BillboardColumn[];
}) => {
  const router = useRouter();
  const params = useParams();

  if (!billboards) billboards = [];

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Billboards (${billboards.length})`}
          description="Manage billboards for your store"
        />
        <Button
          className="cursor-pointer"
          onClick={() => router.push(`/${params.storeId}/billboards/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={billboards} searchKey="label" />
      <Heading title="APIs" description="API Routes for Billboards" />
      <Separator />
      <ApiList entityName="billboards" entityNameId="billboardId" />
    </>
  );
};
