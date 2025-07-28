import { json } from '@remix-run/node';

/**
 * API route for Translation Memory operations.
 * This route handles saving and loading translation memory entries.
 * In a real production environment, this would interact with a database.
 */

// In-memory store for demonstration purposes.
// In production, replace with a proper database (e.g., PostgreSQL, MongoDB).
const translationMemoryStore = new Map();

/**
 * Handles GET requests to retrieve translation memory entries.
 * @returns {Response} A JSON response containing all translation memory entries.
 */
export async function loader() {
  const entries = Array.from(translationMemoryStore.values());
  return json(entries);
}

/**
 * Handles POST requests to save a new translation memory entry.
 * @param {Request} request The incoming request object.
 * @returns {Response} A JSON response indicating success or failure.
 */
export async function action({ request }) {
  if (request.method !== 'POST') {
    return json({ message: 'Method Not Allowed' }, { status: 405 });
  }

  try {
    const { key, originalText, translation, fromLang, toLang, confidence, context } = await request.json();

    if (!key || !originalText || !translation || !fromLang || !toLang) {
      return json({ message: 'Missing required fields' }, { status: 400 });
    }

    const newEntry = {
      key,
      originalText,
      translation,
      fromLang,
      toLang,
      confidence: confidence || 0.8,
      context: context || {},
      createdAt: new Date().toISOString(),
      usageCount: 1
    };

    translationMemoryStore.set(key, newEntry);

    return json({ message: 'Translation memory entry saved successfully', entry: newEntry }, { status: 201 });
  } catch (error) {
    console.error('Error saving translation memory entry:', error);
    return json({ message: 'Failed to save translation memory entry', error: error.message }, { status: 500 });
  }
}