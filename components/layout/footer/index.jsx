import Column from './columns/index';
import LegalLinks from './legalLinks/index';
import SocialIcons from './socialIcons/index';
import QuickLinks from './quickLinks/index';
import CompanyInfo from './companyInfo';
import { getLegalMenu, getMenu, getQuickLinks, getRegions } from '@/libs/apis/data/menu';
import Newsletter from './newsletter';
import Link from 'next/link';
import { buildRegionalPath } from '@/libs/utils';

const Footer = async ({ preview, region }) => {

  const regions = await getRegions();

  // Helper function to get region-specific menu data
  const getRegionSpecificMenuData = (menuData, currentRegion = "default") => {
    if (!menuData?.data) return null;

    // Find the PrimaryMenu item
    const primaryMenu = menuData.data.find(item =>
      item.name === "PrimaryMenu"
    );

    return primaryMenu;
  };

  let menuData = { data: [] };

  try {
    menuData = await getMenu(preview, region);
  } catch (error) {
    console.error("Failed to fetch menu data:", error);
  }

  const legalMenu = await getLegalMenu(preview, region);
  const quickLinks = await getQuickLinks(preview, region);

  const socialLinks = [
    {
      title: "Twitter",
      icon: "/icons/fa-twitter.svg",
      href: "#"
    },
    {
      title: "LinkedIn",
      icon: "/icons/fa-linkedin.svg",
      href: "#"
    }
  ];

  return (
    <footer className="bg-black text-white py-[5rem]">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-10 lg:gap-4">
          {/* First Column */}
          <div className="mb-4 lg:mb-0 col-span-4">
            <div className='lg:w-[80%] w-full lg:text-left text-center'>
              <CompanyInfo preview={preview} regions={regions} region={region} />
              <Newsletter />
            </div>
          </div>

          <div className="col-span-6 lg:mt-0 mt-10">
            <div className="grid grid-cols-5">
              {/* Second Column */}
              <div className='col-span-2'>
                <QuickLinks data={quickLinks?.data[0]?.menu} regions={regions} region={region} />
              </div>

              {/* Third Column */}
              <div className='col-span-2'>
                {(() => {
                  const regionSpecificMenu = getRegionSpecificMenuData(menuData, region);
                  const capabilitiesItem = regionSpecificMenu?.menu?.find(item => item.linkTitle === "Capabilities");
                  if (capabilitiesItem?.subMenu) {
                    return (
                      <div>
                        <h3 className="font-semibold lg:mb-4 mb-1">Capabilities</h3>
                        <ul className="lg:space-y-4 space-y-1 text-con">
                          {capabilitiesItem.subMenu.map((link) => (
                            <li key={link.id}>
                              <Link
                                className="transition-all duration-100 text-[var(--color-con-gray)] hover:text-white"
                                href={buildRegionalPath(link.linkHref, region, regions.data)}
                              >
                                {link.linkTitle}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>

              {/* Fourth Column */}
              <div className="flex justify-end col-span-1">
                {(() => {
                  const regionSpecificMenu = getRegionSpecificMenuData(menuData, region);
                  const partnersItem = regionSpecificMenu?.menu?.find(item => item.linkTitle === "Partners");
                  if (partnersItem?.subMenu) {
                    return (
                      <div>
                        <h3 className="font-semibold lg:mb-4 mb-1">Partners</h3>
                        <ul className="lg:space-y-4 space-y-1 text-con">
                          {partnersItem.subMenu.map((link) => (
                            <li key={link.id}>
                              <Link
                                className="transition-all duration-100 text-[var(--color-con-gray)] hover:text-white"
                                href={buildRegionalPath(link.linkHref, region, regions.data)}
                              >
                                {link.linkTitle}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* Legal and Social Links */}
        <div className="mt-14 border-t border-gray-700 pt-4 grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
          <LegalLinks data={legalMenu?.data?.find(item => item.name === "legal")?.menu} regions={regions} region={region} />

          <SocialIcons links={socialLinks} />
        </div>
      </div>
    </footer>
  );
};

export default Footer