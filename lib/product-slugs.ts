import { products, type Product } from "./brands";

/**
 * Descriptive product URLs (SEO): /products/apple/iphone-17-pro instead of
 * /products/apple/a12. Slugs are derived from product names at module load;
 * legacy IDs remain resolvable so old URLs can permanently redirect.
 */

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const slugByBrandAndId = new Map<string, string>();
const productBySlug = new Map<string, Product>();

for (const [brandSlug, brandProducts] of Object.entries(products)) {
  const used = new Set<string>();
  for (const product of brandProducts) {
    let slug = slugify(product.name) || product.id;
    if (used.has(slug)) {
      // Name collision within the brand — suffix with the unique legacy id.
      slug = `${slug}-${slugify(product.id)}`;
    }
    used.add(slug);
    slugByBrandAndId.set(`${brandSlug}/${product.id}`, slug);
    productBySlug.set(`${brandSlug}/${slug}`, product);
  }
}

export function getProductSlug(brandSlug: string, productId: string): string {
  return slugByBrandAndId.get(`${brandSlug}/${productId}`) ?? productId;
}

export function productHref(brandSlug: string, productId: string): string {
  return `/products/${brandSlug}/${getProductSlug(brandSlug, productId)}`;
}

export function resolveProduct(
  brandSlug: string,
  idOrSlug: string,
):
  | { product: Product; canonicalSlug: string; isLegacyId: boolean }
  | undefined {
  const bySlug = productBySlug.get(`${brandSlug}/${idOrSlug}`);
  if (bySlug) {
    return { product: bySlug, canonicalSlug: idOrSlug, isLegacyId: false };
  }
  const legacySlug = slugByBrandAndId.get(`${brandSlug}/${idOrSlug}`);
  if (legacySlug) {
    const product = productBySlug.get(`${brandSlug}/${legacySlug}`);
    if (product) {
      return { product, canonicalSlug: legacySlug, isLegacyId: true };
    }
  }
  return undefined;
}

/** Build-time redirect table: legacy /products/{brand}/{id} -> slug URLs. */
export function getLegacyProductRedirects(): Array<{
  source: string;
  destination: string;
  permanent: boolean;
}> {
  const redirects: Array<{
    source: string;
    destination: string;
    permanent: boolean;
  }> = [];
  for (const [brandSlug, brandProducts] of Object.entries(products)) {
    for (const product of brandProducts) {
      const slug = getProductSlug(brandSlug, product.id);
      if (slug !== product.id) {
        redirects.push({
          source: `/products/${brandSlug}/${product.id}`,
          destination: `/products/${brandSlug}/${slug}`,
          permanent: true,
        });
      }
    }
  }
  return redirects;
}

export function getAllProductParams(): Array<{ brand: string; id: string }> {
  const params: Array<{ brand: string; id: string }> = [];
  for (const [brandSlug, brandProducts] of Object.entries(products)) {
    for (const product of brandProducts) {
      params.push({
        brand: brandSlug,
        id: getProductSlug(brandSlug, product.id),
      });
    }
  }
  return params;
}
