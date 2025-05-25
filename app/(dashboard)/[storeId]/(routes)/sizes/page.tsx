import { ecomDb } from "@/lib/ecom-db";
import { SizeClient } from "./_components/size-client";
import { SizeColumn } from "./_components/columns";
import { format } from "date-fns";

const SizesPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) => {
  const { storeId } = await params;

  const sizes = await ecomDb.size.findMany({
    where: { storeId },
  });

  const formattedSizes: SizeColumn[] = sizes.map(
    ({ id, name, value, createdAt }) => ({ id, name, value, createdAt: format(createdAt, "MMMM do, yyyy") })
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeClient sizes={formattedSizes} />
      </div>
    </div>
  );
};

export default SizesPage;
