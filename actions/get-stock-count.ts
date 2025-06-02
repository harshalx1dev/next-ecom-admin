import { ecomDb } from "@/lib/ecom-db";

export const getStockCount = async (storeId: string) => {
  const totalCount = await ecomDb.product.count({
    where: {
      storeId,
      isArchived: false,
    },
  });

  return totalCount;
};
