import { ecomDb } from "@/lib/ecom-db";

export const getSalesCount = async (storeId: string) => {
  const totalCount = await ecomDb.order.count({
    where: {
      storeId,
      isPaid: true,
    },
  });

  return totalCount;
};
