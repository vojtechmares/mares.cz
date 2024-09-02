import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  const apiKey = request.headers.get("X-API-KEY");
  if (apiKey !== process.env.API_KEY) {
    return new Response("Unauthorized", { status: 401 });
  }

  revalidatePath("/blog", "page");

  return new Response("", { status: 200 });
}
