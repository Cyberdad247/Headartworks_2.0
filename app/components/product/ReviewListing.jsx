import {useState, useEffect} from 'react';
import {useReviews} from '~/contexts/ReviewContext';
import {MediaItem} from './MediaItem';
import {ReviewStars} from './ReviewStars';

export function ReviewListing({productId}) {
  const {reviews, fetchReviews} = useReviews();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const reviewsPerPage = 5;

  useEffect(() => {
    if (productId && reviews.length === 0) {
      setLoading(true);
      fetchReviews(productId).finally(() => setLoading(false));
    }
  }, [productId]);

  const paginatedReviews = reviews.slice(0, page * reviewsPerPage);
  const hasMore = reviews.length > paginatedReviews.length;

  if (loading) return <div className="py-8 text-center">Loading reviews...</div>;
  if (reviews.length === 0) return <div className="py-8 text-center">No reviews yet</div>;

  return (
    <div className="review-listing space-y-6">
      <h3 className="text-xl font-semibold">Customer Reviews</h3>
      
      {paginatedReviews.map((review) => (
        <div key={review.id} className="review-item border-b pb-4">
          <div className="flex items-center mb-2">
            <ReviewStars staticRating={review.score} size="sm" />
            <span className="ml-2 text-sm text-gray-600">
              {review.created_at} by {review.name}
            </span>
          </div>
          
          <h4 className="font-medium">{review.title}</h4>
          <p className="text-gray-700 mt-1">{review.content}</p>
          
          {review.media?.length > 0 && (
            <div className="flex gap-2 mt-3">
              {review.media.map((media) => (
                <MediaItem 
                  key={media.id}
                  media={media}
                  className="w-16 h-16 rounded"
                />
              ))}
            </div>
          )}
        </div>
      ))}

      {hasMore && (
        <button 
          onClick={() => setPage(p => p + 1)}
          className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
        >
          Load More Reviews
        </button>
      )}
    </div>
  );
}