import { getRevalidateTime } from "@/libs/utils";

export const getMenu = async (preview = false) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/menus?populate[menu][populate][subMenu][populate]=subSubMenu`,
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

export const getSecondaryMenu = async (preview = false) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/secondary-menus?populate[menu][populate][subMenu][populate]=subSubMenu`,
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
