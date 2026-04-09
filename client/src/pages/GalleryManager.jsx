import { useState, useEffect } from 'react';
import axios from 'axios';

const GalleryManager = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'wedding',
    description: '',
  });
  const [preview, setPreview] = useState(null);

  // Fetch all images on load
  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/gallery');
      if (response.data.success) {
        setImages(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      alert('Failed to load gallery images');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      alert('Please select an image to upload');
      return;
    }

    const uploadData = new FormData();
    uploadData.append('image', selectedFile);
    uploadData.append('title', formData.title);
    uploadData.append('category', formData.category);
    uploadData.append('description', formData.description);

    setUploading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/gallery/upload', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        alert('Image uploaded successfully!');
        setSelectedFile(null);
        setPreview(null);
        setFormData({
          title: '',
          category: 'wedding',
          description: '',
        });
        fetchImages(); // Refresh gallery
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/gallery/${id}`);
        if (response.data.success) {
          alert('Image deleted successfully');
          fetchImages(); // Refresh gallery
        }
      } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete image');
      }
    }
  };

  const categories = [
    { value: 'wedding', label: 'Wedding' },
    { value: 'birthday', label: 'Birthday' },
    { value: 'engagement', label: 'Engagement' },
    { value: 'corporate', label: 'Corporate' },
    { value: 'other', label: 'Other' },
  ];

  const getCategoryColor = (category) => {
    const colors = {
      wedding: 'bg-pink-500/20 text-pink-400',
      birthday: 'bg-purple-500/20 text-purple-400',
      engagement: 'bg-red-500/20 text-red-400',
      corporate: 'bg-blue-500/20 text-blue-400',
      other: 'bg-gray-500/20 text-gray-400',
    };
    return colors[category] || colors.other;
  };

  return (
    <div className="min-h-screen bg-[--color-black-bg]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[--color-black-bg] to-[--color-dark-gray] border-b border-[--color-gold]/20 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-[--font-playfair] font-bold">
            Gallery <span className="text-[--color-gold]">Manager</span>
          </h1>
          <p className="text-gray-400 mt-1">Upload and manage decoration photos</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Upload Form */}
        <div className="bg-[--color-dark-gray] rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Upload New Image</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Image Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-[--color-black-bg] border border-gray-700 rounded-lg focus:outline-none focus:border-[--color-gold] text-white"
                  placeholder="Beautiful Wedding Setup"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-[--color-black-bg] border border-gray-700 rounded-lg focus:outline-none focus:border-[--color-gold] text-white"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Description (Optional)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="2"
                className="w-full px-4 py-2 bg-[--color-black-bg] border border-gray-700 rounded-lg focus:outline-none focus:border-[--color-gold] text-white resize-none"
                placeholder="Describe this decoration setup..."
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Select Image</label>
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="w-full px-4 py-2 bg-[--color-black-bg] border border-gray-700 rounded-lg focus:outline-none focus:border-[--color-gold] text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[--color-gold] file:text-black hover:file:bg-[--color-dark-gold] cursor-pointer"
                required
              />
            </div>

            {preview && (
              <div className="mt-4">
                <p className="text-sm text-gray-400 mb-2">Preview:</p>
                <img src={preview} alt="Preview" className="w-48 h-48 object-cover rounded-lg" />
              </div>
            )}

            <button
              type="submit"
              disabled={uploading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
          </form>
        </div>

        {/* Gallery Grid */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Gallery Images ({images.length})</h2>
          
          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading images...</div>
          ) : images.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              No images yet. Upload your first decoration photo!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <div key={image.id} className="bg-[--color-dark-gray] rounded-lg overflow-hidden group">
                  <div className="relative">
                    <img
                      src={image.imageUrl}
                      alt={image.title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button
                        onClick={() => handleDelete(image.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1">{image.title}</h3>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${getCategoryColor(image.category)}`}>
                      {image.category.toUpperCase()}
                    </span>
                    {image.description && (
                      <p className="text-gray-400 text-sm mt-2">{image.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GalleryManager;