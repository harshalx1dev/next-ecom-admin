export interface GenericResponse {
  success: boolean;
  data?: [] | object | string | null;
  message: string;
  status: number;
  error?: Error | null;
}