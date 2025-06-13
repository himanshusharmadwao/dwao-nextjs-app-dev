import { getRevalidateTime } from "@/libs/utils";

export const getCapability = async (preview = false, slug) => {
  // console.log("slug: ", slug);
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/capabilities?populate[0]=thumbnail&populate[1]=featuredImage&populate[2]=section&populate[3]=section.visual&populate[4]=section.content&populate[5]=seo&filters[slug][$eq]=${slug}&${preview ? 'status=draft' : ''}`,
      {
        next: { revalidate: getRevalidateTime(preview) },
      }
    );

    if (!response.ok) throw new Error(`Failed: ${response.status}`);

    const capabilityData = await response.json();

    const mainCapability = capabilityData?.data?.[0];
    if (!mainCapability) return null;

    // 2. Extract the category of the main capability
    const category = mainCapability.category;

    // 3. Fetch related capabilities (same category, different slug)
    let related = [];
    if (category) {
      const relatedResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/capabilities?populate[0]=thumbnail&populate[1]=featuredImage&populate[2]=section&populate[3]=section.visual&populate[4]=section.content&populate[5]=seo&filters[slug][$ne]=${slug}&filters[category][$eq]=${category}`,
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