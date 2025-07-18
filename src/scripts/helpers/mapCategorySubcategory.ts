// src/scripts/helpers/mapCategorySubcategory.ts
export function mapCategorySubcategory(productName: string) {
  const name = productName.toLowerCase()

  // Business Cards
  if (name.includes("business card")) {
    if (name.includes("foil") || name.includes("kraft") || name.includes("uv") || name.includes("die cut")) {
      return { category: "Business Cards", subcategory: "Specialty" }
    }
    return { category: "Business Cards", subcategory: "Standard" }
  }

  // Large Format
  if (name.includes("banner") || name.includes("coroplast") || name.includes("table cover") || name.includes("vinyl") || name.includes("sign")) {
    return { category: "Large Format", subcategory: "Miscellaneous / Hardware" }
  }

  // Print Products
  if (name.includes("brochure") || name.includes("flyer") || name.includes("booklet") || name.includes("postcard")) {
    return { category: "Print Products", subcategory: "Marketing Collateral" }
  }

  // Stationary
  if (name.includes("letterhead") || name.includes("envelope") || name.includes("ncr") || name.includes("notepad")) {
    return { category: "Stationary", subcategory: "Stationary" }
  }

  // Fallback
  return { category: null, subcategory: null }
}
