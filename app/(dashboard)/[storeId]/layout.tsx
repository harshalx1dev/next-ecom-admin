"use server";

import { NavBar } from "@/components/navbar";
import { ecomDb } from "@/lib/ecom-db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const DashboardLayout = async ({ children, params }: {
  children: React.ReactNode,
  params: Promise<{ storeId: string }>
}) => {
  const { userId } = await auth();
  const { storeId } = await params;

  if (!userId) return redirect('/sign-in');

  const store = await ecomDb.store.findFirst({
    where: {
      id: storeId,
      userId
    }
  });

  if (!store) redirect('/');

  return (
    <>
      <NavBar />
      {children}
    </>
  )
}

export default DashboardLayout;