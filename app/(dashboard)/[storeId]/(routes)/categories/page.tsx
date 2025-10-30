import { CategoryClient } from "./_components/category-client";
import { CategoryColumn } from "./_components/columns";
import { format } from "date-fns";
import { Category, ResponseBody } from "@/lib/types";
import { fetchAxios } from "@/lib/utils";

const CategoriesPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) => {
  const { storeId } = await params;

  let categories: Category[] = [];
    
  try {
    const { data } = await fetchAxios<ResponseBody<Category[]>>('get', `/api/${storeId}/categories`);
    if (data.data?.length) categories = data.data;
  } catch (error) {
    console.error('[ERROR] [CATEGORIES_PAGE]', error);
  }

  const formattedCategories: CategoryColumn[] = categories.map(
    ({ id, name, createdAt, billboard }) => ({ id, name, billboardLabel: billboard!.label, createdAt: format(createdAt, "MMMM do, yyyy") })
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient categories={formattedCategories} />
      </div>
    </div>
  );
};

export default CategoriesPage;
