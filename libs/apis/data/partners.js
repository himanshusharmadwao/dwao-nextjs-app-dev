import { getRevalidateTime } from "@/libs/utils";

export const getPartner = async (preview = false, slug = '') => {
  // console.log("slug: ", slug);
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/capabilities?populate[thumbnail][populate]=*&populate[featuredImage][populate]=*&populate[category][populate]=*&populate[sub_category][populate]=*&populate[section][populate][visual][populate]=*&populate[section][populate][content][populate]=*&populate[seo][populate]=*&filters[slug][$eq]=${slug}&${preview ? 'status=draft' : ''}`,
      {
        next: { revalidate: getRevalidateTime(preview) },
      }
    );

    if (!response.ok) throw new Error(`Failed: ${response.status}`);

    const capabilityData = await response.json();

    const mainCapability = capabilityData?.data?.[0];
    if (!mainCapability) return null;

    // 2. Extract the category of the main capability
    const categorySlug = mainCapability.category.slug;

    // 3. Fetch related capabilities (same category, different slug)
    let related = [];
    if (categorySlug) {
      const relatedResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/capabilities?populate[thumbnail][populate]=*&populate[featuredImage][populate]=*&populate[category][populate]=*&populate[sub_category][populate]=*&populate[section][populate][visual][populate]=*&populate[section][populate][content][populate]=*&populate[seo][populate]=*&filters[slug][$ne]=${slug}&filters[category][slug][$eq]=${categorySlug}`,
        {
          next: { revalidate: getRevalidateTime(preview) },
        }
      );

      if (relatedResponse.ok) {
        const relatedData = await relatedResponse.json();
        related = relatedData?.data || [];
      }
    }

    return {
      data: [mainCapability],
      related,
    };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};




// const response = await fetch(
//   `${process.env.NEXT_PUBLIC_API_BASE_URL}/capabilities?populate[featuredImage][populate]=*&populate[thumbnail][populate]=*&populate[section][populate]=*&populate[seo][populate]=*&${preview ? 'status=draft' : ''}`,
//   {
//     next: { revalidate: getRevalidateTime(preview) },
//   }
// );