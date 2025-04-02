'use client';
import React, { useState, useMemo } from "react";
import Topics from "./Products";
import Categories from "./Category";
import Filter from "./Filters";
import { ICategory } from "../../../../backend/models/category";
import { IProduct } from "../../../../backend/models/product";
import styles from "./MainPage.module.scss"

interface MainPageProps {
  topics: IProduct[];
  categories: ICategory[];
}

const MainPage: React.FC<MainPageProps> = ({ topics, categories }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<string>("default");
  
  // Calculate max price once
  const maxPrice = Math.max(...topics.map(t => t.price));
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);

  const allCategories = Array.from(
    new Set([
      ...categories.map((cat) => cat.category),
      ...topics.flatMap((product) => product.categories),
    ])
  );

  const filteredAndSortedTopics = useMemo(() => {
    let result = topics;

    // Filter by categories
    if (selectedCategories.length > 0) {
      result = result.filter((product) =>
        product.categories.some((category) => selectedCategories.includes(category))
      );
    }

    // Filter by price range
    result = result.filter((product) =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sort based on selected option
    switch (sortOption) {
      case "priceAsc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "nameAsc":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "nameDesc":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }

    return result;
  }, [topics, selectedCategories, sortOption, priceRange]);

  const handleFilter = () => {
    // This method is now mostly handled by useMemo
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    setPriceRange([min, max]);
  };

  return (
    <div className={`Container ${styles.Container}`}>
      <div className={`${styles.mainWrapper} ${styles.localContainer}`}>
        <div className={styles.fitlersGroup}>
          <Filter
            allCategories={allCategories}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            sortOption={sortOption}
            setSortOption={setSortOption}
            priceRange={priceRange}
            onPriceRangeChange={handlePriceRangeChange}
            onSearch={handleFilter}
            maxPrice={maxPrice}
          />
        </div>
        <div
        data-test-id="list"
        >
          <Categories 
            categories={categories.filter(cat =>
              selectedCategories.length === 0 ||
              selectedCategories.includes(cat.category)
            )} 
          />
          <Topics topics={filteredAndSortedTopics} />
        </div>
      </div>
    </div>
  );
};

export default MainPage;