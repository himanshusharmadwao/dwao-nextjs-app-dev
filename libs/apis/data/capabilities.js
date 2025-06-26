import { getRevalidateTime } from "@/libs/utils";

export const getCapability = async (preview = false, type, slug) => {
  // console.log("slug: ", slug);
  // console.log("type: ", type);
  try {
    // const response = await fetch(
    //   `${process.env.NEXT_PUBLIC_API_BASE_URL}/capabilities?populate[thumbnail][populate]=*&populate[featuredImage][populate]=*&populate[category][populate]=*&populate[sub_category][populate]=*&populate[section][populate][visual][populate]=*&populate[section][populate][content][populate]=*&populate[seo][populate]=*&${slug !== undefined ? `filters[slug][$eq]=${slug}`: '' }&filters[category][slug][$eqi]=${type}&${preview ? 'status=draft' : ''}`,
    //   {
    //     next: { revalidate: getRevalidateTime(preview) },
    //   }
    // );

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/capabilities?populate[0]=thumbnail&populate[1]=featuredImage&populate[2]=category&populate[3]=sub_category&populate[4]=section.visual&populate[5]=section.content&populate[6]=seo&populate[7]=seo.openGraph&populate[8]=seo.openGraph.ogImage${slug !== undefined ? `&filters[slug][$eq]=${slug}` : ''}${type !== undefined ? `&filters[category][slug][$eqi]=${type}` : ''}${preview ? '&status=draft' : ''}`,
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
      // const relatedResponse = await fetch(
      //   `${process.env.NEXT_PUBLIC_API_BASE_URL}/capabilities?populate[thumbnail][populate]=*&populate[featuredImage][populate]=*&populate[category][populate]=*&populate[sub_category][populate]=*&populate[section][populate][visual][populate]=*&populate[section][populate][content][populate]=*&populate[seo][populate]=*&filters[slug][$ne]=${slug}&filters[category][slug][$eq]=${categorySlug}`,
      //   {
      //     next: { revalidate: getRevalidateTime(preview) },
      //   }
      // );

      const relatedResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/capabilities?populate[0]=thumbnail&populate[1]=featuredImage&populate[2]=category&populate[3]=sub_category&populate[4]=section.visual&populate[5]=section.content&populate[6]=seo&populate[7]=seo.openGraph&populate[8]=seo.openGraph.ogImage&filters[slug][$ne]=${slug}&filters[category][slug][$eq]=${categorySlug}`,
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