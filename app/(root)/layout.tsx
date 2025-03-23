import { ecomDb } from "@/lib/ecom-db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const SetupLayout = async ({ children }: { children: React.ReactNode }) => {
  const { userId } = await auth();

  if (!userId) return redirect('/sign-in');

  const store = await ecomDb.store.findFirst({
    where: {
      userId
    }
  });

  if (store) return redirect(`/${store.id}`);

  return (
    <>{children}</>
  )
};

export default SetupLayout;