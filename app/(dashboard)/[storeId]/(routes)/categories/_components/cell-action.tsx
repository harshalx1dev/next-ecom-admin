"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CategoryColumn } from "./columns";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import axios from "axios";
import { AlertModal } from "@/components/modals/alert-modal";

interface CellActionProps {
  data: CategoryColumn;
}

export const CellAction = ({ data }: CellActionProps) => {
  const navRouter = useRouter();
  const { storeId } = useParams();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { id: categoryId, } = data;

  const onCopy = () => {
    navigator.clipboard.writeText(categoryId);
    toast.success("Category ID copied to clipboard.");
  };

  const onUpdate = () => {
    navRouter.push(`/${storeId}/categories/${categoryId}`);
  };

  const onDelete = () => {
    startTransition(async () => {
      try {
        const deleteCategoryRes = await axios.delete(
          `/api/${storeId}/categories/${categoryId}`
        );

        if (deleteCategoryRes.status != 200) {
          console.log(deleteCategoryRes);
          throw new Error("Something went wrong!");
        }

        const responseData = deleteCategoryRes.data;

        if (responseData.status != "success") {
          console.log(responseData);
          throw new Error("Something went wrong!");
        }

        setOpen(false);
        navRouter.refresh();
        toast.success("Category deleted successfully!");
      } catch (error) {
        console.log("CATEGORY_FORM_DELETE", error);
        toast.error("Something went wrong!");
      }
    });
  };

  return (
    <>
      <AlertModal open={open} loading={isPending} onClose={() => setOpen(false)} onConfirm={onDelete} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} className="p-0 w-8 h-8 cursor-pointer">
            <span className="sr-only">Open Menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem className="cursor-pointer" onClick={onUpdate}>
            <Edit className="mr-2 h-4 w-4" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={onCopy}>
            <Copy className="mr-2 h-4 w-4" />
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
