import { getRevalidateTime } from "@/libs/utils";

export const getCapability = async (preview = false, type, slug, region = "default") => {
  try {
    let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/capabilities?` +
      `populate[0]=thumbnail&populate[1]=featuredImage&populate[2]=category&populate[3]=sub_category` +
      `&populate[4]=section.visual&populate[5]=section.content&populate[6]=seo` +
      `&populate[7]=seo.openGraph&populate[8]=seo.openGraph.ogImage`;

    if (slug !== undefined) {
      url += `&filters[slug][$eq]=${slug}`;
    } else if (type !== undefined) {
      url += `&filters[slug][$eq]=${type}`;
    }

    if (type !== undefined) {
      url += `&filters[category][slug][$eqi]=${type}`;
    }

    if (region) {
      url += `&filters[regions][slug][$eq]=${region}`;
    }

    if (preview) {
      url += `&status=draft`;
    }

    let response = await fetch(url, {
      next: { revalidate: getRevalidateTime(preview) },
    });


    let finalResponse = await response.json();
    let mainCapability = finalResponse?.data?.[0];

    if (!mainCapability) {
      url = url.replace(
        `filters[regions][slug][$eq]=${region}`,
        `filters[regions][slug][$eq]=default`
      );
      response = await fetch(url, { next: { revalidate: getRevalidateTime(preview) } });
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
        `populate[0]=thumbnail&populate[1]=featuredImage&populate[2]=category&populate[3]=sub_category` +
        `&populate[4]=section.visual&populate[5]=section.content&populate[6]=seo` +
        `&populate[7]=seo.openGraph&populate[8]=seo.openGraph.ogImage` +
        `&filters[slug][$ne]=${slug ?? type}&filters[category][slug][$eq]=${categorySlug}`;

      if (region) {
        relatedUrl += `&filters[regions][slug][$eq]=${region}`;
      }

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
