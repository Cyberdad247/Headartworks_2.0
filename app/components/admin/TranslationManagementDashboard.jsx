import React, { useState, useEffect } from 'react';
import { useLoaderData, useFetcher } from '@remix-run/react';
import { json } from '@remix-run/node';

// Assuming these are available globally or via context/loader
// import AdvancedTranslationPipeline from '../../lib/translationPipeline';
// import translationQualityAssurance from '../../lib/translationQualityAssurance';
// import advancedLanguageAnalytics from '../../lib/advancedLanguageAnalytics';

// Mock data for demonstration purposes
const mockPipelineStats = {
  providers: [{ name: 'deepl', active: true }, { name: 'google', active: true }],
  memorySize: 12345,
  reviewQueueSize: 15,
  qualityThreshold: 0.8,
  averageProcessingTime: 280
};

const mockReviewQueue = [
  {
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
  },
  {
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
  },
  {
    id: 'review_3',
    originalText: 'Product description for a new artwork.',
    translation: 'Descripción del producto para una nueva obra de arte.',
    fromLang: 'en',
    toLang: 'es',
    qualityScore: 0.78,
    status: 'approved',
    context: { contentType: 'product' },
    createdAt: '2025-07-26T15:30:00Z',
    priority: 0.22
  },
];

const mockAnalyticsReport = {
  summary: {
    totalSessions: 5000,
    uniqueUsers: 1200,
    languageDistribution: { en: 2500, es: 1500, fr: 1000 },
    topLanguages: [{ language: 'en', count: 2500 }, { language: 'es', count: 1500 }]
  },
  performance: {
    translationLoadTimes: { en: { averageLoadTime: 150, cacheHitRate: 98 }, es: { averageLoadTime: 200, cacheHitRate: 90 } },
    cacheEfficiency: 'High',
    errorRates: 'Low'
  },
  userBehavior: {
    behaviorPatterns: { en: { click: { count: 1000 } } },
    engagementMetrics: 'Good',
    conversionRates: { en: { conversionRate: 2.5 }, es: { conversionRate: 1.8 } }
  },
  insights: [
    { type: 'language_preference', message: 'English is most popular' },
    { type: 'performance', message: 'Spanish translation loading is slightly slower' }
  ],
  recommendations: [
    { type: 'performance', action: 'Optimize Spanish translation loading' }
  ]
};

// Loader function for Remix
export async function loader() {
  // In a real application, you would fetch data from your backend services
  // const pipelineStats = await AdvancedTranslationPipeline.getStatistics();
  // const reviewQueue = await AdvancedTranslationPipeline.getReviewQueue();
  // const analyticsReport = await advancedLanguageAnalytics.generateLanguageReport();

  return json({
    pipelineStats: mockPipelineStats,
    reviewQueue: mockReviewQueue,
    analyticsReport: mockAnalyticsReport,
  });
}

