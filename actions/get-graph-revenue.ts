import { Order, ResponseBody } from "@/lib/types";
import { fetchAxios } from "@/lib/utils";

interface GraphData {
  name: string;
  total: number;
}

export const getGraphRevenue = async (storeId: string) => {
  let paidOrders: Order[] = [];

  try {
    const { data } = await fetchAxios<ResponseBody<Order[]>>('get', `/api/${storeId}/orders?isPaid=true`);
    if (data.data?.length) paidOrders = data.data;
  } catch (error) {
    console.error('[ERROR] [GET_GRAPH_REVENUE]', error);
  }

  const monthlyRevenue: { [key: number]: number } = {};

  for (const order of paidOrders) {
    const month = order.createdAt.getMonth();
    let revenueOfOrder = 0;

    for (const item of order.orderItems) {
      revenueOfOrder += Number(item.product!.price);
    }

    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueOfOrder;
  }

  const graphData: GraphData[] = [
    { name: "Jan", total: 0 },
    { name: "Feb", total: 0 },
    { name: "Mar", total: 0 },
    { name: "Apr", total: 0 },
    { name: "May", total: 0 },
    { name: "Jun", total: 0 },
    { name: "Jul", total: 0 },
    { name: "Aug", total: 0 },
    { name: "Sep", total: 0 },
    { name: "Oct", total: 0 },
    { name: "Nov", total: 0 },
    { name: "Dec", total: 0 },
  ];

  for (const month in monthlyRevenue) {
    graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)]
  }

  return graphData;
};
