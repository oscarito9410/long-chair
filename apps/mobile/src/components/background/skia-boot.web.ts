import { LoadSkiaWeb } from "@shopify/react-native-skia/lib/module/web/LoadSkiaWeb";

export async function bootSkia(): Promise<void> {
  await LoadSkiaWeb();
}
