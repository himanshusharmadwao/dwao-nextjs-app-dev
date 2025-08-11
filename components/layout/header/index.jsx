import { getMenu, getRegions, getSecondaryMenu } from "@/libs/apis/data/menu";
import HeaderWrapper from "./HeaderWrapper";

const Header = async ({ preview, region }) => {

  const headerData = await getMenu(preview, region);
  const secMenu = await getSecondaryMenu(preview, region);
  const regions = await getRegions(preview);

  return <HeaderWrapper region={region} headerData={headerData} secMenu={secMenu} regions={regions} />;
};

export default Header;
