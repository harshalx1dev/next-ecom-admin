"use server";

import { ecomDb } from "@/lib/ecom-db";

interface DashboardPageProps {
  params: Promise<{ storeId: string }>;
}

const DashboardPage = async ({ params }: DashboardPageProps) => {
  const { storeId } = await params;

  const store = await ecomDb.store.findUnique({
    where: {
      id: storeId
    }
  });

  return (
    <>Active Store: {store?.name}</>
  )
};

export default DashboardPage;