import { CreatePrednaskyImageComponent } from "../../features/opengraph-images/prednasky";
import { OpenGraphImageResponse } from "../../lib/opengraph";

export async function GET() {
  const component = await CreatePrednaskyImageComponent();
  return OpenGraphImageResponse(component);
}
