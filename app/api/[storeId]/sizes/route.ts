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
    const { name, value } = body;

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
        status: 500,
        success: false,
        message: "Store does not exist!",
      });

    if (!name)
      return genericResponse({
        status: 400,
        success: false,
        message: "Name is required",
      });

    if (!value)
      return genericResponse({
        status: 400,
        success: false,
        message: "Value is required",
      });

    const newSize = await ecomDb.size.create({
      data: {
        name,
        value,
        storeId,
      },
    });

    if (newSize) {
      return genericResponse({
        status: 200,
        success: true,
        message: "Size created successfully",
        data: newSize,
      });
    } else {
      return genericResponse({
        status: 500,
        success: false,
        message: "Failed to create size",
        data: newSize,
      });
    }
  } catch (error) {
    console.log("[SIZE_POST]", error);
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
        status: 500,
        success: false,
        message: "Store does not exist!",
      });

    const sizes = await ecomDb.size.findMany({
      where: { storeId },
    });

    if (!sizes) {
      return genericResponse({
        status: 200,
        success: true,
        message: "Size fetched successfully",
        data: sizes,
      });
    } else {
      return genericResponse({
        status: 500,
        success: true,
        message: "Failed to fetch sizes",
        data: sizes,
      });
    }
  } catch (error) {
    console.log("[SIZE_GET]", error);
    return genericResponse({
      status: 500,
      success: false,
      message: "Internal server error",
      error: error as Error,
    });
  }
};
