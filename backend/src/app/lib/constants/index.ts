export function createResponse(
  success: boolean,
  message: string,
  props?: Object
) {
  return { success, message, ...props };
}
