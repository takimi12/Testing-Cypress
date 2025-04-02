'use client';
import React, { useState, useEffect } from "react";
import DoubleRangeSlider from "./Slider";
import styles from "./Filters.module.scss";

interface FilterProps {
  allCategories: string[];
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  sortOption: string;
  setSortOption: (option: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (min: number, max: number) => void;
  onSearch: () => void;
  maxPrice: number;
}

const Filter: React.FC<FilterProps> = ({ 
  allCategories, 
  selectedCategories, 
  setSelectedCategories, 
  sortOption,
  setSortOption,
  priceRange,
  onPriceRangeChange,
  onSearch,
  maxPrice
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(priceRange);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1200);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Aktualizacja lokalnego zakresu cen przy zmianie prop-a
    setLocalPriceRange(priceRange);
  }, [priceRange]);

  const handleCategoryChange = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((cat) => cat !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const renderFilterContent = () => (
    <div className={styles.filterContent}>
      {/* Sekcja kategorii */}
      <div className={styles.category}>
        <h6>Kategoria</h6>
        {allCategories.map((categoryName,index) => (
          <div key={categoryName} className={styles.categoryItem}>
            <label className={styles.checkboxLabel}>
              <input
                id={`category-${index}`}
                type="checkbox"
                className={styles.checkbox}
                checked={selectedCategories.includes(categoryName)}
                onChange={() => handleCategoryChange(categoryName)}
              />
              <span className={styles.checkboxText}>{categoryName}</span>
            </label>
          </div>
        ))}
      </div>

      <div className={styles.category}>
        <h6>Sortowanie</h6>
        <select 
        id='select'
          value={sortOption} 
          onChange={(e) => setSortOption(e.target.value)}
          className={styles.select}
        >
          <option value="default">Domyślne</option>
          <option value="priceAsc">Cena - rosnąco</option>
          <option value="priceDesc">Cena - malejąco</option>
          <option value="nameAsc">Nazwa - A do Z</option>
          <option value="nameDesc">Nazwa - Z do A</option>
        </select>
      </div>

      <div className={styles.category}>
        <h6>Zakres ceny</h6>
        <DoubleRangeSlider 
          min={0} 
          max={maxPrice} 
          onChange={(min, max) => {
            setLocalPriceRange([min, max]);
          }}
        />
      </div>

      <div className={styles.buttons}>
        <button 
        id='searchButton'
          className={styles.searchButton} 
          onClick={() => {
            onPriceRangeChange(localPriceRange[0], localPriceRange[1]);
            setShowPopup(false);
            onSearch();
          }}
        >
          Wyszukaj
        </button>
        <button 
          className={styles.resetButton} 
          onClick={() => {
            setSelectedCategories([]);
            setSortOption("default");
            const defaultPriceRange: [number, number] = [0, maxPrice];
            setLocalPriceRange(defaultPriceRange);
            onPriceRangeChange(0, maxPrice);
            onSearch();
          }}
        >
          Wyczyść filtry
        </button>
      </div>
    </div>
  );

  return (
    <div>
      {isMobile ? (
        <div className={styles.mobileWrapper}>
          <button 
            className={styles.filtersButton} 
            onClick={() => setShowPopup(true)}
          >
            Sprecyzuj czego szukasz
          </button>

          <div className={styles.listingHeading}>
            <h2>Znajdź produkt odpowiedni dla Ciebie</h2>
            <p>Uzyskując nieograniczony dostęp do filmów, masz szansę nadrobić webinary w wygodnym dla siebie momencie.</p>
          </div>

          {showPopup && (
            <div className={styles.popup}>
              <div 
                className={styles.overlay}
                onClick={() => setShowPopup(false)}
              ></div>
              <div className={styles.popupContent}>
                <button 
                  className={styles.closeButton} 
                  onClick={() => setShowPopup(false)}
                >
                  ×
                </button>
                {renderFilterContent()}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.desktopFilters}>
          {renderFilterContent()}
        </div>
      )}
    </div>
  );
};

export default Filter;