import { getRevalidateTime } from "@/libs/utils";

export const getReviews = async (preview = false) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/reviews-mat?${preview ? 'status=draft' : ''}`,
      { next: { revalidate: getRevalidateTime(preview) } }
    );

    if (!response.ok) throw new Error(`Failed: ${response.status}`);

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
