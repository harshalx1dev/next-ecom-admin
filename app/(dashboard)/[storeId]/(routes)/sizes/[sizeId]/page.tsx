import { SizesForm } from "../_components/sizes-form";
import { Category, ResponseBody, Size } from "@/lib/types";
import { fetchAxios } from "@/lib/utils";

const SizePage = async ({ params }: { params: Promise<{ sizeId: string, storeId: string }> }) => {
  const { sizeId, storeId } = await params;

  let size = null;
  
  try {
    const { data } = await fetchAxios<ResponseBody<Size>>('get', `/api/${storeId}/sizes/${sizeId}`);
    if (data.data) size = data.data;
  } catch (error) {
    console.error('[ERROR] [ROOT_LAYOUT]', error);
  }

  let categories: Category[] = [];
  
  try {
    const { data } = await fetchAxios<ResponseBody<Category[]>>('get', `/api/${storeId}/categories`);
    if (data.data?.length) categories = data.data;
  } catch (error) {
    console.error('[ERROR] [SIZE_PAGE]', error);
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizesForm initialData={size} categories={categories} />
      </div>
    </div>
  ) 
};

export default SizePage;
