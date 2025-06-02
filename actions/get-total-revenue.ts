import { ecomDb } from "@/lib/ecom-db";

export const getTotalRevenue = async (storeId: string) => {
  const paidOrders = await ecomDb.order.findMany({
    where: {
      storeId,
      isPaid: true,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  const totalRevenue = paidOrders.reduce((total, order) => {
    total += order.orderItems.reduce((sum, item) => {
      sum += item.product.price.toNumber()
      return sum;
    }, 0)
    return total;
  }, 0)

  return totalRevenue;
};
