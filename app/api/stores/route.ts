"use server";

import { genericResponse } from "@/lib/utils";
import { ecomDb } from "@/lib/ecom-db";
import { auth } from "@clerk/nextjs/server";

export const POST = async (request: Request) => {

  try {
    const { userId } = await auth();
    const body = await request.json();
    const { name } = body;

    if (!userId) return genericResponse({ status: 401, success: false, message: 'Unauthorized' });

    if (!name) return genericResponse({ status: 400, success: false, message: 'Name is required' });

    const store = await ecomDb.store.create({
      data: {
        name,
        userId
      }
    });

    return genericResponse({ status: 200, success: true, message: 'Store created successfully!', data: store })
  } catch (error) {
    console.log('STORES_POST', error);
    return genericResponse({ status: 500, success: false, message: 'Internal Server Error', error: error as Error })
  }
}