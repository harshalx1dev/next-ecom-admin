"use server";

import { ecomDb } from "@/lib/ecom-db";
import { genericResponse } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";

export const GET = async (
  _req: Request,
  { params }: { params: Promise<{ productId: string }> }
) => {
  try {
    const { productId } = await params;

    if (!productId)
      return genericResponse({
        status: 400,
        success: false,
        message: "Product ID is required!",
      });

    const product = await ecomDb.product.findUnique({
      where: { id: productId },
    });

    if (product) {
      return genericResponse({
        status: 200,
        success: true,
        message: "Product found!",
        data: product,
      });
    } else {
      return genericResponse({
        status: 404,
        success: false,
        message: "Product does not exist!",
        data: product,
      });
    }
  } catch (error) {
    console.log("[PRODUCT_GET]", error);
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
  { params }: { params: Promise<{ productId: string; storeId: string }> }
) => {
  try {
    const { userId } = await auth();
    const { storeId, productId } = await params;
    const body = await req.json();
    const {
      name,
      images,
      price,
      categoryId,
      colorId,
      sizeId,
      isFeatured,
      isArchived,
    } = body;

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

    const currentProduct = await ecomDb.product.findUnique({
      where: { id: productId, storeId }
    })

    if (!currentProduct)
      return genericResponse({
        status: 404,
        success: false,
        message: "Product does not exist!",
      });

    const updatedProduct = await ecomDb.product.update({
      where: { id: productId },
      data: {
        name,
        images: {
          deleteMany: {},
        },
        price: price || currentProduct.price,
        categoryId: categoryId || currentProduct.categoryId,
        colorId: colorId || currentProduct.colorId,
        sizeId: sizeId || currentProduct.sizeId,
        isFeatured: isFeatured || currentProduct.isFeatured,
        isArchived: isArchived || currentProduct.isArchived,
        storeId: storeId || currentProduct.storeId,
      },
    });

    const updateProductWithImages = await ecomDb.product.update({
      where: { id: productId },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          }
        }
      }
    })

    if (updateProductWithImages) {
      return genericResponse({
        status: 200,
        success: true,
        message: "Product updated successfully",
        data: updateProductWithImages,
      });
    } else {
      return genericResponse({
        status: 500,
        success: false,
        message: "Failed to update product",
        data: updateProductWithImages,
      });
    }
  } catch (error) {
    console.log("[PRODUCT_PATCH]", error);
    return genericResponse({
      status: 500,
      success: false,
      message: "Internal server error",
      error: error as Error,
    });
  }
};

export const DELETE = async (
  _req: Request,
  { params }: { params: Promise<{ productId: string; storeId: string }> }
) => {
  try {
    const { userId } = await auth();
    const { productId, storeId } = await params;

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

    const currentProduct = await ecomDb.product.findUnique({
      where: { id: productId, storeId },
    });

    if (!currentProduct)
      return genericResponse({
        status: 404,
        success: false,
        message: "Product does not exist!",
      });

    const deletedProduct = await ecomDb.product.delete({
      where: { id: productId, storeId },
    });

    if (deletedProduct) {
      return genericResponse({
        status: 200,
        success: true,
        message: "Product deleted successfully!",
        data: deletedProduct,
      });
    } else {
      return genericResponse({
        status: 500,
        success: false,
        message: "Failed to delete product!",
        data: deletedProduct,
      });
    }
  } catch (error) {
    console.log("PRODUCTS_DELETE", error);
    return genericResponse({
      status: 500,
      success: false,
      message: "Internal Server Error",
      error: error as Error,
    });
  }
};
