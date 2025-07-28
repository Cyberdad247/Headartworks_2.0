import {useState} from 'react';
import {useReviews} from '~/contexts/ReviewContext';
import {ReviewStars} from './ReviewStars';

export function ReviewForm({productId}) {
  const {addReview} = useReviews();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    name: '',
    email: ''
  });
  const [media, setMedia] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files);
    setMedia(files.slice(0, 3)); // Limit to 3 media items
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addReview({
        product_id: productId,
        score: rating,
        ...formData,
        media: media.map(file => ({
          type: file.type.startsWith('image') ? 'image' : 'video',
          file
        }))
      });
      
      // Reset form
      setRating(0);
      setFormData({
        title: '',
        content: '', 
        name: '',
        email: ''
      });
      setMedia([]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="review-form mt-8 p-6 bg-gray-50 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Your Rating</label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="mr-1"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <ReviewStars 
                  staticRating={(hoverRating || rating) >= star ? 1 : 0} 
                  size="lg"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Review Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Your Review</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="4"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Add Photos/Videos (max 3)</label>
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleMediaUpload}
            className="w-full p-2 border rounded"
          />
          {media.length > 0 && (
            <div className="flex gap-2 mt-2">
              {media.map((file, index) => (
                <div key={index} className="relative">
                  {file.type.startsWith('image') ? (
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt="Preview" 
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <video className="w-16 h-16 rounded">
                      <source src={URL.createObjectURL(file)} type={file.type} />
                    </video>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || rating === 0}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}