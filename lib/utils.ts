import { clsx, type ClassValue } from "clsx"
import { NextResponse } from "next/server";
import { twMerge } from "tailwind-merge"
import { GenericResponse, ResponseBody, User } from "./types";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

type Method = 'get' | 'post' | 'patch' | 'options' | 'delete';

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
  currency: "USD"
})

export const fetchAxios = async <T = unknown>(
  method: Method,
  route: string,
  body?: Record<string, unknown> | undefined,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  
  const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_URL!}${route}`;
  
  const finalConfig: AxiosRequestConfig = {
    ...config,
    withCredentials: true,
  };

  if (typeof window === 'undefined') {
    const { cookies } = await import("next/headers");
    const cookieHeader = (await cookies()).getAll().map(({ name, value }) => `${name}=${value}`).join('; ');
    finalConfig.headers = {
      ...finalConfig.headers,
      "Cookie": cookieHeader
    }
  }

  let apiRes: AxiosResponse<T>;

  if (['post', 'put', 'patch'].includes(method.toLowerCase())) {
    apiRes = await axios[method](apiUrl, body, finalConfig);
  } else if (['get', 'delete', 'head'].includes(method.toLowerCase())) {
    if (body) {
      finalConfig.params = { ...finalConfig.params, ...body };
    }
    apiRes = await axios[method](apiUrl, finalConfig);
  } else {
    apiRes = await axios[method](apiUrl, finalConfig);
  }

  return apiRes;
};

export const getSession = async () => {
  try {
    const { data } = await fetchAxios<ResponseBody<User>>('get', '/api/auth/session', undefined);
    if (data.status === 'success' && data.data) {
      return { ...data.data, userId: data.data.id };
    }
  } catch (error) {
    console.log(error);
    return { userId: null };
  }
  
  return { userId: null };
}