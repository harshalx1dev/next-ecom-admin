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

    if (!name)
      return genericResponse({
        status: 400,
        success: false,
        message: "Name is required",
      });

    if (!price)
      return genericResponse({
        status: 400,
        success: false,
        message: "Price is required",
      });

    if (!categoryId)
      return genericResponse({
        status: 400,
        success: false,
        message: "Category ID is required",
      });

    if (!colorId)
      return genericResponse({
        status: 400,
        success: false,
        message: "Color ID is required",
      });

    if (!sizeId)
      return genericResponse({
        status: 400,
        success: false,
        message: "Size ID is required",
      });

    if (!images || !images.length)
      return genericResponse({
        status: 400,
        success: false,
        message: "Images are required",
      });

    const newProduct = await ecomDb.product.create({
      data: {
        name,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
        price,
        categoryId,
        colorId,
        sizeId,
        isFeatured,
        isArchived,
        storeId,
      },
    });

    if (newProduct) {
      return genericResponse({
        status: 200,
        success: true,
        message: "Product created successfully",
        data: newProduct,
      }); 
    } else {
      return genericResponse({
        status: 500,
        success: false,
        message: "Failed to create product",
        data: newProduct,
      });
    }
  } catch (error) {
    console.log("[PRODUCT_POST]", error);
    return genericResponse({
      status: 500,
      success: false,
      message: "Internal server error",
      error: error as Error,
    });
  }
};

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) => {
  try {
    const { storeId } = await params;
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const isFeatured = searchParams.get("isFeatured");

    const currentStore = await ecomDb.store.findUnique({
      where: { id: storeId },
    });

    if (!currentStore)
      return genericResponse({
        status: 404,
        success: false,
        message: "Store does not exist!",
      });

    const products = await ecomDb.product.findMany({
      where: { storeId, categoryId, colorId, sizeId, isFeatured: isFeatured ? true : undefined, isArchived: false },
      include: { category: true, color: true, size: true, images: true },
      orderBy: { createdAt: "desc" }
    });

    if (products) {
      return genericResponse({
        status: 200,
        success: true,
        message: "Products fetched successfully",
        data: products,
      });
    } else {
      return genericResponse({
        status: 200,
        success: true,
        message: "Failed to fetch products",
        data: products,
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
