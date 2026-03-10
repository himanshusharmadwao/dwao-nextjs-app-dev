"use client"

// import React, { useEffect, useState } from 'react';
import styles from '../Header.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { buildRegionalPath } from '@/libs/utils';
import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { GoGlobe } from "react-icons/go";
import { RxCaretDown } from "react-icons/rx";
import { getNormalizedPath } from "@/libs/utils";

const MobileHeader = ({ MenuStructure, isMenuOpen, toggleMenu, region, regions }) => {
  const [stackedSubMenu, setStackedSubMenu] = useState([]);
  const [openSubSubMenu, setOpenSubSubMenu] = useState(null);
  const [activeMainItem, setActiveMainItem] = useState(null);

  const toggleSubMenu = (id) => {
    let clickedItem = null;
    for (const mainItem of MenuStructure) {
      if (mainItem.id === id) {
        clickedItem = mainItem;
        break;
      }
      for (const subItem of (mainItem.subMenu || [])) {
        if (subItem.id === id) {
          clickedItem = subItem;
          break;
        }
      }
    }

    const subMenu = clickedItem?.subMenu || [];
    setStackedSubMenu(subMenu);

    setActiveMainItem(clickedItem?.linkTitle || null);
  };

  const toggleSubSubMenu = (id) => {
    setOpenSubSubMenu((prev) => (prev === id ? null : id));
  };

  // =============================

  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const regionRef = useRef(null);
  const [selectedRegion, setSelectedRegion] = useState();

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const slugFromUrl = pathname.split('/')[1];

    const matchedRegion = regions?.data?.find((region) => region.slug === slugFromUrl);

    if (matchedRegion) {

      if (matchedRegion.slug === "in-en") {
        router.push(`${process.env.NEXT_PUBLIC_DWAO_DOMESTIC_URL}${getNormalizedPath(pathname, regions)}`)
        return;
      }

      setSelectedRegion(matchedRegion);
    } else {
      const defaultRegion = regions?.data?.find(region => region.slug === "default");

      setSelectedRegion(defaultRegion || null);
    }

  }, [pathname, regions]);

  const normalizedPath = getNormalizedPath(pathname, regions);

  const isCulturePage = normalizedPath === "/about/culture";
  const isPartner = normalizedPath.includes("/partners");
  const isService = normalizedPath.includes("/service");
  const isContact = normalizedPath.includes("/contact");
  const isCapability = normalizedPath.includes("/services");

  const isBlogForRegion = normalizedPath.includes("/blog");
  const isInsightsCaseStudiesForRegion = normalizedPath.includes("/case-studies");

  const handleSelectRegion = (region) => {
    if (region.slug === "in-en") {
      if (isCulturePage || isBlogForRegion || isInsightsCaseStudiesForRegion || isCapability || isPartner || isService || isContact) {
        router.push(`${process.env.NEXT_PUBLIC_DWAO_DOMESTIC_URL}`);
      } else {
        router.push(
          `${process.env.NEXT_PUBLIC_DWAO_DOMESTIC_URL}${getNormalizedPath(pathname, regions)}`
        );
      }
      return;
    }

    setSelectedRegion(region);
    setIsRegionOpen(false);

    const currentPath = pathname.startsWith('/') ? pathname : `/${pathname}`;

    const regionsHref = regions.data.map(r => r.slug);
    const pathParts = currentPath.split("/").filter(Boolean);

    const isRegionPrefixed = regionsHref.includes(pathParts[0]);
    const cleanedPath = isRegionPrefixed ? pathParts.slice(1).join("/") : pathParts.join("/");

    const newPath =
      !region.slug || region.slug.toLowerCase() === "default"
        ? `/${cleanedPath}`
        : `/${region.slug}${cleanedPath ? `/${cleanedPath}` : ""}`;

    router.push(newPath);
  };

  return (
    <>
      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ''}`}>
        <div className='mt-[20px]'>
          <div
            onClick={toggleMenu}
            className="text-white absolute left-[30px] top-[20px] bg-white rounded-full flex items-center justify-center !text-black text-[24px]"
          >
            ×
          </div>
          <div ref={regionRef} className={`region absolute right-[20px] top-[30px] inline-block text-left ${isRegionOpen ? styles.dropdownOpen : ''}`}
            onMouseEnter={() => setIsRegionOpen(true)}
            onMouseLeave={() => setIsRegionOpen(false)}
          >
            {/* Trigger */}
            <div
              className={`flex gap-2 items-center justify-center cursor-pointer ${styles.regionTrigger}`}
              onClick={() => setIsRegionOpen((prev) => !prev)}
            >
              <GoGlobe />
              <span className="">{selectedRegion?.name}</span>
              {/* <span className="inline-block lg:hidden">{selectedRegion?.slug}</span> */}
              <RxCaretDown size={22} />
            </div>
            {/* Dropdown */}
            <div className={`absolute right-[0px] z-50 bg-white w-60 overflow-y-auto border border-gray-200 space-y-4 p-6 ${styles.regionList}`}>
              {[...regions.data]
                .sort((a, b) => (a.slug === "default" ? -1 : b.slug === "default" ? 1 : 0))
                .map((region) => (
                  <span
                    key={region.id}
                    className="block w-fit text-gray-700 hover:text-[var(--mainColor)] cursor-pointer"
                    onClick={() => handleSelectRegion(region)}
                  >
                    {region.name}
                  </span>
                ))}
            </div>
          </div>
        </div>
        <ul className={styles.mobileMenuList}>
          {MenuStructure.map((mainItem) => (
            <li key={mainItem.id} className={styles.mobileMenuItem}>
              <div className={styles.mobileMenuItemContent}>
                <Link prefetch={false} href={buildRegionalPath(mainItem.linkHref, region, regions?.data) || '#'} onClick={toggleMenu}>
                  {mainItem.linkTitle}
                </Link>
                {mainItem.subMenu.length > 0 && (
                  <button
                    className={styles.subMenuToggle}
                    onClick={() => toggleSubMenu(mainItem.id)}
                    aria-label="Expand submenu"
                  >
                    <Image
                      src="/icons/left-icon.svg"
                      height={20}
                      width={20}
                      alt="expand submenu"
                      className="rotate-180"
                    />
                  </button>
                )}
              </div>
            </li>
          ))}
          <li className={`${styles.subMenuStack} ${stackedSubMenu.length > 0 ? styles.open : ''}`}>
            <div className={`${styles.goBack} mt-[20px]`} onClick={() => setStackedSubMenu([])}>
              <Image src="/icons/left-icon.svg" height={8} width={8} alt="go back" /> <span className='ms-1'>Back</span>
            </div>
            <div className={`${styles.activeItem} mt-[16px]`}>
              {activeMainItem}
            </div>
            <ul>
              {stackedSubMenu.map((item) => (
                <li key={item.id}>
                  <div className={`${styles.mobileMenuItemContent} !mx-[40px]`}>
                    <Link prefetch={false} href={buildRegionalPath(item.linkHref, region, regions?.data) || '#'} onClick={toggleMenu} className='!px-[20px]'>
                      {item.linkTitle}
                    </Link>
                    {item.subSubMenu?.length > 0 && openSubSubMenu !== item.id && (
                      <button
                        className={styles.subMenuToggle}
                        onClick={() => toggleSubSubMenu(item.id)}
                        aria-label="Expand subsubmenu"
                      >
                        <Image
                          src="/icons/left-icon.svg"
                          height={20}
                          width={20}
                          alt="expand subsubmenu"
                          className="rotate-180"
                        />
                      </button>
                    )}
                  </div>
                  <div className="overflow-hidden" style={{ backgroundColor: '#fff' }}>
                    {item.subSubMenu?.length > 0 && (
                      <div
                        className={`${styles.subSubMenuStack} ${openSubSubMenu === item.id ? styles.open : ''}`}
                      >
                        <div className={styles.goBack} onClick={() => setOpenSubSubMenu(null)}>
                          <Image src="/icons/left-icon.svg" height={8} width={8} alt="go back" /> <span className='ms-4'>Back</span>
                        </div>
                        <ul className="flex flex-col gap-[14px] ms-6">
                          {item.subSubMenu.map((subSubItem) => (
                            <li key={subSubItem.id}>
                              <Link prefetch={false} href={buildRegionalPath(subSubItem.linkHref, region, regions?.data) || '#'} onClick={toggleMenu}>
                                {subSubItem.linkTitle}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>
    </>
  );
};

export default MobileHeader;