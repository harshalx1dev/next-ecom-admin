"use server";

import { ecomDb } from "@/lib/ecom-db";
import { genericResponse } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";

export const GET = async (
  _req: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) => {
  try {
    const { categoryId } = await params;

    if (!categoryId)
      return genericResponse({
        status: 400,
        success: false,
        message: "Category ID is required!",
      });

    const category = await ecomDb.category.findUnique({
      where: { id: categoryId },
      include: { billboard: true }
    });

    if (category) {
      return genericResponse({
        status: 200,
        success: true,
        message: "Category found!",
        data: category,
      });
    } else {
      return genericResponse({
        status: 404,
        success: false,
        message: "Category does not exist!",
        data: category,
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

export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ categoryId: string; storeId: string }> }
) => {
  try {
    const { userId } = await auth();
    const { categoryId, storeId } = await params;
    const body = await req.json();
    const { name, billboardId } = body;

    if (!userId)
      return genericResponse({
        status: 401,
        success: false,
        message: "Unauthorized",
      });

    const currentStore = await ecomDb.store.findFirst({
      where: { id: storeId, userId },
    });

    if (!currentStore)
      return genericResponse({
        status: 403,
        success: false,
        message: "Access denied",
      });

    const currentCategory = await ecomDb.category.findUnique({
      where: { id: categoryId, storeId },
    });

    if (!currentCategory)
      return genericResponse({
        status: 404,
        success: false,
        message: "Category does not exist!",
      });

    if (!name && !billboardId)
      return genericResponse({
        status: 400,
        success: false,
        message: "Either name or billboard id is required",
      });

    const updatedCategory = await ecomDb.category.update({
      where: { id: categoryId },
      data: {
        name: name || currentCategory.name,
        billboardId: billboardId || currentCategory.billboardId,
      },
    });

    if (updatedCategory) {
      return genericResponse({
        status: 200,
        success: true,
        message: "Billboard updated successfully!",
        data: updatedCategory,
      });
    } else {
      return genericResponse({
        status: 500,
        success: false,
        message: "Failed to update billboard!",
        data: updatedCategory,
      });
    }
  } catch (error) {
    console.log("CATEGORIES_PATCH", error);
    return genericResponse({
      status: 500,
      success: false,
      message: "Internal Server Error",
      error: error as Error,
    });
  }
};

export const DELETE = async (
  _req: Request,
  { params }: { params: Promise<{ categoryId: string; storeId: string }> }
) => {
  try {
    const { userId } = await auth();
    const { categoryId, storeId } = await params;

    if (!userId)
      return genericResponse({
        status: 401,
        success: false,
        message: "Unauthorized",
      });

    const currentStore = await ecomDb.store.findFirst({
      where: { id: storeId, userId },
    });

    if (!currentStore)
      return genericResponse({
        status: 403,
        success: false,
        message: "Access denied",
      });

    const currentCategory = await ecomDb.category.findUnique({
      where: { id: categoryId, storeId },
    });

    if (!currentCategory)
      return genericResponse({
        status: 404,
        success: false,
        message: "Category does not exist!",
      });

    const deletedCategory = await ecomDb.category.delete({
      where: { id: categoryId, storeId },
    });

    if (deletedCategory) {
      return genericResponse({
        status: 200,
        success: true,
        message: "Billboard deleted successfully!",
        data: deletedCategory,
      });
    } else {
      return genericResponse({
        status: 500,
        success: false,
        message: "Failed to delete billboard!",
        data: deletedCategory,
      });
    }
  } catch (error) {
    console.log("BILLBOARDS_DELETE", error);
    return genericResponse({
      status: 500,
      success: false,
      message: "Internal Server Error",
      error: error as Error,
    });
  }
};
