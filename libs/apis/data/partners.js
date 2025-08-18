import { getRevalidateTime } from "@/libs/utils";

export const getPartner = async (preview = false, slug = '', region = "default") => {
  
  try {
    let baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/capabilities?` +
      `populate[0]=thumbnail&populate[1]=featuredImage&populate[2]=category` +
      `&populate[3]=sub_category&populate[4]=section.visual&populate[5]=section.content` +
      `&populate[6]=seo&populate[7]=seo.openGraph&populate[8]=seo.openGraph.ogImage`;

    if (slug) baseUrl += `&filters[slug][$eq]=${slug}`;
    if (preview) baseUrl += `&status=draft`;
    if (region) baseUrl += `&filters[regions][slug][$eq]=${region}`;

    let response = await fetch(baseUrl, {
      next: { revalidate: getRevalidateTime(preview) },
    });

    let finalResponse = await response.json();
    let mainCapability = finalResponse?.data?.[0];

    if (!mainCapability) {
      baseUrl = baseUrl.replace(
        `filters[regions][slug][$eq]=${region}`,
        `filters[regions][slug][$eq]=default`
      );
      response = await fetch(baseUrl, { next: { revalidate: getRevalidateTime(preview) } });
      finalResponse = await response.json();
      mainCapability = finalResponse?.data?.[0];
    }

    if (!finalResponse?.data) return null;

    const categorySlug = mainCapability?.category?.slug;
    let related = [];

    if (categorySlug) {
      let relatedUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/capabilities?` +
        `populate[0]=thumbnail&populate[1]=featuredImage&populate[2]=category` +
        `&populate[3]=sub_category&populate[4]=section.visual&populate[5]=section.content` +
        `&populate[6]=seo&populate[7]=seo.openGraph&populate[8]=seo.openGraph.ogImage` +
        `&filters[slug][$ne]=${slug}&filters[category][slug][$eq]=${categorySlug}`;

      if (region) relatedUrl += `&filters[regions][slug][$eq]=${region}`;
      if (preview) relatedUrl += `&status=draft`;

      const relatedResponse = await fetch(relatedUrl, {
        next: { revalidate: getRevalidateTime(preview) },
      });

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
