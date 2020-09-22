import { AxiosResponse, AxiosError } from "axios";

type testAxiosError = Error & { status?: number; data?: any };

/** Intercepts an axios response and extracts the `data` property */
export function extractAxiosData(response: AxiosResponse): any {
  return response.data;
}

/** Intercepts an axios error to provide clearer error logging */
export function handleAxiosError(err: AxiosError): Promise<never> {
  // Extract error data
  const { response } = err;
  const { status, data } = response as AxiosResponse;

  // Create custom error
  const error: testAxiosError = new Error(
    `Status ${status}: ${JSON.stringify(data.message)}`
  );
  error.status = status;
  error.data = data;

  return Promise.reject(error);
}
