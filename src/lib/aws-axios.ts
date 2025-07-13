import { AwsClient } from "aws4fetch";

const accessKeyId = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY!;
const secretAccessKey = process.env.NEXT_PUBLIC_AWS_AUTH_SECRET!;
const region = process.env.NEXT_PUBLIC_AWS_REGION!;
const service = process.env.NEXT_PUBLIC_AWS_ADMIN_HOST!;

export async function signAndRequest(
  method: string,
  headers: Record<string, string>,
  hostname: string,
  path: string,
  body?: Record<string, unknown>
) {
  const url = `https://${hostname}${path}`;
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  };

  const client = new AwsClient({
    accessKeyId,
    secretAccessKey,
    region,
  });

  const maxRetries = 3;
  let lastError: unknown;
  let response: Response | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      response = await client.fetch(url, options);

      if (response.ok) {
        break;
      }

      // Only retry if it's a 5xx error.
      if (response.status >= 500 && response.status < 600) {
        if (attempt < maxRetries) {
          console.warn(
            `Request to ${url} returned ${response.status} (5xx error). Retrying ${attempt}/${maxRetries}...`
          );
          continue;
        }
      }
      // For non-5xx errors, don't retry.
      break;
    } catch (err) {
      lastError = err;
      if (attempt < maxRetries) {
        console.warn(
          `Network error on attempt ${attempt}/${maxRetries}: ${err}. Retrying...`
        );
        continue;
      }
      throw err;
    }
  }

  if (!response) {
    throw new Error("Failed to make request: no response object");
  }

  let data: any;
  try {
    data = await response.json();
  } catch (err) {
    data = null;
  }

  return {
    status: response.status,
    ok: response.ok,
    data,
    headers: response.headers,
  };
}
