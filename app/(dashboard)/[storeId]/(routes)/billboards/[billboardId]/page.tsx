import { fetchAxios } from "@/lib/utils";
import { BillboardsForm } from "../_components/billboards-form";
import { Billboard, ResponseBody } from "@/lib/types";

const BillboardPage = async ({ params }: { params: Promise<{ billboardId: string, storeId: string }> }) => {
  const { billboardId, storeId } = await params;

  let billboard = null;
  
  try {
    const { data } = await fetchAxios<ResponseBody<Billboard>>('get', `/api/${storeId}/billboards/${billboardId}`);
    if (data.data) billboard = data.data;
  } catch (error) {
    console.error('[ERROR] [BILLBOARD_PAGE]', error);
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardsForm initialData={billboard} />
      </div>
    </div>
  ) 
};

export default BillboardPage;
