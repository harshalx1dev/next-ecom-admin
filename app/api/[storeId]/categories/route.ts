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
    const { name, billboardId } = body;

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

    if (!billboardId)
      return genericResponse({
        status: 400,
        success: false,
        message: "Billboard is required",
      });

    const newCategory = await ecomDb.category.create({
      data: {
        name,
        billboardId,
        storeId,
      },
    });

    if (newCategory) {
      return genericResponse({
        status: 200,
        success: true,
        message: "Category created successfully",
        data: newCategory,
      });
    } else {
      return genericResponse({
        status: 500,
        success: false,
        message: "Failed to create category",
        data: newCategory,
      });
    }
  } catch (error) {
    console.log("[CATEGORY_POST]", error);
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

    const categories = await ecomDb.category.findMany({
      where: { storeId },
    });

    if (categories) {
      return genericResponse({
        status: 200,
        success: true,
        message: "Categories fetched successfully",
        data: categories,
      });
    } else {
      return genericResponse({
        status: 500,
        success: true,
        message: "Failed to fetch categories",
        data: categories,
      });
    }
  } catch (error) {
    console.log("[CATEGORY_GET]", error);
    return genericResponse({
      status: 500,
      success: false,
      message: "Internal server error",
      error: error as Error,
    });
  }
};
