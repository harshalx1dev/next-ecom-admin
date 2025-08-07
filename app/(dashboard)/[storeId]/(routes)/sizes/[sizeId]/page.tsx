import { ecomDb } from "@/lib/ecom-db";
import { SizesForm } from "../_components/sizes-form";

const SizePage = async ({ params }: { params: Promise<{ sizeId: string, storeId: string }> }) => {
  const { sizeId, storeId } = await params;

  const size = await ecomDb.size.findUnique({
    where: { id: sizeId }
  });

  const categories = await ecomDb.category.findMany({
    where: { storeId }
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizesForm initialData={size} categories={categories} />
      </div>
    </div>
  ) 
};

export default SizePage;
