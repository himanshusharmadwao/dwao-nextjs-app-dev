"use client";

import React, { useState } from 'react';
import FilterContent from '@/components/common/filter/filterContent';
import Card from '@/components/ui/card';
import Pagination from '@/components/ui/pagination';
import OverlayCard from '@/components/common/overlayCard';

const BlogPost = ({ filterItems, blogPosts, variant }) => {
    // console.log(filterItems)
    const [selectedFilter, setSelectedFilter] = useState({ category: null, sub_category: null });
    const [currentPage, setCurrentPage] = useState(1); 
    const itemsPerPage = 6; 

    const handleFilterSelect = (category, sub_category) => {
        // console.log(category, sub_category)
        if (sub_category === "reset") {
            setSelectedFilter({ category: null, sub_category: null });
            setCurrentPage(1); 
        } else {
            setSelectedFilter({ category, sub_category });
            setCurrentPage(1);
        }
    };

    const filteredPosts = blogPosts.filter((post) => {
        // console.log("selected filter: ",selectedFilter)
        // console.log("Post: ",post)
        if (!selectedFilter.category && !selectedFilter.sub_category) return true;
        return (
            post.category.name === selectedFilter.category &&
            post.sub_category.name === selectedFilter.sub_category
        );
    });

    // console.log("Filtered Posts: ",filteredPosts)

    // Paginate the filtered posts
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="container">
            {/* Filter blog */}
            <FilterContent data={filterItems} onFilterSelect={handleFilterSelect} />

            <div className="flex gap-[30px] flex-wrap mb-14 border-b border-gray-300 pb-8">
                {variant === "blogPosts" && paginatedPosts.map((item, index) => (
                    <Card key={index} data={item} className="basis-full md:basis-[calc((100%-60px)/3)]" />
                ))}
                {variant === "caseStudies" && paginatedPosts.map((item, index) => (
                    <OverlayCard key={index} data={item} className="basis-full md:basis-[calc((100%-60px)/3)]" />
                ))}
            </div>
            <div className="mb-14">
                <Pagination
                    currentPage={currentPage}
                    totalItems={filteredPosts.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
};

export default BlogPost;