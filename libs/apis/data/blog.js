import { getRevalidateTime } from "@/libs/utils";

export const getCategory = async (preview = false) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/blog-categories?populate=*`,
      { next: { revalidate: getRevalidateTime(preview) } }
    );

    if (!response.ok) throw new Error(`Failed: ${response.status}`);

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getBlog = async (preview = false, slug) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs?populate[category][populate]=*&populate[sub_category][populate]=*&populate[author][populate]=*&populate[seo][populate]=*&populate[thumbnail][populate]=*&populate[featuredImage][populate]=*&filters[slug][$eq]=${slug}&${preview ? 'status=draft' : ''}`,
      { next: { revalidate: getRevalidateTime(preview) } }
    );

    if (!response.ok) throw new Error(`Failed: ${response.status}`);

    const blogsData = await response.json();

    const mainBlog = blogsData?.data?.[0];
    if (!mainBlog) return null;

    // 2. Extract the category slug of the main capability
    const categorySlug = mainBlog.category.slug;

    // 3. Fetch related capabilities (same category, different slug)
    let related = [];
    if (categorySlug) {
      const relatedResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs?populate[category][populate]=*&populate[sub_category][populate]=*&populate[author][populate]=*&populate[seo][populate]=*&populate[thumbnail][populate]=*&populate[featuredImage][populate]=*&filters[slug][$ne]=${slug}&filters[category][slug][$eq]=${categorySlug}`,
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
      data: [mainBlog],
      related,
    };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};


export const getAllBlogs = async (preview = false) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs?populate[category][populate]=*&populate[sub_category][populate]=*&populate[author][populate]=*&populate[seo][populate]=*&populate[thumbnail][populate]=*&populate[featuredImage][populate]=*&${preview ? 'status=draft' : ''}`,
      { next: { revalidate: getRevalidateTime(preview) } }
    );

    if (!response.ok) throw new Error(`Failed: ${response.status}`);

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
