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
        status: 404,
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

    const newColor = await ecomDb.color.create({
      data: {
        name,
        value,
        storeId,
      },
    });

    if (newColor) {
      return genericResponse({
        status: 200,
        success: true,
        message: "Color created successfully",
        data: newColor,
      });
    } else {
      return genericResponse({
        status: 500,
        success: false,
        message: "Failed to create color",
        data: newColor,
      });
    }
  } catch (error) {
    console.log("[COLOR_POST]", error);
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

    const colors = await ecomDb.color.findMany({
      where: { storeId },
    });

    if (colors) {
      return genericResponse({
        status: 200,
        success: true,
        message: "Colors fetched successfully",
        data: colors,
      });
    } else {
      return genericResponse({
        status: 500,
        success: true,
        message: "Failed to fetch colors",
        data: colors,
      });
    }
  } catch (error) {
    console.log("[COLOR_GET]", error);
    return genericResponse({
      status: 500,
      success: false,
      message: "Internal server error",
      error: error as Error,
    });
  }
};
