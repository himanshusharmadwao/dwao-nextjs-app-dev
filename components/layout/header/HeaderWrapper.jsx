"use client";

import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import styles from "./Header.module.css";
import MobileHeader from "./mobile";
import Image from "next/image";
import AnchorLink from "react-anchor-link-smooth-scroll";
import { usePathname, useRouter } from "next/navigation";
import { checkRegionData, getNormalizedPath, buildRegionalPath } from "@/libs/utils";

const HeaderWrapper = ({ region, headerData, secMenu, regions }) => {

  // console.log("headerData: ", headerData)
  // console.log("secMenu: ", secMenu)
  // console.log("regions: ", regions)

  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const regionRef = useRef(null);
  const [selectedRegion, setSelectedRegion] = useState();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const headerRef = useRef(null);
  const progressRef = useRef(null);

  const pathname = usePathname();
  const router = useRouter();

  // add near other refs
  const isCheckingRef = useRef(false);

  useEffect(() => {
    if (!regions?.data?.length || !pathname || isCheckingRef.current) return;

    const doCheck = async () => {
      isCheckingRef.current = true;
      try {
        const normalized = getNormalizedPath(pathname, regions); 
        const slugFromUrl = pathname.split('/')[1] || null;
        const regionList = regions.data;
        const knownSlugs = new Set(regionList.map(r => r.slug));

        if (slugFromUrl && knownSlugs.has(slugFromUrl)) {
          if (slugFromUrl === "in-en") {
            router.replace(`${process.env.NEXT_PUBLIC_DWAO_DOMESTIC_URL}/${normalized.replace(/^\//, "")}`);
            return;
          }

          const matched = regionList.find(r => r.slug === slugFromUrl);
          const exists = await checkRegionData(slugFromUrl, normalized);

          if (!exists) {
            router.replace(normalized);
            setSelectedRegion(regionList.find(r => r.slug === "default") || null);
          } else {
            setSelectedRegion(matched || null);
          }
          return;
        }

        const defaultRegion = regionList.find(r => r.slug === "default") || null;
        setSelectedRegion(defaultRegion);
      } catch (e) {
      } finally {
        isCheckingRef.current = false;
      }
    };

    void doCheck();
  }, [pathname, regions, router]);


  // useEffect(() => {
  //   const slugFromUrl = pathname.split('/')[1];

  //   const matchedRegion = regions?.data?.find((region) => region.slug === slugFromUrl);

  //   if (matchedRegion) {

  //     if (matchedRegion.slug === "in-en") {
  //       router.push(`${process.env.NEXT_PUBLIC_DWAO_DOMESTIC_URL}/${getNormalizedPath(pathname, regions)}`)
  //       return;
  //     }

  //     setSelectedRegion(matchedRegion);
  //   } else {
  //     const defaultRegion = regions?.data?.find(region => region.slug === "default");

  //     setSelectedRegion(defaultRegion || null);
  //   }

  // }, [pathname, regions]);

  // const handleSelectRegion = (region) => {

  //   if (region.slug === "in-en") {
  //     router.push(`${process.env.NEXT_PUBLIC_DWAO_DOMESTIC_URL}/${getNormalizedPath(pathname, regions)}`)
  //     return;
  //   }

  //   setSelectedRegion(region);
  //   setIsRegionOpen(false);

  //   const currentPath = pathname.startsWith('/') ? pathname : `/${pathname}`;

  //   const regionsHref = regions.data.map(r => r.slug);
  //   const pathParts = currentPath.split("/").filter(Boolean);

  //   const isRegionPrefixed = regionsHref.includes(pathParts[0]);
  //   const cleanedPath = isRegionPrefixed ? pathParts.slice(1).join("/") : pathParts.join("/");

  //   const newPath =
  //     !region.slug || region.slug.toLowerCase() === "default"
  //       ? `/${cleanedPath}`
  //       : `/${region.slug}${cleanedPath ? `/${cleanedPath}` : ""}`;

  //   router.push(newPath);
  // };

  const handleSelectRegion = async (region) => {

    // If region is "in-en", handle domestic URL redirection
    if (region.slug === "in-en") {
      router.push(`${process.env.NEXT_PUBLIC_DWAO_DOMESTIC_URL}/${getNormalizedPath(pathname, regions).replace(/^\//, "")}`);
      return;
    }

    setIsRegionOpen(false);

    const currentPath = pathname.startsWith('/') ? pathname : `/${pathname}`;

    console.log("currentPath: ", currentPath)
    console.log("normalizedPath: ", `${getNormalizedPath(pathname, regions)}`)



    // Check if the region-specific data exists
    const dataExists = await checkRegionData(region.slug, `${getNormalizedPath(pathname, regions)}`);

    console.log("dataExists: ", dataExists)

    // If region-specific data exists, update the URL to include the region
    if (dataExists) {
      setSelectedRegion(region);
      const normalized = getNormalizedPath(pathname, regions);
      const regionPrefix = region.slug === "default" ? "" : `/${region.slug}`;
      const newPath = `${regionPrefix}${normalized}`;
      router.push(newPath);
    } else {
      const cleanedPath = getNormalizedPath(pathname, regions)
        .split("/")
        .filter(Boolean)
        .join("/");
      router.push(`/${cleanedPath}`);
    }
  };

  const normalizedPath = getNormalizedPath(pathname, regions);

  const isHome = normalizedPath === "/";
  const isCulturePage = normalizedPath === "/about/culture";
  const isBlogPage = normalizedPath === "/blog";
  const isInsightsCaseStudies = normalizedPath === "/case-studies";
  const isReview = normalizedPath.includes("/reviews");
  const isPartner = normalizedPath === "/partners";

  // to get capabilities hrefs - memoized for performance
  const getCapabilitiesHrefs = useCallback((headerData) => {
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
  }, []);

  // Memoize capability URLs to avoid recalculation on every render
  const capabilityUrl = useMemo(() => getCapabilitiesHrefs(headerData), [headerData, getCapabilitiesHrefs]);

  const isCapability = useMemo(() => capabilityUrl.some((key) => normalizedPath.includes(key)), [capabilityUrl, pathname]);

  // to toggle menu
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // Memoize handleScroll to prevent recreating on every render
  const handleScroll = useCallback(() => {
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
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener('scroll', handleScroll);
      handleScroll();

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleScroll]);

  const primaryMenu = headerData.data.find((item) => item.name === "PrimaryMenu")?.menu || [];

  // map current URL to secMenu page

  const getPageFromUrl = () => {
    if (normalizedPath === '/') return 'home';
    if (normalizedPath === '/about') return 'about';
    if (normalizedPath.includes('/case-studies')) return 'insights';
    if (normalizedPath.includes('/reviews')) return '';
    if (normalizedPath === '/partners') return '';
    if (isCapability) return 'capability';

    return '';
  };

  const currentPage = getPageFromUrl();
  const currentMenu = secMenu?.data?.find((item) => item.page === currentPage)?.menu || [];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (regionRef.current && !regionRef.current.contains(event.target)) {
        setIsRegionOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


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
              <Link prefetch={false} href={buildRegionalPath("/", region, regions?.data)}>DWAO</Link>
            </div>
            <ul>
              {primaryMenu.map((mainItem) => (
                <li key={mainItem.id}>
                  <Link prefetch={false}
                    href={buildRegionalPath(mainItem.linkHref, region, regions?.data)}
                    className={`text-[var(--color-con-gray)] hover:text-white transition-all duration-300`}
                  >
                    {mainItem.linkTitle}
                  </Link>
                  {mainItem.subMenu.length > 0 && (
                    <ul>
                      {mainItem.subMenu.map((subItem) => (
                        <li key={subItem.id} className={subItem.subSubMenu.length > 0 ? "" : ""}>
                          <Link prefetch={false}
                            href={buildRegionalPath(subItem.linkHref, region, regions?.data)}
                            className={subItem.subSubMenu.length > 0 ? styles.submenu : ""}
                          >
                            {subItem.linkTitle}
                          </Link>
                          {subItem.subSubMenu.length > 0 && (
                            <ul>
                              {subItem.subSubMenu.map((subSubItem) => (
                                <li key={subSubItem.id}>
                                  <Link prefetch={false} href={buildRegionalPath(subSubItem.linkHref, region, regions?.data)}>{subSubItem.linkTitle}</Link>
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

            <div ref={regionRef} className="region relative inline-block text-left text-[15px]">
              {/* Trigger */}
              <div
                className={`flex gap-2 items-center text-white cursor-pointer ${styles.regionTrigger}`}
                onClick={() => setIsRegionOpen((prev) => !prev)}
              >
                <Image
                  src="/icons/globe-white.svg"
                  height={18}
                  width={18}
                  alt="Expand"
                />
                <span>{selectedRegion?.slug}</span>
                <Image
                  src="/icons/caret-down-white.svg"
                  height={20}
                  width={20}
                  alt="Expand"
                />
              </div>
              {/* Dropdown */}
              {isRegionOpen && (
                <div className={`absolute right-[0px] mt-2 z-50 bg-white w-60 h-64 overflow-y-auto rounded-md shadow-md border border-gray-200 space-y-2 p-3 ${styles.regionList}`}>
                  {[...regions.data]
                    .sort((a, b) => (a.slug === "default" ? -1 : b.slug === "default" ? 1 : 0))
                    .map((region) => (
                      <span
                        key={region.id}
                        className="block text-gray-700 cursor-pointer hover:bg-gray-100 border-b-[0.2px] px-2 py-1"
                        onClick={() => handleSelectRegion(region)}
                      >
                        {region.name}
                      </span>
                    ))}
                </div>
              )}
            </div>
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
      <MobileHeader MenuStructure={primaryMenu} isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} region={region} regions={regions} />
    </>
  );
};

export default HeaderWrapper;