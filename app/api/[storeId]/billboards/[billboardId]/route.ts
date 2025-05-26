"use server";

import { ecomDb } from "@/lib/ecom-db";
import { genericResponse } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";

export const GET = async (
  _req: Request,
  { params }: { params: Promise<{ billboardId: string }> }
) => {
  try {
    const { billboardId } = await params;

    if (!billboardId)
      return genericResponse({
        status: 400,
        success: false,
        message: "Billboard ID is required!",
      });

    const billboard = await ecomDb.billboard.findUnique({
      where: { id: billboardId },
    });

    if (billboard) {
      return genericResponse({
        status: 200,
        success: true,
        message: "Billboard found!",
        data: billboard,
      });
    } else {
      return genericResponse({
        status: 404,
        success: false,
        message: "Billboard does not exist!",
        data: billboard,
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

export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ billboardId: string; storeId: string }> }
) => {
  try {
    const { userId } = await auth();
    const { billboardId, storeId } = await params;
    const body = await req.json();
    const { label, imageUrl } = body;

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

    const currentBillboard = await ecomDb.billboard.findUnique({
      where: { id: billboardId, storeId },
    });

    if (!currentBillboard)
      return genericResponse({
        status: 404,
        success: false,
        message: "Billboard does not exist!",
      });

    if (!label && !imageUrl)
      return genericResponse({
        status: 400,
        success: false,
        message: "Either label or image url is required",
      });

    const updatedBillboard = await ecomDb.billboard.update({
      where: { id: billboardId },
      data: {
        label: label || currentBillboard.label,
        imageUrl: imageUrl || currentBillboard.imageUrl,
      },
    });

    if (updatedBillboard) {
      return genericResponse({
        status: 200,
        success: true,
        message: "Billboard updated successfully!",
        data: updatedBillboard,
      });
    } else {
      return genericResponse({
        status: 500,
        success: false,
        message: "Failed to update billboard!",
        data: updatedBillboard,
      });
    }
  } catch (error) {
    console.log("BILLBOARDS_PATCH", error);
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
  { params }: { params: Promise<{ billboardId: string; storeId: string }> }
) => {
  try {
    const { userId } = await auth();
    const { billboardId, storeId } = await params;

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

    const currentBillboard = await ecomDb.billboard.findUnique({
      where: { id: billboardId, storeId },
    });

    if (!currentBillboard)
      return genericResponse({
        status: 404,
        success: false,
        message: "Billboard does not exist!",
      });

    const deletedBillboard = await ecomDb.billboard.delete({
      where: { id: billboardId, storeId },
    });

    if (deletedBillboard) {
      return genericResponse({
        status: 200,
        success: true,
        message: "Billboard deleted successfully!",
        data: deletedBillboard,
      });
    } else {
      return genericResponse({
        status: 500,
        success: false,
        message: "Failed to delete billboard!",
        data: deletedBillboard,
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
