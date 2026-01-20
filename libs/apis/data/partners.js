import { getRevalidateTime } from "@/libs/utils";

export const getAllPartners = async (page = 1, pageSize = 100, preview = false, region = "default") => {
  try {
    let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/capabilities?` +
      `fields[0]=slug&fields[1]=updatedAt&fields[2]=createdAt` +
      `&populate[category][fields][0]=slug` +
      `&filters[category][slug][$eq]=partners` +
      `&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;

    if (region) {
      url += `&filters[regions][slug][$eq]=${region}`;
    }

    if (preview) {
      url += `&status=draft`;
    }

    const response = await fetch(url, {
      next: { revalidate: getRevalidateTime(preview) },
    });

    const data = await response.json();

    if (data?.error && Object.keys(data?.error).length > 0) {
      return { data: null, error: data?.error?.message || "Something went wrong", status: "error" };
    }

    return {
      data: data?.data || [],
      pagination: data?.meta?.pagination || {},
    };
  } catch (error) {
    console.error("Error fetching all partners:", error);
    throw error;
  }
};

export const getPartner = async (preview = false, slug = 'partners-global', region = "default") => {

  // console.log(preview, slug, region)

  try {
    let baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/capabilities?` +
      `populate[0]=thumbnail&populate[1]=featuredImage&populate[2]=category` +
      `&populate[3]=sub_category&populate[4]=section.visual&populate[5]=section.content` +
      `&populate[6]=seo&populate[7]=seo.openGraph&populate[8]=seo.openGraph.ogImage` +
      `&filters[category][slug][$eq]=partners`;

    if (slug) baseUrl += `&filters[slug][$eq]=${slug}`;
    if (preview) baseUrl += `&status=draft`;
    if (region) baseUrl += `&filters[regions][slug][$eq]=${region}`;

    let response = await fetch(baseUrl, {
      next: { revalidate: getRevalidateTime(preview) },
    });

    let finalResponse = await response.json();
    let mainCapability = finalResponse?.data?.[0];

    // if (!mainCapability) {
    //   baseUrl = baseUrl.replace(
    //     `filters[regions][slug][$eq]=${region}`,
    //     `filters[regions][slug][$eq]=default`
    //   );
    //   response = await fetch(baseUrl, { next: { revalidate: getRevalidateTime(preview) } });
    //   finalResponse = await response.json();
    //   mainCapability = finalResponse?.data?.[0];
    // }

    if (!mainCapability) {
      const fallbackRegion = "default";
      const fallbackSlug = "partners-global";

      baseUrl = baseUrl
        // Replace region
        .replace(
          `filters[regions][slug][$eq]=${region}`,
          `filters[regions][slug][$eq]=${fallbackRegion}`
        )
        // Replace slug
        .replace(
          `filters[slug][$eq]=${slug}`,
          `filters[slug][$eq]=${fallbackSlug}`
        );

      response = await fetch(baseUrl, {
        next: { revalidate: getRevalidateTime(preview) },
      });

      finalResponse = await response.json();
      mainCapability = finalResponse?.data?.[0];
    }

    if (finalResponse?.error && Object.keys(finalResponse?.error).length > 0) {
      return { data: null, error: finalResponse?.error?.message || "Something went wrong", status: "error" };
    }

    if (!finalResponse?.data || finalResponse.data.length === 0) {
      return { data: null, message: "Not Found", status: "not_found" };
    }

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
