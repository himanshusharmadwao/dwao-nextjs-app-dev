import { getRevalidateTime } from "@/libs/utils";

export const getAboutData = async (preview = false) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/about?populate[0]=bannerDeskImage&populate[1]=bannerMobileImage&populate[2]=valueVisual&populate[3]=intro.image&populate[4]=workPlace.image&populate[5]=partner.image&populate[6]=service.image&populate[7]=industry.image&populate[8]=impact.image&populate[9]=expert.image&populate[10]=demoOverlay.image&populate[11]=seo&populate[12]=seo.openGraph&populate[13]=seo.openGraph.ogImage&populate[14]=clientsSlide&populate[15]=clientsSlide.entity&populate[16]=clientsSlide.entity.logo&${preview ? 'status=draft' : ''}`,
      {
        next: { revalidate: getRevalidateTime(preview) },
      }
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

export const getReachOutUI = async (preview = false) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/reach-out-uis`,
      {
        next: { revalidate: getRevalidateTime(preview) },
      }
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
