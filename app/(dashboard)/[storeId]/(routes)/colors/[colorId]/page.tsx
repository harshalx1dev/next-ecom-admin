import { ecomDb } from "@/lib/ecom-db";
import { ColorsForm } from "../_components/colors-form";

const ColorPage = async ({ params }: { params: Promise<{ colorId: string }> }) => {
  const { colorId } = await params;

  const color = await ecomDb.color.findUnique({
    where: { id: colorId }
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorsForm initialData={color} />
      </div>
    </div>
  ) 
};

export default ColorPage;
