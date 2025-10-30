import { BillboardClient } from "./_components/billboard-client";
import { BillboardColumn } from "./_components/columns";
import { format } from "date-fns";
import { Billboard, ResponseBody } from "@/lib/types";
import { fetchAxios } from "@/lib/utils";

const BillboardsPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) => {
  const { storeId } = await params;

  let billboards: Billboard[] = [];

  try {
    const { data } = await fetchAxios<ResponseBody<Billboard[]>>('get', `/api/${storeId}/billboards`);
    if (data.data?.length) billboards = data.data;
  } catch (error) {
    console.error('[ERROR] [BILLBOARDS_PAGE]', error);
  }

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
