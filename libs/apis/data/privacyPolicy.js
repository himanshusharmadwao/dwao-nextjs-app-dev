import { getRevalidateTime } from "@/libs/utils";

export const getPolicy = async (preview = false) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/privacy-policy?populate[0]=bannerDeskImage&populate[1]=bannerMobileImage&populate[2]=seo&populate[3]=seo.openGraph&populate[4]=seo.openGraph.ogImage&${preview ? 'status=draft' : ''}`,
      { next: { revalidate: getRevalidateTime(preview) } }
    );

    if (!response.ok) throw new Error(`Failed: ${response.status}`);

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
