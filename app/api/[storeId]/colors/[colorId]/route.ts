"use server";

import { ecomDb } from "@/lib/ecom-db";
import { genericResponse } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";

export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ colorId: string; storeId: string }> }
) => {
  try {
    const { userId } = await auth();
    const { colorId, storeId } = await params;
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

    const currentColor = await ecomDb.color.findUnique({
      where: { id: colorId, storeId },
    });

    if (!currentColor)
      return genericResponse({
        status: 404,
        success: false,
        message: "Color does not exist!",
      });

    if (!name && !value)
      return genericResponse({
        status: 400,
        success: false,
        message: "Either name or image url is required",
      });

    const updatedColor = await ecomDb.color.update({
      where: { id: colorId },
      data: {
        name: name || currentColor.name,
        value: value || currentColor.value,
      },
    });

    if (updatedColor) {
      return genericResponse({
        status: 200,
        success: true,
        message: "Color updated successfully!",
        data: updatedColor,
      });
    } else {
      return genericResponse({
        status: 500,
        success: false,
        message: "Failed to update color!",
        data: updatedColor,
      });
    }
  } catch (error) {
    console.log("COLORS_PATCH", error);
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
  { params }: { params: Promise<{ colorId: string; storeId: string }> }
) => {
  try {
    const { userId } = await auth();
    const { colorId, storeId } = await params;

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

    const currentColor = await ecomDb.color.findUnique({
      where: { id: colorId, storeId },
    });

    if (!currentColor)
      return genericResponse({
        status: 404,
        success: false,
        message: "Color does not exist!",
      });

    const deletedColor = await ecomDb.color.delete({
      where: { id: colorId, storeId },
    });

    if (deletedColor) {
      return genericResponse({
        status: 200,
        success: true,
        message: "Color deleted successfully!",
        data: deletedColor,
      });
    } else {
      return genericResponse({
        status: 500,
        success: false,
        message: "Failed to delete color!",
        data: deletedColor,
      });
    }
  } catch (error) {
    console.log("COLORS_DELETE", error);
    return genericResponse({
      status: 500,
      success: false,
      message: "Internal Server Error",
      error: error as Error,
    });
  }
};
