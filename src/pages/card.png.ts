import { CreateHomepageImageComponent } from "../features/opengraph-images/homepage";
import { OpenGraphImageResponse } from "../lib/opengraph";

export async function GET() {
  const component = await CreateHomepageImageComponent();

  return OpenGraphImageResponse(component);
}
