import { json } from '@shopify/remix-oxygen';

/**
 * API route for Translation Review Queue operations.
 * This route handles actions related to human review of translations.
 * In a real production environment, this would interact with a database
 * and potentially trigger updates to the translation memory.
 */

// In-memory store for demonstration purposes.
// In production, replace with a proper database.
const reviewQueueStore = new Map();

// Initialize with some mock data for testing
if (reviewQueueStore.size === 0) {
  reviewQueueStore.set('review_1', {
    id: 'review_1',
    originalText: 'Hello, world!',
    translation: 'Hola, mundo!',
    fromLang: 'en',
    toLang: 'es',
    qualityScore: 0.65,
    status: 'pending',
    context: { contentType: 'ui' },
    createdAt: '2025-07-27T10:00:00Z',
    priority: 0.35
  });
  reviewQueueStore.set('review_2', {
    id: 'review_2',
    originalText: 'Buy now and save!',
    translation: 'Compre ahora y ahorre!',
    fromLang: 'en',
    toLang: 'es',
    qualityScore: 0.55,
    status: 'pending',
    context: { contentType: 'marketing' },
    createdAt: '2025-07-27T11:00:00Z',
    priority: 0.67
  });
}


/**
 * Handles GET requests to retrieve translation review queue entries.
 * @returns {Response} A JSON response containing all review queue entries.
 */
export async function loader() {
  const entries = Array.from(reviewQueueStore.values());
  return json(entries);
}

/**
 * Handles POST requests to update a translation review entry (approve/reject).
 * @param {Request} request The incoming request object.
 * @returns {Response} A JSON response indicating success or failure.
 */
export async function action({ request }) {
  if (request.method !== 'POST') {
    return json({ message: 'Method Not Allowed' }, { status: 405 });
  }

  try {
    const { reviewId, actionType, finalTranslation, reviewNotes } = await request.json();

    if (!reviewId || !actionType) {
      return json({ message: 'Missing required fields: reviewId or actionType' }, { status: 400 });
    }

    const reviewEntry = reviewQueueStore.get(reviewId);

    if (!reviewEntry) {
      return json({ message: 'Review entry not found' }, { status: 404 });
    }

    let message = '';
    switch (actionType) {
      case 'approve':
        reviewEntry.status = 'approved';
        reviewEntry.finalTranslation = finalTranslation || reviewEntry.translation;
        reviewEntry.reviewerNotes = reviewNotes;
        reviewEntry.reviewedAt = new Date().toISOString();
        message = 'Translation approved successfully.';
        // In a real app, you would also update the Translation Memory with the finalTranslation
        // and potentially remove it from the queue or mark as completed in DB.
        break;
      case 'reject':
        reviewEntry.status = 'rejected';
        reviewEntry.reviewerNotes = reviewNotes;
        reviewEntry.reviewedAt = new Date().toISOString();
        message = 'Translation rejected successfully.';
        // In a real app, you might log this for further analysis or re-queue for AI.
        break;
      default:
        return json({ message: 'Invalid action type' }, { status: 400 });
    }

    reviewQueueStore.set(reviewId, reviewEntry); // Update the in-memory store

    return json({ message, entry: reviewEntry }, { status: 200 });
  } catch (error) {
    console.error('Error processing review queue action:', error);
    return json({ message: 'Failed to process review queue action', error: error.message }, { status: 500 });
  }
}