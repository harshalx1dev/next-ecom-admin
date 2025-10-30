import { fetchAxios } from "@/lib/utils";
import { redirect } from "next/navigation";
import { ResponseBody, Store } from "@/lib/types";

const SetupLayout = async ({ children }: { children: React.ReactNode }) => {
  let store;

  try {
    const { data } = await fetchAxios<ResponseBody<Store[]>>('get', '/api/stores');
    if (data.data?.length) store = data.data[0];
  } catch (error) {
    console.error('[ERROR] [SETUP_LAYOUT]', error);
  }

  if (store) return redirect(`/${store.id}`);

  return (
    <>{children}</>
  )
};

export default SetupLayout;