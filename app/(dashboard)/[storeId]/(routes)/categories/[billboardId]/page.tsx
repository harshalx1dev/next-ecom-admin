import { ecomDb } from "@/lib/ecom-db";
import { BillboardsForm } from "../_components/billboards-form";

const BillboardPage = async ({ params }: { params: Promise<{ billboardId: string }> }) => {
  const { billboardId } = await params;

  const billboard = await ecomDb.billboard.findUnique({
    where: { id: billboardId }
  });



  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardsForm initialData={billboard} />
      </div>
    </div>
  ) 
};

export default BillboardPage;
