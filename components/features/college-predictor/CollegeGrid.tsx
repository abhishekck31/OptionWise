"use client";

import { motion } from "framer-motion";
import { optionKey } from "@/hooks/useKCETStore";
import CollegeCard from "./CollegeCard";
import EmptyState from "./EmptyState";
import type { PredictionResult } from "@/types";

export interface CollegeGridProps {
  predictions: PredictionResult[];
  savedKeys: Set<string>;
  onSave: (prediction: PredictionResult) => void;
  onResetFilters: () => void;
}

export function CollegeGrid({
  predictions,
  savedKeys,
  onSave,
  onResetFilters,
}: CollegeGridProps) {
  if (predictions.length === 0) {
    return <EmptyState onReset={onResetFilters} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {predictions.map((prediction, idx) => {
        const key = optionKey(prediction.college.id, prediction.branch);
        return (
          <CollegeCard
            key={key}
            prediction={prediction}
            index={idx}
            isSaved={savedKeys.has(key)}
            onSave={onSave}
          />
        );
      })}
    </motion.div>
  );
}

export default CollegeGrid;
