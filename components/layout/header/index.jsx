import { getMenu, getSecondaryMenu } from "@/libs/apis/data/menu";
import HeaderWrapper from "./HeaderWrapper";

const Header = async ({ pathname }) => {

  const headerData = await getMenu();
  const secMenu = await getSecondaryMenu();

  return <HeaderWrapper pathname={pathname} headerData={headerData} secMenu={secMenu} />;
};

export default Header;
