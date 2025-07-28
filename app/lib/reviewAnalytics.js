import { Analytics } from '@shopify/hydrogen';
import { v4 as uuidv4 } from 'uuid';

export function trackReviewEvent(eventType, reviewData) {
  const sessionId = sessionStorage.getItem('reviewSessionId') || uuidv4();
  sessionStorage.setItem('reviewSessionId', sessionId);

  Analytics.publish({
    event: 'review_interaction',
    payload: {
      session_id: sessionId,
      event_type: eventType,
      product_id: reviewData.productId,
      review_id: reviewData.reviewId,
      rating: reviewData.rating,
      timestamp: new Date().toISOString(),
      ...(eventType === 'view' && { view_duration: reviewData.duration }),
      ...(eventType === 'submit' && { 
        has_media: reviewData.hasMedia,
        word_count: reviewData.wordCount
      })
    }
  });
}

export function trackReviewImpression(productId) {
  trackReviewEvent('impression', { productId });
}

export function trackReviewView(productId, reviewId, duration) {
  trackReviewEvent('view', { productId, reviewId, duration });
}

export function trackReviewSubmission(productId, rating, hasMedia, wordCount) {
  trackReviewEvent('submit', { 
    productId, 
    rating,
    hasMedia,
    wordCount
  });
}