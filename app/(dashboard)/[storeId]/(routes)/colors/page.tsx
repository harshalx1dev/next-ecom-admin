import { ecomDb } from "@/lib/ecom-db";
import { ColorClient } from "./_components/color-client";
import { ColorColumn } from "./_components/columns";
import { format } from "date-fns";

const ColorsPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) => {
  const { storeId } = await params;

  const colors = await ecomDb.color.findMany({
    where: { storeId },
  });

  const formattedColors: ColorColumn[] = colors.map(
    ({ id, name, value, createdAt }) => ({ id, name, value, createdAt: format(createdAt, "MMMM do, yyyy") })
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorClient colors={formattedColors} />
      </div>
    </div>
  );
};

export default ColorsPage;
