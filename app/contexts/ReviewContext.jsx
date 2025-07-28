import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import useSWR from 'swr';

const YOTPO_API_KEY = process.env.YOTPO_API_KEY;
const YOTPO_SECRET = process.env.YOTPO_SECRET;

const ReviewContext = createContext();

export function ReviewProvider({ children }) {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  const fetchReviews = async (productId) => {
    try {
      const response = await fetch(
        `https://api.yotpo.com/v1/widget/${YOTPO_API_KEY}/products/${productId}/reviews.json`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Yotpo-Token': YOTPO_SECRET
          }
        }
      );
      
      const data = await response.json();
      if (data.reviews) {
        setReviews(data.reviews);
        setAverageRating(data.product_score);
        setReviewCount(data.reviews.length);
        return data;
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  const addReview = async (newReview) => {
    try {
      const response = await fetch(
        `https://api.yotpo.com/v1/widget/${YOTPO_API_KEY}/reviews`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Yotpo-Token': YOTPO_SECRET
          },
          body: JSON.stringify(newReview)
        }
      );
      
      if (response.ok) {
        setReviews(prev => [newReview, ...prev]);
        // Recalculate average rating
        const newAvg = ((averageRating * reviewCount) + newReview.score) / (reviewCount + 1);
        setAverageRating(newAvg);
        setReviewCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  const value = useMemo(() => ({
    reviews,
    averageRating,
    reviewCount,
    fetchReviews,
    addReview
  }), [reviews, averageRating, reviewCount]);

  return (
    <ReviewContext.Provider value={value}>
      {children}
    </ReviewContext.Provider>
  );
}

export function useReviews() {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewProvider');
  }
  return context;
}