import { fetchAxios } from "@/lib/utils";
import { ColorsForm } from "../_components/colors-form";
import { Color, ResponseBody } from "@/lib/types";

const ColorPage = async ({ params }: { params: Promise<{ colorId: string, storeId: string }> }) => {
  const { colorId, storeId } = await params;

  let color = null;
  
  try {
    const { data } = await fetchAxios<ResponseBody<Color>>('get', `/api/${storeId}/colors/${colorId}`);
    if (data.data) color = data.data;
  } catch (error) {
    console.error('[ERROR] [COLOR_PAGE]', error);
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorsForm initialData={color} />
      </div>
    </div>
  ) 
};

export default ColorPage;
