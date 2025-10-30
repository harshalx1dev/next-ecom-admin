import { Order, ResponseBody } from "@/lib/types";
import { fetchAxios } from "@/lib/utils";

export const getTotalRevenue = async (storeId: string) => {
  let paidOrders: Order[] = [];
  
  try {
    const { data } = await fetchAxios<ResponseBody<Order[]>>('get', `/api/${storeId}/orders?isPaid=true`);
    if (data.data?.length) paidOrders = data.data;
  } catch (error) {
    console.error('[ERROR] [GET_TOTAL_REVENUE]', error);
  }

  const totalRevenue = paidOrders.reduce((total, order) => {
    total += order.orderItems.reduce((sum, item) => {
      sum += Number(item.product!.price)
      return sum;
    }, 0)
    return total;
  }, 0)

  return totalRevenue;
};
