import { useState, useEffect } from 'react';
import axios from 'axios';
import { VIDEOS_URL } from '../../../server/config';

const Videos = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  
  const categories = ['all', 'wedding', 'birthday', 'engagement', 'corporate', 'other'];
  
  useEffect(() => {
    fetchVideos();
  }, [selectedCategory]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      const url = selectedCategory === 'all' 
        ? VIDEOS_URL
        : `${VIDEOS_URL}?category=${selectedCategory}`;
      
      console.log('Fetching videos from:', url);
      
      const response = await axios.get(url);
      if (response.data && response.data.success) {
        setVideos(response.data.data || []);
      } else {
        setVideos([]);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
      setError('Failed to load videos');
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryLabel = (category) => {
    const labels = {
      wedding: 'Wedding',
      birthday: 'Birthday',
      engagement: 'Engagement',
      corporate: 'Corporate',
      other: 'Other',
    };
    return labels[category] || category || 'Unknown';
  };

  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[--color-black-bg]">
        <section className="bg-gradient-to-r from-[--color-black-bg] to-[--color-dark-gray] py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-[--font-playfair] font-bold mb-4">
              Event <span className="text-[--color-gold]">Videos</span>
            </h1>
          </div>
        </section>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-12">
            <p className="text-gray-400">Loading videos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[--color-black-bg]">
      <section className="bg-gradient-to-r from-[--color-black-bg] to-[--color-dark-gray] py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-[--font-playfair] font-bold mb-4">
            Event <span className="text-[--color-gold]">Videos</span>
          </h1>
        </div>
      </section>
      
      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full capitalize transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-[--color-gold] text-black'
                  : 'bg-[--color-dark-gray] text-white hover:bg-[--color-gold] hover:text-black'
              }`}
            >
              {category === 'all' ? 'All' : getCategoryLabel(category)}
            </button>
          ))}
        </div>
        
        {!videos || videos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No videos found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div 
                key={video._id}
                className="bg-[--color-dark-gray] rounded-lg overflow-hidden cursor-pointer hover:transform hover:scale-105 transition-all duration-300"
                onClick={() => setSelectedVideo(video)}
              >
                <div className="relative pb-[56.25%]">
                  {video.type === 'file' ? (
                    <video src={video.videoUrl} className="absolute top-0 left-0 w-full h-full object-cover" />
                  ) : (
                    <iframe
                      src={getEmbedUrl(video.videoUrl)}
                      title={video.title}
                      className="absolute top-0 left-0 w-full h-full"
                      frameBorder="0"
                      allowFullScreen
                    ></iframe>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{video.title}</h3>
                  <p className="text-sm text-gray-400">{getCategoryLabel(video.category)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {selectedVideo && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4" onClick={() => setSelectedVideo(null)}>
          <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedVideo(null)} className="absolute -top-12 right-0 text-white text-3xl hover:text-[--color-gold]">×</button>
            <div className="relative pb-[56.25%]">
              {selectedVideo.type === 'file' ? (
                <video src={selectedVideo.videoUrl} className="absolute top-0 left-0 w-full h-full" controls autoPlay />
              ) : (
                <iframe
                  src={getEmbedUrl(selectedVideo.videoUrl)}
                  title={selectedVideo.title}
                  className="absolute top-0 left-0 w-full h-full"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              )}
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-2xl font-semibold text-white">{selectedVideo.title}</h3>
              <p className="text-gray-400 mt-2">{selectedVideo.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Videos;