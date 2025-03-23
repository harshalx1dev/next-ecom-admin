import { ecomDb } from "@/lib/ecom-db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SettingsForm } from "./_components/settings-form";

interface SettingsPageProps {
  params: Promise<{ storeId: string }>;
}

const SettingsPage = async ({ params }: SettingsPageProps) => {
  const { userId } = await auth();
  const { storeId } = await params;

  if (!userId) return redirect('/sign-in');

  const currentStore = await ecomDb.store.findUnique({
    where: {
      id: storeId
    }
  });

  if (!currentStore) return redirect('/');

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={currentStore} />
      </div>
    </div>
  )
};

export default SettingsPage;