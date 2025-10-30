import { ResponseBody } from "@/lib/types";
import { fetchAxios } from "@/lib/utils";

export const getSalesCount = async (storeId: string) => {
  let totalCount: number | null = 0;
  
  try {
    const { data } = await fetchAxios<ResponseBody<number>>('get', `/api/${storeId}/orders/count?isPaid=true`);
    if (data.data) totalCount = data.data;
  } catch (error) {
    console.error('[ERROR] [GET_SALES_COUNT]', error);
  }

  return totalCount;
};
