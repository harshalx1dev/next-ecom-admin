import { OrderClient } from "./_components/order-client";
import { OrderColumn } from "./_components/columns";
import { format } from "date-fns";
import { fetchAxios, priceFormatter } from "@/lib/utils";
import { Order, ResponseBody } from "@/lib/types";

const OrdersPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) => {
  const { storeId } = await params;

  let orders: Order[] = [];
  
  try {
    const { data } = await fetchAxios<ResponseBody<Order[]>>('get', `/api/${storeId}/orders`);
    if (data.data?.length) orders = data.data;
  } catch (error) {
    console.error('[ERROR] [ORDERS_PAGE]', error);
  }

  const formattedOrders: OrderColumn[] = orders.map(
    ({ id, phone, address, isPaid, orderItems, createdAt }) => ({
      id,
      phone, 
      address,
      isPaid,
      products: orderItems.map(item => item.product!.name).join(', '),
      totalPrice: priceFormatter.format(orderItems.reduce((total, item) => total + Number(item.product!.price), 0)),
      createdAt: format(createdAt, "MMMM do, yyyy"),
    })
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient orders={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
