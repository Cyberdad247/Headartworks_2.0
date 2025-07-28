/**
 * Advanced Translation Pipeline
 * Automated translation system with AI integration, translation memory,
 * quality assurance, and human review workflows for Head Artworks.
 */

import { translationCache } from './translationCache.js';
import advancedLanguageAnalytics from './advancedLanguageAnalytics.js';

// Translation provider interfaces
class TranslationProvider {
  constructor(name, config) {
    this.name = name;
    this.config = config;
    this.rateLimiter = new RateLimiter(config.rateLimit || 100);
  }

  async translate(text, fromLang, toLang, context = {}) {
    throw new Error('translate method must be implemented by provider');
  }

  async batchTranslate(texts, fromLang, toLang, context = {}) {
    throw new Error('batchTranslate method must be implemented by provider');
  }

  getConfidenceScore(translation, originalText) {
    return 0.8; // Default confidence score
  }
}

// DeepL Translation Provider
class DeepLProvider extends TranslationProvider {
  constructor(config) {
    super('deepl', config);
    this.apiKey = config.apiKey;
    this.baseUrl = 'https://api-free.deepl.com/v2';
  }

  async translate(text, fromLang, toLang, context = {}) {
    await this.rateLimiter.waitForToken();

    try {
      const response = await fetch(`${this.baseUrl}/translate`, {
        method: 'POST',
        headers: {
          'Authorization': `DeepL-Auth-Key ${this.apiKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          text: text,
          source_lang: this.mapLanguageCode(fromLang),
          target_lang: this.mapLanguageCode(toLang),
          formality: context.formality || 'default',
          preserve_formatting: '1'
        })
      });

      if (!response.ok) {
        throw new Error(`DeepL API error: ${response.status}`);
      }

      const data = await response.json();
      const translation = data.translations[0];

      return {
        text: translation.text,
        confidence: this.calculateConfidence(translation),
        provider: 'deepl',
        detectedSourceLang: translation.detected_source_language
      };

    } catch (error) {
      console.error('DeepL translation error:', error);
      throw error;
    }
  }

  async batchTranslate(texts, fromLang, toLang, context = {}) {
    const batchSize = 50; // DeepL batch limit
    const results = [];

    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      await this.rateLimiter.waitForToken();

      try {
        const response = await fetch(`${this.baseUrl}/translate`, {
          method: 'POST',
          headers: {
            'Authorization': `DeepL-Auth-Key ${this.apiKey}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            text: batch,
            source_lang: this.mapLanguageCode(fromLang),
            target_lang: this.mapLanguageCode(toLang),
            formality: context.formality || 'default',
            preserve_formatting: '1'
          })
        });

        if (!response.ok) {
          throw new Error(`DeepL API error: ${response.status}`);
        }

        const data = await response.json();
        const batchResults = data.translations.map(translation => ({
          text: translation.text,
          confidence: this.calculateConfidence(translation),
          provider: 'deepl',
          detectedSourceLang: translation.detected_source_language
        }));

        results.push(...batchResults);

      } catch (error) {
        console.error('DeepL batch translation error:', error);
        // Add error placeholders for failed batch
        results.push(...batch.map(() => ({ error: error.message, provider: 'deepl' })));
      }
    }

    return results;
  }

  mapLanguageCode(code) {
    const mapping = {
      'en': 'EN',
      'es': 'ES',
      'fr': 'FR',
      'de': 'DE',
      'it': 'IT',
      'pt': 'PT',
      'ja': 'JA',
      'zh': 'ZH',
      'ko': 'KO'
    };
    return mapping[code] || code.toUpperCase();
  }

  calculateConfidence(translation) {
    // DeepL doesn't provide confidence scores, so we estimate based on length and complexity
    const textLength = translation.text.length;
    const originalLength = translation.text.length; // Would need original for comparison
    
    if (textLength === 0) return 0.1;
    if (textLength < 10) return 0.7;
    if (textLength < 100) return 0.85;
    return 0.9;
  }
}

// Google Translate Provider
class GoogleTranslateProvider extends TranslationProvider {
  constructor(config) {
    super('google', config);
    this.apiKey = config.apiKey;
    this.baseUrl = 'https://translation.googleapis.com/language/translate/v2';
  }

