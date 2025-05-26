import { ecomDb } from "@/lib/ecom-db";
import { OrderClient } from "./_components/order-client";
import { OrderColumn } from "./_components/columns";
import { format } from "date-fns";
import { priceFormatter } from "@/lib/utils";

const OrdersPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) => {
  const { storeId } = await params;

  const orders = await ecomDb.order.findMany({
    where: { storeId },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const formattedOrders: OrderColumn[] = orders.map(
    ({ id, phone, address, isPaid, orderItems, createdAt }) => ({
      id,
      phone, 
      address,
      isPaid,
      products: orderItems.map(item => item.product.name).join(', '),
      totalPrice: priceFormatter.format(orderItems.reduce((total, item) => total + Number(item.product.price), 0)),
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
