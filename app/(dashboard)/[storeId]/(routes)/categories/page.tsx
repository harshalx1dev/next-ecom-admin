import { ecomDb } from "@/lib/ecom-db";
import { BillboardClient } from "./_components/billboard-client";
import { BillboardColumn } from "./_components/columns";
import { format } from "date-fns";

const BillboardsPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) => {
  const { storeId } = await params;

  const billboards = await ecomDb.billboard.findMany({
    where: { storeId },
  });

  const formattedBillboards: BillboardColumn[] = billboards.map(
    ({ id, label, createdAt }) => ({ id, label, createdAt: format(createdAt, "MMMM do, yyyy") })
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient billboards={formattedBillboards} />
      </div>
    </div>
  );
};

export default BillboardsPage;
