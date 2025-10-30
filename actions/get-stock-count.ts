import { ResponseBody } from "@/lib/types";
import { fetchAxios } from "@/lib/utils";

export const getStockCount = async (storeId: string) => {
  let totalCount: number | null = 0;
    
  try {
    const { data } = await fetchAxios<ResponseBody<number>>('get', `/api/${storeId}/orders/count?isArchived=false`);
    if (data.data) totalCount = data.data;
  } catch (error) {
    console.error('[ERROR] [GET_STOCK_COUNT]', error);
  }

  return totalCount;
};
