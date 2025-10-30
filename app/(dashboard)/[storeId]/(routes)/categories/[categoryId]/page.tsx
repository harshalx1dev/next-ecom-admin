import { CategoriesForm } from "../_components/categories-form";
import { Billboard, Category, ResponseBody } from "@/lib/types";
import { fetchAxios } from "@/lib/utils";

const CategoryPage = async ({ params }: { params: Promise<{ categoryId: string, storeId: string }> }) => {
  const { categoryId, storeId } = await params;

  let category = null;
  let billboards: Billboard[] = [];
  
  try {
    const { data } = await fetchAxios<ResponseBody<Category>>('get', `/api/${storeId}/categories/${categoryId}`);
    if (data.data) category = data.data;
  } catch (error) {
    console.error('[ERROR] [CATEGORY_PAGE]', error);
  }

  try {
    const { data } = await fetchAxios<ResponseBody<Billboard[]>>('get', `/api/${storeId}/billboards`);
    if (data.data?.length) billboards = data.data;
  } catch (error) {
    console.error('[ERROR] [CATEGORY_PAGE]', error);
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoriesForm billboards={billboards} initialData={category} />
      </div>
    </div>
  ) 
};

export default CategoryPage;
