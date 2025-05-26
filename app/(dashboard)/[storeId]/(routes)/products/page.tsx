import { ecomDb } from "@/lib/ecom-db";
import { ProductClient } from "./_components/product-client";
import { ProductColumn } from "./_components/columns";
import { format } from "date-fns";
import { priceFormatter } from "@/lib/utils";

const ProductsPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) => {
  const { storeId } = await params;

  const products = await ecomDb.product.findMany({
    where: { storeId },
    include: { category: true, size: true, color: true },
    orderBy: { createdAt: "desc" },
  });

  const formattedProducts: ProductColumn[] = products.map(
    ({ id, name, isFeatured, isArchived, price, category, size, color, createdAt }) => ({
      id,
      name,
      isFeatured,
      isArchived,
      price: priceFormatter.format(price.toNumber()),
      category: category.name,
      size: size.name,
      color: color.value,
      createdAt: format(createdAt, "MMMM do, yyyy"),
    })
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient products={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