  async translate(text, fromLang, toLang, context = {}) {
    await this.rateLimiter.waitForToken();

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: fromLang,
          target: toLang,
          format: 'text'
        })
      });

      if (!response.ok) {
        throw new Error(`Google Translate API error: ${response.status}`);
      }

      const data = await response.json();
      const translation = data.data.translations[0];

      return {
        text: translation.translatedText,
        confidence: this.calculateConfidence(translation, text),
        provider: 'google',
        detectedSourceLang: translation.detectedSourceLanguage
      };

    } catch (error) {
      console.error('Google Translate error:', error);
      throw error;
    }
  }

  async batchTranslate(texts, fromLang, toLang, context = {}) {
    await this.rateLimiter.waitForToken();

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: texts,
          source: fromLang,
          target: toLang,
          format: 'text'
        })
      });

      if (!response.ok) {
        throw new Error(`Google Translate API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data.translations.map((translation, index) => ({
        text: translation.translatedText,
        confidence: this.calculateConfidence(translation, texts[index]),
        provider: 'google',
        detectedSourceLang: translation.detectedSourceLanguage
      }));

    } catch (error) {
      console.error('Google Translate batch error:', error);
      throw error;
    }
  }

  calculateConfidence(translation, originalText) {
    // Basic confidence calculation based on text characteristics
    const translatedLength = translation.translatedText.length;
    const originalLength = originalText.length;
    
    if (translatedLength === 0) return 0.1;
    
    const lengthRatio = translatedLength / originalLength;
    if (lengthRatio < 0.3 || lengthRatio > 3) return 0.6; // Suspicious length ratio
    
    return 0.8; // Default confidence for Google Translate
  }
}

// Azure Translator Provider
class AzureTranslatorProvider extends TranslationProvider {
  constructor(config) {
    super('azure', config);
    this.subscriptionKey = config.subscriptionKey;
    this.region = config.region;
    this.baseUrl = `https://api.cognitive.microsofttranslator.com`;
  }

  async translate(text, fromLang, toLang, context = {}) {
    await this.rateLimiter.waitForToken();

    try {
      const response = await fetch(`${this.baseUrl}/translate?api-version=3.0&from=${fromLang}&to=${toLang}`, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': this.subscriptionKey,
          'Ocp-Apim-Subscription-Region': this.region,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([{ text: text }])
      });

      if (!response.ok) {
        throw new Error(`Azure Translator API error: ${response.status}`);
      }

      const data = await response.json();
      const translation = data[0].translations[0];

      return {
        text: translation.text,
        confidence: translation.confidence || 0.8,
        provider: 'azure',
        detectedSourceLang: data[0].detectedLanguage?.language
      };

    } catch (error) {
      console.error('Azure Translator error:', error);
      throw error;
    }
  }

  async batchTranslate(texts, fromLang, toLang, context = {}) {
    await this.rateLimiter.waitForToken();

    try {
      const requestBody = texts.map(text => ({ text }));
      
      const response = await fetch(`${this.baseUrl}/translate?api-version=3.0&from=${fromLang}&to=${toLang}`, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': this.subscriptionKey,
          'Ocp-Apim-Subscription-Region': this.region,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Azure Translator API error: ${response.status}`);
      }

      const data = await response.json();
      return data.map(item => ({
        text: item.translations[0].text,
        confidence: item.translations[0].confidence || 0.8,
        provider: 'azure',
        detectedSourceLang: item.detectedLanguage?.language
      }));

    } catch (error) {
      console.error('Azure Translator batch error:', error);
      throw error;
    }
  }
}

// Rate Limiter
class RateLimiter {
  constructor(requestsPerMinute) {
    this.requestsPerMinute = requestsPerMinute;
    this.tokens = requestsPerMinute;
    this.lastRefill = Date.now();
    this.refillInterval = 60000 / requestsPerMinute; // ms per token
  }

  async waitForToken() {
    this.refillTokens();
    
    if (this.tokens > 0) {
      this.tokens--;
      return;
    }

    // Wait for next token
    const waitTime = this.refillInterval - (Date.now() - this.lastRefill);
    if (waitTime > 0) {
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return this.waitForToken();
    }
  }

  refillTokens() {
    const now = Date.now();
    const timePassed = now - this.lastRefill;
    const tokensToAdd = Math.floor(timePassed / this.refillInterval);
    
    if (tokensToAdd > 0) {
      this.tokens = Math.min(this.requestsPerMinute, this.tokens + tokensToAdd);
      this.lastRefill = now;
    }
  }
}

// Translation Memory System
class TranslationMemory {
  constructor() {
    this.memory = new Map();
    this.fuzzyThreshold = 0.8;
  }

  async findMatch(text, fromLang, toLang, context = {}) {
    const key = this.generateKey(text, fromLang, toLang, context);
    
    // Exact match
    const exactMatch = this.memory.get(key);
    if (exactMatch) {
      return {
        translation: exactMatch.translation,
        confidence: 1.0,
        matchType: 'exact',
        source: 'memory'
      };
    }

    // Fuzzy match
    const fuzzyMatch = await this.findFuzzyMatch(text, fromLang, toLang, context);
    if (fuzzyMatch && fuzzyMatch.confidence >= this.fuzzyThreshold) {
      return fuzzyMatch;
    }

    return null;
  }

  async store(originalText, translation, fromLang, toLang, confidence, context = {}) {
    const key = this.generateKey(originalText, fromLang, toLang, context);
    
    this.memory.set(key, {
      originalText,
      translation,
      fromLang,
      toLang,
      confidence,
      context,
      createdAt: new Date(),
      usageCount: 1
    });

    // Also store in persistent storage
    await this.persistToDatabase(key, originalText, translation, fromLang, toLang, confidence, context);
  }

  async findFuzzyMatch(text, fromLang, toLang, context = {}) {
    // Simple fuzzy matching - in production, use more sophisticated algorithms
    const candidates = [];
    
    for (const [key, entry] of this.memory.entries()) {
      if (entry.fromLang === fromLang && entry.toLang === toLang) {
        const similarity = this.calculateSimilarity(text, entry.originalText);
        if (similarity >= this.fuzzyThreshold) {
          candidates.push({
            translation: entry.translation,
            confidence: similarity * entry.confidence,
            matchType: 'fuzzy',
            source: 'memory',
            similarity
          });
        }
      }
    }

    return candidates.sort((a, b) => b.confidence - a.confidence)[0] || null;
  }

  calculateSimilarity(text1, text2) {
    // Simple Levenshtein distance-based similarity
    const distance = this.levenshteinDistance(text1.toLowerCase(), text2.toLowerCase());
    const maxLength = Math.max(text1.length, text2.length);
    return maxLength === 0 ? 1 : 1 - (distance / maxLength);
  }

  levenshteinDistance(str1, str2) {
    const matrix = Array(str2.length + 1).fill().map(() => Array(str1.length + 1).fill(0));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + cost
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  generateKey(text, fromLang, toLang, context) {
    const contextStr = JSON.stringify(context);
    return `${fromLang}:${toLang}:${text}:${contextStr}`;
  }

  async persistToDatabase(key, originalText, translation, fromLang, toLang, confidence, context) {
    try {
      await fetch('/api/translation-memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key,
          originalText,
          translation,
          fromLang,
          toLang,
          confidence,
          context,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Failed to persist translation to database:', error);
    }
  }

  async loadFromDatabase() {
    try {
      const response = await fetch('/api/translation-memory');
      if (!response.ok) {
        throw new Error(`Failed to load translation memory: ${response.statusText}`);
      }
      const data = await response.json();
      
      data.forEach(entry => {
        const key = this.generateKey(entry.originalText, entry.fromLang, entry.toLang, entry.context);
        this.memory.set(key, entry);
      });
    } catch (error) {
      console.error('Failed to load translation memory from database:', error);
    }
  }
}

// Main Translation Pipeline
class AdvancedTranslationPipeline {
  constructor(config = {}) {
    this.providers = [];
    this.translationMemory = new TranslationMemory();
    this.qualityThreshold = config.qualityThreshold || 0.8;
    this.humanReviewQueue = [];
    this.config = config;

    // Initialize providers
    this.initializeProviders(config.providers || {});
    
    // Load translation memory
    this.translationMemory.loadFromDatabase();
  }

  initializeProviders(providerConfigs) {
    if (providerConfigs.deepl) {
      this.providers.push(new DeepLProvider(providerConfigs.deepl));
    }
    
    if (providerConfigs.google) {
      this.providers.push(new GoogleTranslateProvider(providerConfigs.google));
    }
    
    if (providerConfigs.azure) {
      this.providers.push(new AzureTranslatorProvider(providerConfigs.azure));
    }

    // Sort providers by priority (could be configurable)
    this.providers.sort((a, b) => {
      const priority = { deepl: 3, azure: 2, google: 1 };
      return (priority[b.name] || 0) - (priority[a.name] || 0);
    });
  }

  async translateContent(content, fromLang, toLang, context = {}) {
    const startTime = Date.now();

    try {
      // 1. Check translation memory first
      const memoryMatch = await this.translationMemory.findMatch(content, fromLang, toLang, context);
      if (memoryMatch && memoryMatch.confidence >= 0.95) {
        this.trackTranslationEvent('memory_hit', { fromLang, toLang, confidence: memoryMatch.confidence });
        return {
          translation: memoryMatch.translation,
          confidence: memoryMatch.confidence,
          source: 'memory',
          processingTime: Date.now() - startTime
        };
      }

      // 2. Get AI translations from multiple providers
      const aiTranslations = await this.getMultiProviderTranslations(content, fromLang, toLang, context);
      
      if (aiTranslations.length === 0) {
        throw new Error('No translation providers available');
      }

      // 3. Select best translation
      const bestTranslation = this.selectBestTranslation(aiTranslations, content);

      // 4. Quality assessment
      const qualityScore = await this.assessQuality(bestTranslation, content, fromLang, toLang, context);

      // 5. Human review queue if quality is below threshold
      if (qualityScore < this.qualityThreshold) {
        await this.queueForHumanReview({
          originalText: content,
          translation: bestTranslation.text,
          fromLang,
          toLang,
          context,
          qualityScore,
          aiTranslations
        });
      }

      // 6. Store in translation memory
      await this.translationMemory.store(
        content,
        bestTranslation.text,
        fromLang,
        toLang,
        qualityScore,
        context
      );

      // 7. Track analytics
      this.trackTranslationEvent('ai_translation', {
        fromLang,
        toLang,
        provider: bestTranslation.provider,
        confidence: bestTranslation.confidence,
        qualityScore,
        processingTime: Date.now() - startTime
      });

      return {
        translation: bestTranslation.text,
        confidence: bestTranslation.confidence,
        qualityScore,
        source: 'ai',
        provider: bestTranslation.provider,
        processingTime: Date.now() - startTime,
        needsReview: qualityScore < this.qualityThreshold
      };

    } catch (error) {
      console.error('Translation pipeline error:', error);
      this.trackTranslationEvent('translation_error', {
        fromLang,
        toLang,
        error: error.message,
        processingTime: Date.now() - startTime
      });
      throw error;
    }
  }

  async getMultiProviderTranslations(content, fromLang, toLang, context) {
    const translations = [];
    const maxProviders = Math.min(this.providers.length, 2); // Limit to 2 providers for cost efficiency

    for (let i = 0; i < maxProviders; i++) {
      const provider = this.providers[i];
      
      try {
        const translation = await provider.translate(content, fromLang, toLang, context);
        translations.push(translation);
      } catch (error) {
        console.error(`Provider ${provider.name} failed:`, error);
        // Continue with other providers
      }
    }

    return translations;
  }

  selectBestTranslation(translations, originalText) {
    if (translations.length === 1) {
      return translations[0];
    }

    // Score translations based on confidence and provider reliability
    const scoredTranslations = translations.map(translation => {
      const providerScore = this.getProviderReliabilityScore(translation.provider);
      const lengthScore = this.calculateLengthScore(translation.text, originalText);
      
      return {
        ...translation,
        totalScore: (translation.confidence * 0.6) + (providerScore * 0.3) + (lengthScore * 0.1)
      };
    });

    return scoredTranslations.sort((a, b) => b.totalScore - a.totalScore)[0];
  }

  getProviderReliabilityScore(providerName) {
    const scores = { deepl: 0.9, azure: 0.85, google: 0.8 };
    return scores[providerName] || 0.7;
  }

  calculateLengthScore(translation, original) {
    const ratio = translation.length / original.length;
    if (ratio >= 0.5 && ratio <= 2.0) return 1.0;
    if (ratio >= 0.3 && ratio <= 3.0) return 0.8;
    return 0.5;
  }

  async assessQuality(translation, originalText, fromLang, toLang, context) {
    // Basic quality assessment - in production, use ML models
    let score = translation.confidence || 0.8;

    // Length-based assessment
    const lengthRatio = translation.text.length / originalText.length;
    if (lengthRatio < 0.3 || lengthRatio > 3) {
      score *= 0.7;
    }

    // Empty translation check
    if (!translation.text.trim()) {
      score = 0.1;
    }

    // Context-specific adjustments
    if (context.contentType === 'technical' && score > 0.7) {
      score *= 0.9; // Technical content needs higher scrutiny
    }

    return Math.max(0.1, Math.min(1.0, score));
  }

  async queueForHumanReview(reviewItem) {
    this.humanReviewQueue.push({
      ...reviewItem,
      id: `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      createdAt: new Date(),
      priority: this.calculateReviewPriority(reviewItem)
    });

    // Persist to database
    try {
      await fetch('/api/translation-review-queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewItem)
      });
    } catch (error) {
      console.error('Failed to queue for human review:', error);
    }
  }

  calculateReviewPriority(reviewItem) {
    // Higher priority for lower quality scores and important content types
    const qualityFactor = 1 - reviewItem.qualityScore;
    const contentTypeFactor = reviewItem.context.contentType === 'product' ? 1.5 : 1.0;
    
    return qualityFactor * contentTypeFactor;
  }

  trackTranslationEvent(eventType, data) {
    if (typeof advancedLanguageAnalytics !== 'undefined') {
      advancedLanguageAnalytics.trackUserBehavior({
        language: data.toLang || 'unknown',
        action: eventType,
        element: 'translation_pipeline',
        value: data.confidence || data.qualityScore,
        duration: data.processingTime,
        timestamp: Date.now()
      });
    }
  }

  // Batch translation for efficiency
  async batchTranslateContent(contentItems, fromLang, toLang, context = {}) {
    const results = [];
    const batchSize = 10;

    for (let i = 0; i < contentItems.length; i += batchSize) {
      const batch = contentItems.slice(i, i + batchSize);
      const batchPromises = batch.map(item => 
        this.translateContent(item.content, fromLang, toLang, { ...context, ...item.context })
      );

      try {
        const batchResults = await Promise.allSettled(batchPromises);
        results.push(...batchResults.map((result, index) => ({
          id: batch[index].id,
          success: result.status === 'fulfilled',
          result: result.status === 'fulfilled' ? result.value : null,
          error: result.status === 'rejected' ? result.reason : null
        })));
      } catch (error) {
        console.error('Batch translation error:', error);
        results.push(...batch.map(item => ({
          id: item.id,
          success: false,
          error: error.message
        })));
      }
    }

    return results;
  }

  // Get pipeline statistics
  getStatistics() {
    return {
      providers: this.providers.map(p => ({ name: p.name, active: true })),
      memorySize: this.translationMemory.memory.size,
      reviewQueueSize: this.humanReviewQueue.length,
      qualityThreshold: this.qualityThreshold,
      averageProcessingTime: this.calculateAverageProcessingTime()
    };
  }

  calculateAverageProcessingTime() {
    // This would be calculated from stored metrics
    return 250; // ms
  }
}

// Export the pipeline
export default AdvancedTranslationPipeline;
export { 
  AdvancedTranslationPipeline,
  TranslationMemory,
  DeepLProvider,
  GoogleTranslateProvider,
  AzureTranslatorProvider
};