export interface GenericResponse {
  success: boolean;
  data?: [] | object | string | null;
  message: string;
  status: number;
  error?: Error | null;
}

export type EmptyPayload = Record<string, never>;

export interface ResponseBody<D = EmptyPayload> {
  status: 'success' | 'error';
  data?: D;
  message: string;
  error?: Error | null;
}

// src/types/api.ts (or lib/types.ts)

// NOTE: When using Prisma's Decimal type, it often comes across the API as a 
// string or is converted to a number. We use 'number | string' for safety.

// ----------------------------------------------------------------------
// 1. CORE API WRAPPER
// ----------------------------------------------------------------------

/**
 * Defines the standard wrapper structure for all successful and error API responses.
 * D is the generic type for the actual data payload.
 */
export interface GenericApiResponse<D> {
    status: 'success' | 'error';
    message: string;
    data: D;
}

// ----------------------------------------------------------------------
// 2. AUTH & ADMIN ENTITIES
// ----------------------------------------------------------------------

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponseData {
    // Data returned upon successful login
    token: string;
    user: User;
}

export interface Store {
    id: string;
    name: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

// ----------------------------------------------------------------------
// 3. CATALOG ENTITIES
// ----------------------------------------------------------------------

export interface Billboard {
    id: string;
    label: string;
    imageUrl: string;
    labelColor: string;
    storeId: string;
    // Relations are omitted unless specifically included in the API response query
    createdAt: Date;
    updatedAt: Date;
}

export interface Category {
    id: string;
    name: string;
    storeId: string;
    billboardId: string;
    // Include relation if the API response is guaranteed to include it
    billboard?: Billboard; 
    createdAt: Date;
    updatedAt: Date;
}

export interface Size {
    id: string;
    storeId: string;
    name: string;
    value: string; // e.g., "S", "M", "L"
    categoryId: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface Color {
    id: string;
    storeId: string;
    name: string;
    value: string; // e.g., "#FF0000"
    createdAt: Date;
    updatedAt: Date;
}

export interface Image {
    id: string;
    productId: string;
    url: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Product {
    id: string;
    storeId: string;
    categoryId: string;
    name: string;
    price: number | string; // Decimal is typically converted to number or string
    isFeatured: boolean;
    isArchived: boolean;
    sizeId: string;
    colorId: string;
    
    // Relations that are often included in API calls
    category?: Category; 
    size?: Size;
    color?: Color;
    images?: Image[];
    
    createdAt: Date;
    updatedAt: Date;
}

export type ProductWithImages = Product & {
    images: Image[];
}

// ----------------------------------------------------------------------
// 4. ORDERING ENTITIES
// ----------------------------------------------------------------------

export interface OrderItem {
    id: string;
    orderId: string;
    productId: string;
    quantity: number | string;
    // product relation is usually included when fetching orders
    product?: Product; 
}

export interface Order {
    id: string;
    storeId: string;
    isPaid: boolean;
    phone: string;
    address: string;
    // orderItems relation is necessary to display the order details
    orderItems: OrderItem[]; 
    createdAt: Date;
    updatedAt: Date;
}