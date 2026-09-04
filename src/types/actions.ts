export type ActionResponse<T = void> =
  { success: true; data: T } | { success: false; error: string };
