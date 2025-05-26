import { ecomDb } from "@/lib/ecom-db";
import { ProductsForm } from "../_components/products-form";

const ProductPage = async ({ params }: { params: Promise<{ productId: string, storeId: string }> }) => {
  const { productId, storeId } = await params;

  const product = await ecomDb.product.findUnique({
    where: { id: productId },
    include: { images: true }
  });

  const categories = await ecomDb.category.findMany({
    where: { storeId }
  });

  const sizes = await ecomDb.size.findMany({
    where: { storeId }
  });

  const colors = await ecomDb.color.findMany({
    where: { storeId }
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductsForm initialData={product} categories={categories} colors={colors} sizes={sizes} />
      </div>
    </div>
  ) 
};

export default ProductPage;
