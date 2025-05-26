"use server";

import { ecomDb } from "@/lib/ecom-db";
import { genericResponse } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";

export const GET = async (
  _req: Request,
  { params }: { params: Promise<{ sizeId: string }> }
) => {
  try {
    const { sizeId } = await params;

    if (!sizeId)
      return genericResponse({
        status: 400,
        success: false,
        message: "Size ID is required!",
      });

    const size = await ecomDb.size.findUnique({
      where: { id: sizeId },
    });

    if (size) {
      return genericResponse({
        status: 200,
        success: true,
        message: "Size found!",
        data: size,
      });
    } else {
      return genericResponse({
        status: 404,
        success: false,
        message: "Size does not exist!",
        data: size,
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

export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ sizeId: string; storeId: string }> }
) => {
  try {
    const { userId } = await auth();
    const { sizeId, storeId } = await params;
    const body = await req.json();
    const { name, value } = body;

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

    const currentSize = await ecomDb.size.findUnique({
      where: { id: sizeId, storeId },
    });

    if (!currentSize)
      return genericResponse({
        status: 404,
        success: false,
        message: "Size does not exist!",
      });

    if (!name && !value)
      return genericResponse({
        status: 400,
        success: false,
        message: "Either name or image url is required",
      });

    const updatedSize = await ecomDb.size.update({
      where: { id: sizeId },
      data: {
        name: name || currentSize.name,
        value: value || currentSize.value,
      },
    });

    if (updatedSize) {
      return genericResponse({
        status: 200,
        success: true,
        message: "Size updated successfully!",
        data: updatedSize,
      });
    } else {
      return genericResponse({
        status: 500,
        success: false,
        message: "Failed to update size!",
        data: updatedSize,
      });
    }
  } catch (error) {
    console.log("SIZES_PATCH", error);
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
  { params }: { params: Promise<{ sizeId: string; storeId: string }> }
) => {
  try {
    const { userId } = await auth();
    const { sizeId, storeId } = await params;

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

    const currentSize = await ecomDb.size.findUnique({
      where: { id: sizeId, storeId },
    });

    if (!currentSize)
      return genericResponse({
        status: 404,
        success: false,
        message: "Size does not exist!",
      });

    const deletedSize = await ecomDb.size.delete({
      where: { id: sizeId, storeId },
    });

    if (deletedSize) {
      return genericResponse({
        status: 200,
        success: true,
        message: "Size deleted successfully!",
        data: deletedSize,
      });
    } else {
      return genericResponse({
        status: 500,
        success: false,
        message: "Failed to delete size!",
        data: deletedSize,
      });
    }
  } catch (error) {
    console.log("SIZES_DELETE", error);
    return genericResponse({
      status: 500,
      success: false,
      message: "Internal Server Error",
      error: error as Error,
    });
  }
};
