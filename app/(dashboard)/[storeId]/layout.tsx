"use server";

import { NavBar } from "@/components/navbar";
import { ResponseBody, Store } from "@/lib/types";
import { fetchAxios } from "@/lib/utils";
import { redirect } from "next/navigation";

const DashboardLayout = async ({ children, params }: {
  children: React.ReactNode,
  params: Promise<{ storeId: string }>
}) => {
  const { storeId } = await params;

  let store;

  try {
    const { data } = await fetchAxios<ResponseBody<Store>>('get', `/api/stores/${storeId}`);
    if (data.data) store = data.data;
  } catch (error) {
    console.error('[ERROR] [DASHBOARD_LAYOUT]', error);
  }

  if (!store) redirect('/');

  return (
    <>
      <NavBar />
      {children}
    </>
  )
}

export default DashboardLayout;