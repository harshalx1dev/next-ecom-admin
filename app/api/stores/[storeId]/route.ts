import { ecomDb } from "@/lib/ecom-db";
import { genericResponse } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";

export const PATCH = async (request: Request, { params }: { params: Promise<{storeId: string}> }) => {

  try {
    const { storeId } = await params;
    const { userId } = await auth();

    const { name } = await request.json();

    if (!userId) return genericResponse({ status: 401, success: false, message: 'Unauthorized' });

    const currentStore = await ecomDb.store.findFirst({
      where: { id: storeId, userId }
    });

    if (!currentStore) return genericResponse({ status: 404, success: false, message: 'Store not found' });

    if (!name) return genericResponse({ status: 400, success: false, message: 'Name is required' });

    const updatedStore = await ecomDb.store.update({
      where: { id: storeId, userId },
      data: { name }
    });

    return genericResponse({ status: 200, success: true, message: 'Store name updated successfully!', data: updatedStore })
  } catch (error) {
    console.log('[STORE_PATCH]', error);
    return genericResponse({ status: 500, success: false, message: 'Internal Server Error', error: error as Error })
  }

}

export const DELETE = async (_request: Request, { params }: { params: Promise<{storeId: string}> }) => {

  try {
    const { storeId } = await params;
    const { userId } = await auth();

    if (!userId) return genericResponse({ status: 401, success: false, message: 'Unauthorized' });

    const currentStore = await ecomDb.store.findFirst({
      where: { id: storeId, userId }
    });

    if (!currentStore) return genericResponse({ status: 404, success: false, message: 'Store not found' });

    const deletedStore = await ecomDb.store.delete({
      where: { id: storeId, userId },
    });

    return genericResponse({ status: 200, success: true, message: 'Store has been deleted!', data: deletedStore })
  } catch (error) {
    console.log('[STORE_DELETE]', error);
    return genericResponse({ status: 500, success: false, message: 'Internal Server Error', error: error as Error })
  }

}