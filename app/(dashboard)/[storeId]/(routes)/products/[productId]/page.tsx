import { ProductsForm } from "../_components/products-form";
import { fetchAxios } from "@/lib/utils";
import { Category, Color, ProductWithImages, ResponseBody, Size } from "@/lib/types";

const ProductPage = async ({ params }: { params: Promise<{ productId: string, storeId: string }> }) => {
  const { productId, storeId } = await params;

  let product = null;
  let categories: Category[] = [];
  let sizes: Size[] = [];
  let colors: Color[] = [];

  try {
    const [productRes, categoriesRes, sizesRes, colorsRes] = await Promise.all([
      fetchAxios<ResponseBody<ProductWithImages>>('get', `/api/${storeId}/products/${productId}`),
      fetchAxios<ResponseBody<Category[]>>('get', `/api/${storeId}/categories`),
      fetchAxios<ResponseBody<Size[]>>('get', `/api/${storeId}/sizes`),
      fetchAxios<ResponseBody<Color[]>>('get', `/api/${storeId}/colors`),
    ]);

    if (productRes?.data?.data) product = productRes?.data?.data;
    if (categoriesRes?.data?.data?.length) categories = categoriesRes?.data?.data;
    if (sizesRes?.data?.data?.length) sizes = sizesRes?.data?.data;
    if (colorsRes?.data?.data?.length) colors = colorsRes.data.data;
  } catch (error) {
    console.error('[ERROR] [PRODUCT_PAGE]', error);
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductsForm initialData={product} categories={categories} colors={colors} sizes={sizes} />
      </div>
    </div>
  ) 
};

export default ProductPage;
