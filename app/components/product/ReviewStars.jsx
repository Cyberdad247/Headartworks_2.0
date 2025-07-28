import {useReviews} from '~/contexts/ReviewContext';

export function ReviewStars({productId, size = 'md'}) {
  const {averageRating, reviewCount, fetchReviews} = useReviews();
  
  // Size classes
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base', 
    lg: 'text-lg'
  };

  // Fetch reviews on mount if needed
  useEffect(() => {
    if (productId && !averageRating) {
      fetchReviews(productId);
    }
  }, [productId]);

  // Calculate star display
  const stars = [];
  const fullStars = Math.floor(averageRating);
  const hasHalfStar = averageRating % 1 >= 0.5;
  
  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(<Star key={i} filled />);
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(<Star key={i} half />);
    } else {
      stars.push(<Star key={i} />);
    }
  }

  return (
    <div className={`flex items-center ${sizeClasses[size]}`}>
      <div className="flex mr-1 text-yellow-400">
        {stars}
      </div>
      {reviewCount > 0 && (
        <span className="text-gray-600 ml-1">
          ({reviewCount})
        </span>
      )}
    </div>
  );
}

function Star({filled = false, half = false}) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={`w-4 h-4 ${filled ? 'fill-current' : half ? 'half-star' : 'stroke-current fill-none'}`}
    >
      {half ? (
        <path d="M12 2L9 8H2L7 12L4 18L12 14L20 18L17 12L22 8H15L12 2Z" />
      ) : (
        <path d="M12 2L15 8H22L16 12L19 18L12 14L5 18L8 12L2 8H9L12 2Z" />
      )}
    </svg>
  );
}