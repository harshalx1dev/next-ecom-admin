import { SizeClient } from "./_components/size-client";
import { SizeColumn } from "./_components/columns";
import { format } from "date-fns";
import { ResponseBody, Size } from "@/lib/types";
import { fetchAxios } from "@/lib/utils";

const SizesPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) => {
  const { storeId } = await params;

  let sizes: Size[] = [];
  
  try {
    const { data } = await fetchAxios<ResponseBody<Size[]>>('get', `/api/${storeId}/sizes`);
    if (data.data?.length) sizes = data.data;
  } catch (error) {
    console.error('[ERROR] [SIZES_PAGE]', error);
  }

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
