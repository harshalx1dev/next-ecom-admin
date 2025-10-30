import { ProductClient } from "./_components/product-client";
import { ProductColumn } from "./_components/columns";
import { format } from "date-fns";
import { fetchAxios, priceFormatter } from "@/lib/utils";
import { Product, ResponseBody } from "@/lib/types";

const ProductsPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) => {
  const { storeId } = await params;

  let products: Product[] = [];
  
  try {
    const { data } = await fetchAxios<ResponseBody<Product[]>>('get', `/api/${storeId}/products`);
    if (data.data?.length) products = data.data;
  } catch (error) {
    console.error('[ERROR] [PRODUCTS_PAGE]', error);
  }

  const formattedProducts: ProductColumn[] = products.map(
    ({ id, name, isFeatured, isArchived, price, category, size, color, createdAt }) => ({
      id,
      name,
      isFeatured,
      isArchived,
      price: priceFormatter.format(Number(price)),
      category: category!.name,
      size: size!.name,
      color: color!.value,
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
