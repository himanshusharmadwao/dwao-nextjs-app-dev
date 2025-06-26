import { getRevalidateTime } from "@/libs/utils";

export const getContact = async (preview = false) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/contact?populate[0]=bannerDeskImage&populate[1]=bannerMobileImage&populate[2]=offices&populate[3]=officeMap&populate[4]=seo&populate[5]=seo.openGraph&populate[6]=seo.openGraph.ogImage&${preview ? 'status=draft' : ''}`,
      { next: { revalidate: getRevalidateTime(preview) } }
    );

    if (!response.ok) throw new Error(`Failed: ${response.status}`);

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// Fetch Offices
// export const getOffices = async (preview = false) => {
//   try {
//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_API_BASE_URL}/offices`,
//       { next: { revalidate: getRevalidateTime(preview) } }
//     );

//     if (!response.ok) throw new Error(`Failed: ${response.status}`);

//     return await response.json();
//   } catch (error) {
//     console.error("Error:", error);
//     throw error;
//   }
// };

// Fetch Office Map
// export const getOfficeMap = async (preview = false) => {
//   try {
//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_API_BASE_URL}/office-maps?populate[0]=image`,
//       { next: { revalidate: getRevalidateTime(preview) } }
//     );

//     if (!response.ok) throw new Error(`Failed: ${response.status}`);

//     return await response.json();
//   } catch (error) {
//     console.error("Error:", error);
//     throw error;
//   }
// };

// Submit Contact Form
export const submitContactForm = async (formData) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/contact-forms`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: formData }),
        cache: "no-store", // POST - no caching
      }
    );

    if (!response.ok) throw new Error(`Failed: ${response.status}`);

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
