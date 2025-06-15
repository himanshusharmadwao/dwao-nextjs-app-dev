import PrivacyPolicyWrapper from "@/components/wrapper/privacy-policy";

export const metadata = {
  title: "Privacy Policy",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/privacy-policy`,
  },
}

const PrivacyPolicy = async ({ searchParams }) => {

  const preview = searchParams.preview === "true";
  // console.log("preview: ", preview)

  return (
    <>
      <PrivacyPolicyWrapper preview={preview} />
    </>
  );
};

export default PrivacyPolicy;