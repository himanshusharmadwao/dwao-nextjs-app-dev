import { getRevalidateTime } from "@/libs/utils";

export const getServiceData = async (preview = false, slug) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/service-pages?populate[0]=banner.trustedBrands&populate[1]=section.card.icon&populate[2]=InfoPanel.InfoPanel.logo&populate[3]=InfoPanel.InfoPanel.keyStats.icon&populate[4]=clientTestimonial.testimonial.image&populate[5]=faq&populate[6]=faq.faq&populate[7]=seo&filters[slug][$eq]=${slug}&${preview ? 'status=draft' : ''}`,
      { next: { revalidate: getRevalidateTime(preview) } }
    );

    if (!response.ok) throw new Error(`Failed: ${response.status}`);

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const submitLeadForm = async (formData) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/lead-forms`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: formData }),
        cache: 'no-store',
      }
    );

    if (!response.ok) throw new Error(`Failed: ${response.status}`);

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
