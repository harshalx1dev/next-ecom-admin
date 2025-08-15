import { ecomDb } from "@/lib/ecom-db";
import { genericResponse } from "@/lib/utils";

export const GET = async (
  _: Request,
  { params }: { params: Promise<{ storeId: string }> }
) => {
  try {
    const { storeId } = await params;

    const currentStore = await ecomDb.store.findUnique({
      where: { id: storeId },
    });

    if (!currentStore)
      return genericResponse({
        status: 404,
        success: false,
        message: "Store does not exist!",
      });

    const orders = await ecomDb.order.findMany({
      where: { storeId },
      include: {
        orderItems: {
          include: {
            product: {
              include: {
                category: true,
                color: true,
                images: true,
                size: true,
              },
            },
          },
        },
      },
    });

    if (orders) {
      return genericResponse({
        status: 200,
        success: true,
        message: "Orders fetched successfully",
        data: orders,
      });
    } else {
      return genericResponse({
        status: 500,
        success: true,
        message: "Failed to fetch orders",
        data: orders,
      });
    }
  } catch (error) {
    console.log("[ORDER_GET]", error);
    return genericResponse({
      status: 500,
      success: false,
      message: "Internal server error",
      error: error as Error,
    });
  }
};
