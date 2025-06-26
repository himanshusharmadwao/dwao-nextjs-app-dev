"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import styles from "./Header.module.css";
import MobileHeader from "./mobile";
import Image from "next/image";
import AnchorLink from "react-anchor-link-smooth-scroll";
import { usePathname } from "next/navigation";

const HeaderWrapper = ({headerData, secMenu}) => {

  // console.log("headerData: ", headerData)
  // console.log("secMenu: ", secMenu)

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const headerRef = useRef(null);
  const progressRef = useRef(null);

  const pathname = usePathname();

  const isHome = pathname === "/";
  const isCulturePage = pathname === "/about/culture";
  const isBlogPage = pathname === "/blog";
  const isInsightsCaseStudies = pathname === "/case-studies";
  const isReview = pathname.includes("/reviews");
  const isPartner = pathname === "/partners";

  // to get capabilities hrefs

  const getCapabilitiesHrefs = (headerData) => {
    const primaryMenu = headerData.data.find((item) => item.name === "PrimaryMenu");

    if (!primaryMenu) return [];

    const capabilitiesMenu = primaryMenu.menu.find((item) => item.linkTitle === "Capabilities");

    if (!capabilitiesMenu) return [];

    const hrefs = capabilitiesMenu.subMenu.reduce((acc, subMenuItem) => {
      acc.push(subMenuItem.linkHref);

      if (subMenuItem.subSubMenu && subMenuItem.subSubMenu.length > 0) {
        const subSubMenuHrefs = subMenuItem.subSubMenu.map((subSubMenuItem) => subSubMenuItem.linkHref);
        acc.push(...subSubMenuHrefs);
      }

      return acc;
    }, []);

    return hrefs;
  };

  // to examine wheather the url contains anything which has capability url
  const capabilityUrl = getCapabilitiesHrefs(headerData);
  // console.log(capabilityUrl);
  const isCapability = capabilityUrl.some((key) => pathname.includes(key));


  // to toggle menu
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  
  const handleScroll = () => {
    const header = headerRef.current;
    const progress = progressRef.current;
    if (!header || !progress) return;

    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollPercentage = (scrollPosition / (documentHeight - windowHeight)) * 100;

    if (scrollPosition > 10) {
      header.classList.add(styles.active);
      progress.style.width = `${scrollPercentage}%`;
      progress.style.opacity = "1";
    } else {
      header.classList.remove(styles.active);
      progress.style.width = "1%";
      progress.style.opacity = "0";
    }

    progress.setAttribute("aria-valuenow", scrollPercentage.toFixed(0));
  };

  if (typeof window !== "undefined") {
    window.onscroll = handleScroll;
  }

  const primaryMenu = headerData.data.find((item) => item.name === "PrimaryMenu")?.menu || [];
  // const secondaryMenu = headerData.data.find((item) => item.name === "SecondaryMenu")?.menu || [];

  // map current URL to secMenu page
  const getPageFromUrl = () => {
    if (pathname === '/') return 'home';
    if (pathname === '/about') return 'about';
    if (pathname.includes('/insights-and-case-studies')) return 'insights';
    if (pathname.includes('/reviews')) return '';
    if (pathname === '/partners') return '';
    if (isCapability) return 'capability';
    // return 'home';
  };

  const currentPage = getPageFromUrl();
  const currentMenu = secMenu?.data?.find((item) => item.page === currentPage)?.menu || [];

  return (
    <>
      <header
        ref={headerRef}
        className={`${styles.header} ${isCulturePage || isBlogPage || isInsightsCaseStudies || isReview ? styles.secondaryPage : ""}`}
      >
        <div className={styles.topMenu}>
          <nav id="cssmenu" className={styles.cssmenu}>
            <div className={`lg:hidden flex items-center h-14 ${styles.mobileBar}`} onClick={toggleMenu}>
              <Image
                src="/icons/bar.svg"
                height={24}
                width={24}
                alt="menu icon"
                className={`${isCulturePage || isBlogPage || isInsightsCaseStudies || isReview ? "!filter-none" : ""}`}
              />
            </div>
            <div className={styles.logo}>
              <Link prefetch={false} href="/">DWAO</Link>
            </div>
            <ul>
              {primaryMenu.map((mainItem) => (
                <li key={mainItem.id}>
                  <Link prefetch={false} 
                    href={mainItem.linkHref}
                    className={`text-[var(--color-con-gray)] hover:text-white transition-all duration-300`}
                  >
                    {mainItem.linkTitle}
                  </Link>
                  {mainItem.subMenu.length > 0 && (
                    <ul>
                      {mainItem.subMenu.map((subItem) => (
                        <li key={subItem.id} className={subItem.subSubMenu.length > 0 ? "" : ""}>
                          <Link prefetch={false}
                            href={subItem.linkHref}
                            className={subItem.subSubMenu.length > 0 ? styles.submenu : ""}
                          >
                            {subItem.linkTitle}
                          </Link>
                          {subItem.subSubMenu.length > 0 && (
                            <ul>
                              {subItem.subSubMenu.map((subSubItem) => (
                                <li key={subSubItem.id}>
                                  <Link prefetch={false} href={subSubItem.linkHref}>{subSubItem.linkTitle}</Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {secMenu ? (
          currentMenu.length > 0 ? (
            <div className={`hidden lg:block ${styles.homeNavParent}`}>
              <div className={`container ${styles.homeNav}`}>
                <ul>
                  {currentMenu.map((item) => (
                    <li key={item.id}>
                      <AnchorLink href={item.linkHref} offset={145}>
                        {item.linkTitle}
                      </AnchorLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null
        ) : (
          <div>Loading menu...</div>
        )}

        <div
          ref={progressRef}
          className={styles.progress}
          role="progressbar"
          aria-label="Page Scroll Progress"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow="0"
        ></div>
      </header>
      <MobileHeader MenuStructure={primaryMenu} isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
    </>
  );
};

export default HeaderWrapper;