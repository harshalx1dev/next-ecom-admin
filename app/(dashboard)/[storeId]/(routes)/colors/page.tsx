import { ColorClient } from "./_components/color-client";
import { ColorColumn } from "./_components/columns";
import { format } from "date-fns";
import { Color, ResponseBody } from "@/lib/types";
import { fetchAxios } from "@/lib/utils";

const ColorsPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) => {
  const { storeId } = await params;

  let colors: Color[] = [];
  
  try {
    const { data } = await fetchAxios<ResponseBody<Color[]>>('get', `/api/${storeId}/colors`);
    if (data.data?.length) colors = data.data;
  } catch (error) {
    console.error('[ERROR] [COLORS_PAGE]', error);
  }

  const formattedColors: ColorColumn[] = colors.map(
    ({ id, name, value, createdAt }) => ({ id, name, value, createdAt: format(createdAt, "MMMM do, yyyy") })
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorClient colors={formattedColors} />
      </div>
    </div>
  );
};

export default ColorsPage;
