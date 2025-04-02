'use client';
import React, { useState, useEffect } from "react";
import styles from "./slider.module.scss";

interface DoubleRangeSliderProps {
  min: number;
  max: number;
  step?: number;
  onChange: (min: number, max: number) => void;
}

const DoubleRangeSlider: React.FC<DoubleRangeSliderProps> = ({ 
  min, 
  max, 
  step = 1, 
  onChange 
}) => {
  const [minValue, setMinValue] = useState(min);
  const [maxValue, setMaxValue] = useState(max);

  useEffect(() => {
    onChange(minValue, maxValue);
  }, [minValue, maxValue]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), maxValue - step);
    setMinValue(value);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), minValue + step);
    setMaxValue(value);
  };

  return (
    <div className={styles.doubleRangeSlider}>
      <div className={styles.sliderContainer}>
        <div 
          className={styles.sliderTrack}
          style={{
            left: `${((minValue - min) / (max - min)) * 100}%`,
            width: `${((maxValue - minValue) / (max - min)) * 100}%`
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minValue}
          onChange={handleMinChange}
          className={`${styles.slider} ${styles.sliderMin}`}
          data-testid="slider-min"

        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxValue}
          onChange={handleMaxChange}
          className={`${styles.slider} ${styles.sliderMax}`}
          data-testid="slider-max"

        />
      </div>
      <div className={styles.values}>
        <span data-testid="min-value">Min: {minValue} zł</span>
        <span data-testid="max-value">Max: {maxValue} zł</span>
      </div>
    </div>
  );
};

export default DoubleRangeSlider;