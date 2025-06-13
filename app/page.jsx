import HomeWrapper from "@/components/wrapper/home";

export const metadata = {
  title: "Google Analytics 360, Adobe Analytics Services, Marketing Automation Managed Services",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}`,
  },
}

export default async function Home({ searchParams }) {

  const resolvedSearchParams = await searchParams;
  const preview = resolvedSearchParams.preview ? true : false;
  console.log("preview: ", preview)

  return (
    <>
      <HomeWrapper preview={preview} />
    </>
  );
}
