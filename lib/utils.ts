import { clsx, type ClassValue } from "clsx"
import { NextResponse } from "next/server";
import { twMerge } from "tailwind-merge"
import { GenericResponse } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const genericResponse = ({ success, data = null, message, status, error = null }: GenericResponse) => {
  return NextResponse.json({
    status: success ? 'success' : 'error',
    data,
    message,
    error
  }, { status })
}

export const priceFormatter = new Intl.NumberFormat("en-in", {
  style: "currency",
  currency: "INR"
})