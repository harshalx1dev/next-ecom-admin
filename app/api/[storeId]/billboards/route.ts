import { ecomDb } from "@/lib/ecom-db";
import { genericResponse } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";

export const POST = async (
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) => {
  try {
    const { userId } = await auth();
    const { storeId } = await params;
    const body = await req.json();
    const { label, imageUrl } = body;
    let { labelColor } = body;

    if (!userId)
      return genericResponse({
        status: 401,
        success: false,
        message: "Unauthorized",
      });

    const currentStore = await ecomDb.store.findUnique({
      where: { id: storeId, userId },
    });

    if (!currentStore)
      return genericResponse({
        status: 404,
        success: false,
        message: "Store does not exist!",
      });

    if (!label)
      return genericResponse({
        status: 400,
        success: false,
        message: "Label is required",
      });

    if (!imageUrl)
      return genericResponse({
        status: 400,
        success: false,
        message: "Image URL is required",
      });

    if (!labelColor) labelColor = '#000000';

    const newBillboard = await ecomDb.billboard.create({
      data: {
        label,
        imageUrl,
        labelColor,
        storeId,
      },
    });

    if (newBillboard) {
      return genericResponse({
        status: 200,
        success: true,
        message: "Billboard created successfully",
        data: newBillboard,
      });
    } else {
      return genericResponse({
        status: 500,
        success: false,
        message: "Failed to create billboard",
        data: newBillboard,
      });
    }
  } catch (error) {
    console.log("[BILLBOARD_POST]", error);
    return genericResponse({
      status: 500,
      success: false,
      message: "Internal server error",
      error: error as Error,
    });
  }
};

export const GET = async (
  _req: Request,
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

    const billboards = await ecomDb.billboard.findMany({
      where: { storeId },
    });

    if (billboards) {
      return genericResponse({
        status: 200,
        success: true,
        message: "Billboard fetched successfully",
        data: billboards,
      });
    } else {
      return genericResponse({
        status: 500,
        success: true,
        message: "Failed to fetch billboards",
        data: billboards,
      });
    }
  } catch (error) {
    console.log("[BILLBOARD_GET]", error);
    return genericResponse({
      status: 500,
      success: false,
      message: "Internal server error",
      error: error as Error,
    });
  }
};
