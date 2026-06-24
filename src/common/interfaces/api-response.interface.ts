export interface ApiResponse<TData, TMeta = undefined> {
  success: boolean;
  message: string;
  meta?: TMeta;
  data: TData;
}
