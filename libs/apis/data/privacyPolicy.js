import { getRevalidateTime } from "@/libs/utils";

export const getPolicy = async (preview = false) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/privacy-policy?populate[0]=bannerDeskImage&populate[1]=bannerMobileImage&populate[2]=seo&populate[3]=seo.openGraph&populate[4]=seo.openGraph.ogImage&${preview ? 'status=draft' : ''}`,
      { next: { revalidate: getRevalidateTime(preview) } }
    );

    const finalResponse = await response.json();

    if (
      finalResponse?.data === null &&
      finalResponse?.error &&
      Object.keys(finalResponse?.error).length > 0
    ) {
      return { data: null, error: finalResponse?.error?.message || "Unknown error" };
    }

    return { data: finalResponse?.data, error: null };
  } catch (error) {
    return { data: null, error: error.message || "Something went wrong" };
  }
};