export default function TranslationManagementDashboard() {
  const { pipelineStats, reviewQueue, analyticsReport } = useLoaderData();
  const fetcher = useFetcher();

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedReview, setSelectedReview] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [finalTranslation, setFinalTranslation] = useState('');

  const handleReviewAction = (reviewId, actionType) => {
    // In a real app, this would send a request to update the review status
    console.log(`Review ${reviewId}: ${actionType}`);
    fetcher.submit(
      { reviewId, actionType, finalTranslation, reviewNotes },
      { method: 'post', action: '/api/translation-review-queue' }
    );
    setSelectedReview(null); // Close modal after action
  };

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Pipeline Status</h3>
        <p>Providers: {pipelineStats.providers.map(p => p.name).join(', ')}</p>
        <p>Translation Memory Size: {pipelineStats.memorySize} entries</p>
        <p>Review Queue: {pipelineStats.reviewQueueSize} pending items</p>
        <p>Avg. Processing Time: {pipelineStats.averageProcessingTime}ms</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Language Distribution</h3>
        {Object.entries(analyticsReport.summary.languageDistribution).map(([lang, count]) => (
          <p key={lang}>{lang.toUpperCase()}: {count} sessions</p>
        ))}
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Top Languages</h3>
        {analyticsReport.summary.topLanguages.map((item, index) => (
          <p key={index}>{item.language.toUpperCase()}: {item.count}</p>
        ))}
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Translation Performance</h3>
        {Object.entries(analyticsReport.performance.translationLoadTimes).map(([lang, metrics]) => (
          <p key={lang}>{lang.toUpperCase()}: {metrics.averageLoadTime}ms (Cache: {metrics.cacheHitRate}%)</p>
        ))}
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Conversion Rates</h3>
        {Object.entries(analyticsReport.userBehavior.conversionRates).map(([lang, metrics]) => (
          <p key={lang}>{lang.toUpperCase()}: {metrics.conversionRate}%</p>
        ))}
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Key Insights</h3>
        {analyticsReport.insights.map((insight, index) => (
          <p key={index}>- {insight.message}</p>
        ))}
      </div>
    </div>
  );

  const renderReviewQueue = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6">Translation Review Queue</h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Original</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI Translation</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From/To</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quality Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Context</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reviewQueue.map((review) => (
              <tr key={review.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{review.id}</td>
                <td className="px-6 py-4 max-w-xs truncate text-sm text-gray-500">{review.originalText}</td>
                <td className="px-6 py-4 max-w-xs truncate text-sm text-gray-500">{review.translation}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{review.fromLang.toUpperCase()}/{review.toLang.toUpperCase()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    review.qualityScore < 0.7 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {(review.qualityScore * 100).toFixed(0)}%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    review.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    review.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {review.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{review.context.contentType}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => setSelectedReview(review)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedReview && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full">
            <h3 className="text-2xl font-bold mb-4">Review Translation: {selectedReview.id}</h3>
            <div className="mb-4">
              <p className="font-semibold">Original Text ({selectedReview.fromLang.toUpperCase()}):</p>
              <p className="bg-gray-100 p-3 rounded-md">{selectedReview.originalText}</p>
            </div>
            <div className="mb-4">
              <p className="font-semibold">AI Translation ({selectedReview.toLang.toUpperCase()}):</p>
              <p className="bg-blue-50 p-3 rounded-md">{selectedReview.translation}</p>
            </div>
            <div className="mb-4">
              <label htmlFor="finalTranslation" className="block text-sm font-medium text-gray-700">Final Translation:</label>
              <textarea
                id="finalTranslation"
                rows="4"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                defaultValue={selectedReview.translation}
                onChange={(e) => setFinalTranslation(e.target.value)}
              ></textarea>
            </div>
            <div className="mb-6">
              <label htmlFor="reviewNotes" className="block text-sm font-medium text-gray-700">Review Notes:</label>
              <textarea
                id="reviewNotes"
                rows="2"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                onChange={(e) => setReviewNotes(e.target.value)}
              ></textarea>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setSelectedReview(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReviewAction(selectedReview.id, 'reject')}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Reject
              </button>
              <button
                onClick={() => handleReviewAction(selectedReview.id, 'approve')}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderAnalytics = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6">Language Analytics Report</h2>
      <pre className="bg-gray-100 p-6 rounded-lg overflow-auto text-sm">
        {JSON.stringify(analyticsReport, null, 2)}
      </pre>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Translation Management Dashboard</h1>

      <div className="mb-8">
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">Select a tab</label>
          <select
            id="tabs"
            name="tabs"
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            defaultValue={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
          >
            <option value="overview">Overview</option>
            <option value="review-queue">Review Queue</option>
            <option value="analytics">Analytics</option>
          </select>
        </div>
        <div className="hidden sm:block">
          <nav className="flex space-x-4" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`${
                activeTab === 'overview'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              } px-3 py-2 font-medium text-sm rounded-md`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('review-queue')}
              className={`${
                activeTab === 'review-queue'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              } px-3 py-2 font-medium text-sm rounded-md`}
            >
              Review Queue ({reviewQueue.filter(r => r.status === 'pending').length})
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`${
                activeTab === 'analytics'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              } px-3 py-2 font-medium text-sm rounded-md`}
            >
              Analytics
            </button>
          </nav>
        </div>
      </div>

      <div>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'review-queue' && renderReviewQueue()}
        {activeTab === 'analytics' && renderAnalytics()}
      </div>
    </div>
  );
}