import { ApiAlert } from "./api-alert"
import { useParams } from "next/navigation";

interface ApiListProps {
  entityName: string;
  entityNameId: string;
}

export const ApiList = ({ entityName, entityNameId }: ApiListProps) => {
  const { storeId } = useParams();
  
  const baseUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/${storeId}`
  
  return (
    <>
      <ApiAlert title="GET" description={`${baseUrl}/${entityName}`} variant="public" />
      <ApiAlert title="GET" description={`${baseUrl}/${entityName}/{${entityNameId}}`} variant="public" />
      <ApiAlert title="POST" description={`${baseUrl}/${entityName}`} variant="admin" />
      <ApiAlert title="PATCH" description={`${baseUrl}/${entityName}/{${entityNameId}}`} variant="admin" />
      <ApiAlert title="DELETE" description={`${baseUrl}/${entityName}/{${entityNameId}}`} variant="admin" />
    </>
  )
}