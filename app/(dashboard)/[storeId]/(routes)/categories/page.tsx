import { ecomDb } from "@/lib/ecom-db";
import { CategoryClient } from "./_components/category-client";
import { CategoryColumn } from "./_components/columns";
import { format } from "date-fns";

const CategoriesPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) => {
  const { storeId } = await params;

  const categories = await ecomDb.category.findMany({
    where: { storeId },
    include: { billboard: true }
  });

  const formattedCategories: CategoryColumn[] = categories.map(
    ({ id, name, createdAt, billboard }) => ({ id, name, billboardLabel: billboard.label, createdAt: format(createdAt, "MMMM do, yyyy") })
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
