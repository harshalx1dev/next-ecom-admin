import { redirect } from "next/navigation";
import { SettingsForm } from "./_components/settings-form";
import { fetchAxios } from "@/lib/utils";
import { ResponseBody, Store } from "@/lib/types";

interface SettingsPageProps {
  params: Promise<{ storeId: string }>;
}

const SettingsPage = async ({ params }: SettingsPageProps) => {
  const { storeId } = await params;

  let currentStore = null;
    
  try {
    const { data } = await fetchAxios<ResponseBody<Store>>('get', `/api/stores/${storeId}`);
    if (data.data) currentStore = data.data;
  } catch (error) {
    console.error('[ERROR] [SETTINGS_PAGE]', error);
  }

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