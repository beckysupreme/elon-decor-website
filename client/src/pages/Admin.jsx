import { useState, useEffect } from 'react';
import axios from 'axios';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  
  // DIRECT URL - NO CONFIG
  const API_BASE_URL = 'https://elon-decor-api.onrender.com/api';
  
  // Package modal states
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [packageForm, setPackageForm] = useState({
    name: '',
    price: '',
    features: [''],
    popular: false,
    description: ''
  });
  const [savingPackage, setSavingPackage] = useState(false);
  
  // Image upload states
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageForm, setImageForm] = useState({
    title: '',
    category: 'wedding',
    description: ''
  });
  
  // Video upload states
  const [videoUploadType, setVideoUploadType] = useState('file');
  const [videoFileForm, setVideoFileForm] = useState({
    title: '',
    category: 'wedding',
    description: ''
  });
  const [selectedVideoFile, setSelectedVideoFile] = useState(null);
  const [videoFilePreview, setVideoFilePreview] = useState(null);
  const [uploadingVideoFile, setUploadingVideoFile] = useState(false);
  
  const [videoLinkForm, setVideoLinkForm] = useState({
    title: '',
    category: 'wedding',
    videoUrl: '',
    description: ''
  });
  const [addingVideoLink, setAddingVideoLink] = useState(false);

  // Fetch data on load
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    await Promise.all([
      fetchBookings(),
      fetchImages(),
      fetchVideos(),
      fetchPackages()
    ]);
    setLoading(false);
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/bookings`);
      if (response.data && response.data.success) {
        setBookings(response.data.data || []);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    }
  };

  const fetchImages = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/gallery`);
      if (response.data && response.data.success) {
        setImages(response.data.data || []);
      } else {
        setImages([]);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      setImages([]);
    }
  };

  const fetchVideos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/videos`);
      if (response.data && response.data.success) {
        setVideos(response.data.data || []);
      } else {
        setVideos([]);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
      setVideos([]);
    }
  };

  const fetchPackages = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/packages`);
      if (response.data && response.data.success) {
        setPackages(response.data.data || []);
      } else {
        setPackages([]);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
      setPackages([]);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    
    try {
      const response = await axios.get(`${API_BASE_URL}/search?q=${searchQuery}`);
      if (response.data && response.data.success) {
        setSearchResults(response.data.data);
      } else {
        setSearchResults({ bookings: [], images: [], videos: [], packages: [] });
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('Search failed. Please try again.');
    }
  };

  // Booking functions
  const updateBookingStatus = async (id, newStatus) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/bookings/${id}/status`, {
        status: newStatus
      });
      
      if (response.data && response.data.success) {
        await fetchBookings();
        alert(`Booking status updated to ${newStatus}`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update booking status');
    }
  };

  const deleteBooking = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        const response = await axios.delete(`${API_BASE_URL}/bookings/${id}`);
        if (response.data && response.data.success) {
          await fetchBookings();
          alert('Booking deleted successfully');
        }
      } catch (error) {
        console.error('Error deleting booking:', error);
        alert('Failed to delete booking');
      }
    }
  };

  // Package functions
  const handleAddPackage = () => {
    setEditingPackage(null);
    setPackageForm({
      name: '',
      price: '',
      features: [''],
      popular: false,
      description: ''
    });
    setShowPackageModal(true);
  };

  const handleEditPackage = (pkg) => {
    setEditingPackage(pkg);
    setPackageForm({
      name: pkg.name,
      price: pkg.price,
      features: pkg.features || [''],
      popular: pkg.popular || false,
      description: pkg.description || ''
    });
    setShowPackageModal(true);
  };

  const handleAddFeature = () => {
    setPackageForm({
      ...packageForm,
      features: [...packageForm.features, '']
    });
  };

  const handleRemoveFeature = (index) => {
    const newFeatures = packageForm.features.filter((_, i) => i !== index);
    setPackageForm({
      ...packageForm,
      features: newFeatures.length ? newFeatures : ['']
    });
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...packageForm.features];
    newFeatures[index] = value;
    setPackageForm({
      ...packageForm,
      features: newFeatures
    });
  };

  const savePackage = async (e) => {
    e.preventDefault();
    if (!packageForm.name || !packageForm.price) {
      alert('Please fill in name and price');
      return;
    }
    
    setSavingPackage(true);
    try {
      const filteredFeatures = packageForm.features.filter(f => f.trim());
      
      if (editingPackage) {
        const response = await axios.put(`${API_BASE_URL}/packages/${editingPackage._id}`, {
          ...packageForm,
          features: filteredFeatures
        });
        if (response.data && response.data.success) {
          alert('Package updated successfully!');
        }
      } else {
        const response = await axios.post(`${API_BASE_URL}/packages`, {
          ...packageForm,
          features: filteredFeatures
        });
        if (response.data && response.data.success) {
          alert('Package added successfully!');
        }
      }
      setShowPackageModal(false);
      await fetchPackages();
    } catch (error) {
      console.error('Save package error:', error);
      alert('Failed to save package');
    } finally {
      setSavingPackage(false);
    }
  };

  const deletePackage = async (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        const response = await axios.delete(`${API_BASE_URL}/packages/${id}`);
        if (response.data && response.data.success) {
          alert('Package deleted successfully');
          await fetchPackages();
        }
      } catch (error) {
        console.error('Delete package error:', error);
        alert('Failed to delete package');
      }
    }
  };

  // Image functions
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (e) => {
    e.preventDefault();
    if (!selectedImageFile || !imageForm.title) {
      alert('Please select an image and enter a title');
      return;
    }
    
    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', selectedImageFile);
    formData.append('title', imageForm.title);
    formData.append('category', imageForm.category);
    formData.append('description', imageForm.description);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/gallery/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data && response.data.success) {
        alert('Image uploaded successfully!');
        setSelectedImageFile(null);
        setImagePreview(null);
        setImageForm({ title: '', category: 'wedding', description: '' });
        await fetchImages();
      } else {
        alert('Upload failed: ' + (response.data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image.');
    } finally {
      setUploadingImage(false);
    }
  };

  const deleteImage = async (id) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        const response = await axios.delete(`${API_BASE_URL}/gallery/${id}`);
        if (response.data && response.data.success) {
          await fetchImages();
          alert('Image deleted successfully');
        }
      } catch (error) {
        console.error('Error deleting image:', error);
        alert('Failed to delete image');
      }
    }
  };

  // Video functions
  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedVideoFile(file);
      setVideoFilePreview(URL.createObjectURL(file));
    }
  };

  const uploadVideoFile = async (e) => {
    e.preventDefault();
    if (!selectedVideoFile || !videoFileForm.title) {
      alert('Please select a video and enter a title');
      return;
    }
    
    setUploadingVideoFile(true);
    const formData = new FormData();
    formData.append('video', selectedVideoFile);
    formData.append('title', videoFileForm.title);
    formData.append('category', videoFileForm.category);
    formData.append('description', videoFileForm.description);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/videos/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data && response.data.success) {
        alert('Video uploaded successfully!');
        setSelectedVideoFile(null);
        setVideoFilePreview(null);
        setVideoFileForm({ title: '', category: 'wedding', description: '' });
        await fetchVideos();
      } else {
        alert('Upload failed: ' + (response.data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload video.');
    } finally {
      setUploadingVideoFile(false);
    }
  };

  const addVideoLink = async (e) => {
    e.preventDefault();
    if (!videoLinkForm.title || !videoLinkForm.videoUrl) {
      alert('Please fill in title and video URL');
      return;
    }
    
    setAddingVideoLink(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/videos/link`, videoLinkForm);
      if (response.data && response.data.success) {
        alert('Video link added successfully!');
        setVideoLinkForm({ title: '', category: 'wedding', videoUrl: '', description: '' });
        await fetchVideos();
      }
    } catch (error) {
      console.error('Error adding video:', error);
      alert('Failed to add video link');
    } finally {
      setAddingVideoLink(false);
    }
  };

  const deleteVideo = async (id) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        const response = await axios.delete(`${API_BASE_URL}/videos/${id}`);
        if (response.data && response.data.success) {
          await fetchVideos();
          alert('Video deleted successfully');
        }
      } catch (error) {
        console.error('Error deleting video:', error);
        alert('Failed to delete video');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
      case 'contacted': return 'bg-blue-500/20 text-blue-400 border-blue-500';
      case 'confirmed': return 'bg-green-500/20 text-green-400 border-green-500';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formatEventType = (type) => {
    const types = {
      wedding: 'Wedding',
      birthday: 'Birthday',
      engagement: 'Engagement',
      corporate: 'Corporate Event',
      other: 'Other'
    };
    return types[type] || type || 'Not specified';
  };

  const stats = {
    totalBookings: bookings?.length || 0,
    pendingBookings: bookings?.filter(b => b?.status === 'pending')?.length || 0,
    confirmedBookings: bookings?.filter(b => b?.status === 'confirmed')?.length || 0,
    totalImages: images?.length || 0,
    totalVideos: videos?.length || 0,
    totalPackages: packages?.length || 0
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[--color-black-bg] flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-[--color-gold] mb-4">Loading...</div>
          <p className="text-gray-400">Please wait while we load your data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[--color-black-bg]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[--color-black-bg] to-[--color-dark-gray] border-b border-[--color-gold]/20 sticky top-0 z-20">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-[--font-playfair] font-bold">
            Admin <span className="text-[--color-gold]">Dashboard</span>
          </h1>
          <p className="text-gray-400 mt-1">Manage bookings, gallery, videos, and packages</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search by name, phone, event type, title, category, package name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-4 py-2 bg-[--color-dark-gray] border border-gray-700 rounded-lg focus:outline-none focus:border-[--color-gold] text-white"
            />
            <button
              onClick={handleSearch}
              className="btn-primary"
            >
              Search
            </button>
            {searchResults && (
              <button
                onClick={() => {
                  setSearchResults(null);
                  setSearchQuery('');
                }}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-[--color-dark-gray] rounded-lg p-4 border border-[--color-gold]/20">
            <div className="text-2xl font-bold text-[--color-gold]">{stats.totalBookings}</div>
            <div className="text-gray-400 text-sm">Total Bookings</div>
          </div>
          <div className="bg-[--color-dark-gray] rounded-lg p-4 border border-yellow-500/20">
            <div className="text-2xl font-bold text-yellow-400">{stats.pendingBookings}</div>
            <div className="text-gray-400 text-sm">Pending</div>
          </div>
          <div className="bg-[--color-dark-gray] rounded-lg p-4 border border-green-500/20">
            <div className="text-2xl font-bold text-green-400">{stats.confirmedBookings}</div>
            <div className="text-gray-400 text-sm">Confirmed</div>
          </div>
          <div className="bg-[--color-dark-gray] rounded-lg p-4 border border-blue-500/20">
            <div className="text-2xl font-bold text-blue-400">{stats.totalImages}</div>
            <div className="text-gray-400 text-sm">Images</div>
          </div>
          <div className="bg-[--color-dark-gray] rounded-lg p-4 border border-purple-500/20">
            <div className="text-2xl font-bold text-purple-400">{stats.totalVideos}</div>
            <div className="text-gray-400 text-sm">Videos</div>
          </div>
          <div className="bg-[--color-dark-gray] rounded-lg p-4 border border-orange-500/20">
            <div className="text-2xl font-bold text-orange-400">{stats.totalPackages}</div>
            <div className="text-gray-400 text-sm">Packages</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-700 overflow-x-auto">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'bookings'
                ? 'text-[--color-gold] border-b-2 border-[--color-gold]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📋 Bookings ({bookings?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('images')}
            className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'images'
                ? 'text-[--color-gold] border-b-2 border-[--color-gold]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🖼️ Gallery ({images?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'videos'
                ? 'text-[--color-gold] border-b-2 border-[--color-gold]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🎥 Videos ({videos?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('packages')}
            className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'packages'
                ? 'text-[--color-gold] border-b-2 border-[--color-gold]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📦 Packages ({packages?.length || 0})
          </button>
        </div>

        {/* Search Results */}
        {searchResults && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Search Results for "{searchQuery}"</h2>
            {/* Search results content - same as before */}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && !searchResults && (
          <div className="bg-[--color-dark-gray] rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[--color-black-bg] border-b border-gray-700">
                  <tr className="text-left text-gray-400">
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Phone</th>
                    <th className="px-6 py-3">Event Type</th>
                    <th className="px-6 py-3">Event Date</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="border-b border-gray-700 hover:bg-[--color-black-bg]/50">
                      <td className="px-6 py-4 font-medium">{booking.name}</td>
                      <td className="px-6 py-4">{booking.phone}</td>
                      <td className="px-6 py-4">{formatEventType(booking.eventType)}</td>
                      <td className="px-6 py-4">{formatDate(booking.eventDate)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(booking.status)}`}>
                          {booking.status?.toUpperCase() || 'PENDING'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <select
                            value={booking.status || 'pending'}
                            onChange={(e) => updateBookingStatus(booking._id, e.target.value)}
                            className="px-2 py-1 bg-[--color-black-bg] border border-gray-600 rounded text-sm"
                          >
                            <option value="pending">Pending</option>
                            <option value="contacted">Contacted</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <button
                            onClick={() => deleteBooking(booking._id)}
                            className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-sm hover:bg-red-500/30"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setSelectedBooking(booking)}
                            className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-sm hover:bg-blue-500/30"
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Images Tab - Simplified for brevity */}
        {activeTab === 'images' && !searchResults && (
          <div>
            <div className="bg-[--color-dark-gray] rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">📸 Upload New Image</h3>
              <form onSubmit={uploadImage} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Image Title *</label>
                    <input
                      type="text"
                      value={imageForm.title}
                      onChange={(e) => setImageForm({...imageForm, title: e.target.value})}
                      className="w-full px-4 py-2 bg-[--color-black-bg] border border-gray-700 rounded-lg focus:outline-none focus:border-[--color-gold] text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Category</label>
                    <select
                      value={imageForm.category}
                      onChange={(e) => setImageForm({...imageForm, category: e.target.value})}
                      className="w-full px-4 py-2 bg-[--color-black-bg] border border-gray-700 rounded-lg focus:outline-none focus:border-[--color-gold] text-white"
                    >
                      <option value="wedding">Wedding</option>
                      <option value="birthday">Birthday</option>
                      <option value="engagement">Engagement</option>
                      <option value="corporate">Corporate</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Description (Optional)</label>
                  <textarea
                    value={imageForm.description}
                    onChange={(e) => setImageForm({...imageForm, description: e.target.value})}
                    rows="2"
                    className="w-full px-4 py-2 bg-[--color-black-bg] border border-gray-700 rounded-lg focus:outline-none focus:border-[--color-gold] text-white resize-none"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Select Image File *</label>
                  <input
                    type="file"
                    onChange={handleImageFileChange}
                    accept="image/*"
                    className="w-full px-4 py-2 bg-[--color-black-bg] border border-gray-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[--color-gold] file:text-black hover:file:bg-[--color-dark-gold] cursor-pointer"
                    required
                  />
                </div>
                {imagePreview && (
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Preview:</p>
                    <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
                  </div>
                )}
                <button type="submit" disabled={uploadingImage} className="btn-primary">
                  {uploadingImage ? 'Uploading...' : 'Upload Image'}
                </button>
              </form>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <div key={image._id} className="bg-[--color-dark-gray] rounded-lg overflow-hidden group">
                  <div className="relative">
                    <img src={image.imageUrl} alt={image.title} className="w-full h-48 object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => setSelectedImage(image)}
                        className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                      >
                        View
                      </button>
                      <button
                        onClick={() => deleteImage(image._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="text-sm font-semibold truncate">{image.title}</p>
                    <p className="text-xs text-gray-400">{image.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Videos Tab - Simplified */}
        {activeTab === 'videos' && !searchResults && (
          <div>
            <div className="bg-[--color-dark-gray] rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">🎥 Add Video</h3>
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setVideoUploadType('file')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    videoUploadType === 'file' 
                      ? 'bg-[--color-gold] text-black' 
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  📁 Upload Video File
                </button>
                <button
                  onClick={() => setVideoUploadType('link')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    videoUploadType === 'link' 
                      ? 'bg-[--color-gold] text-black' 
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  🔗 YouTube/Vimeo Link
                </button>
              </div>
              
              {videoUploadType === 'file' && (
                <form onSubmit={uploadVideoFile} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Video Title *</label>
                      <input
                        type="text"
                        value={videoFileForm.title}
                        onChange={(e) => setVideoFileForm({...videoFileForm, title: e.target.value})}
                        className="w-full px-4 py-2 bg-[--color-black-bg] border border-gray-700 rounded-lg focus:outline-none focus:border-[--color-gold] text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Category</label>
                      <select
                        value={videoFileForm.category}
                        onChange={(e) => setVideoFileForm({...videoFileForm, category: e.target.value})}
                        className="w-full px-4 py-2 bg-[--color-black-bg] border border-gray-700 rounded-lg focus:outline-none focus:border-[--color-gold] text-white"
                      >
                        <option value="wedding">Wedding</option>
                        <option value="birthday">Birthday</option>
                        <option value="engagement">Engagement</option>
                        <option value="corporate">Corporate</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Description</label>
                    <textarea
                      value={videoFileForm.description}
                      onChange={(e) => setVideoFileForm({...videoFileForm, description: e.target.value})}
                      rows="2"
                      className="w-full px-4 py-2 bg-[--color-black-bg] border border-gray-700 rounded-lg focus:outline-none focus:border-[--color-gold] text-white resize-none"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Select Video File *</label>
                    <input
                      type="file"
                      onChange={handleVideoFileChange}
                      accept="video/*"
                      className="w-full px-4 py-2 bg-[--color-black-bg] border border-gray-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[--color-gold] file:text-black hover:file:bg-[--color-dark-gold] cursor-pointer"
                      required
                    />
                  </div>
                  {videoFilePreview && (
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Preview:</p>
                      <video src={videoFilePreview} className="w-64 h-36 object-cover rounded-lg" controls />
                    </div>
                  )}
                  <button type="submit" disabled={uploadingVideoFile} className="btn-primary">
                    {uploadingVideoFile ? 'Uploading...' : 'Upload Video File'}
                  </button>
                </form>
              )}
              
              {videoUploadType === 'link' && (
                <form onSubmit={addVideoLink} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Video Title *</label>
                      <input
                        type="text"
                        value={videoLinkForm.title}
                        onChange={(e) => setVideoLinkForm({...videoLinkForm, title: e.target.value})}
                        className="w-full px-4 py-2 bg-[--color-black-bg] border border-gray-700 rounded-lg focus:outline-none focus:border-[--color-gold] text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Category</label>
                      <select
                        value={videoLinkForm.category}
                        onChange={(e) => setVideoLinkForm({...videoLinkForm, category: e.target.value})}
                        className="w-full px-4 py-2 bg-[--color-black-bg] border border-gray-700 rounded-lg focus:outline-none focus:border-[--color-gold] text-white"
                      >
                        <option value="wedding">Wedding</option>
                        <option value="birthday">Birthday</option>
                        <option value="engagement">Engagement</option>
                        <option value="corporate">Corporate</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Video URL (YouTube or Vimeo) *</label>
                    <input
                      type="url"
                      value={videoLinkForm.videoUrl}
                      onChange={(e) => setVideoLinkForm({...videoLinkForm, videoUrl: e.target.value})}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full px-4 py-2 bg-[--color-black-bg] border border-gray-700 rounded-lg focus:outline-none focus:border-[--color-gold] text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Description</label>
                    <textarea
                      value={videoLinkForm.description}
                      onChange={(e) => setVideoLinkForm({...videoLinkForm, description: e.target.value})}
                      rows="2"
                      className="w-full px-4 py-2 bg-[--color-black-bg] border border-gray-700 rounded-lg focus:outline-none focus:border-[--color-gold] text-white resize-none"
                    ></textarea>
                  </div>
                  <button type="submit" disabled={addingVideoLink} className="btn-primary">
                    {addingVideoLink ? 'Adding...' : 'Add Video Link'}
                  </button>
                </form>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videos.map((video) => (
                <div key={video._id} className="bg-[--color-dark-gray] rounded-lg overflow-hidden">
                  <div className="relative pb-[56.25%]">
                    {video.type === 'file' ? (
                      <video src={video.videoUrl} className="absolute top-0 left-0 w-full h-full object-cover" controls />
                    ) : (
                      <iframe
                        src={video.videoUrl?.replace('watch?v=', 'embed/')}
                        title={video.title}
                        className="absolute top-0 left-0 w-full h-full"
                        frameBorder="0"
                        allowFullScreen
                      ></iframe>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{video.title}</h3>
                        <p className="text-sm text-gray-400">{video.category}</p>
                      </div>
                      <button
                        onClick={() => deleteVideo(video._id)}
                        className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-sm hover:bg-red-500/30"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Packages Tab */}
        {activeTab === 'packages' && !searchResults && (
          <div>
            <div className="mb-6">
              <button onClick={handleAddPackage} className="btn-primary">
                + Add New Package
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <div key={pkg._id} className="bg-[--color-dark-gray] rounded-lg p-6">
                  <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-[--color-gold]">ETB {pkg.price}</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {pkg.features?.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-300 text-sm">
                        <span className="text-[--color-gold]">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditPackage(pkg)}
                      className="flex-1 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deletePackage(pkg._id)}
                      className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Package Modal */}
        {showPackageModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowPackageModal(false)}>
            <div className="bg-[--color-dark-gray] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-[--color-dark-gray] px-6 py-4 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-white">
                  {editingPackage ? 'Edit Package' : 'Add New Package'}
                </h3>
                <button onClick={() => setShowPackageModal(false)} className="text-gray-400 hover:text-white text-2xl">×</button>
              </div>
              <form onSubmit={savePackage} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-white">Package Name *</label>
                    <input
                      type="text"
                      value={packageForm.name}
                      onChange={(e) => setPackageForm({...packageForm, name: e.target.value})}
                      className="w-full px-4 py-2 bg-[--color-black-bg] border border-gray-700 rounded-lg focus:outline-none focus:border-[--color-gold] text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-white">Price (ETB) *</label>
                    <input
                      type="text"
                      value={packageForm.price}
                      onChange={(e) => setPackageForm({...packageForm, price: e.target.value})}
                      className="w-full px-4 py-2 bg-[--color-black-bg] border border-gray-700 rounded-lg focus:outline-none focus:border-[--color-gold] text-white"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2 text-white">Description (Optional)</label>
                  <textarea
                    value={packageForm.description}
                    onChange={(e) => setPackageForm({...packageForm, description: e.target.value})}
                    rows="2"
                    className="w-full px-4 py-2 bg-[--color-black-bg] border border-gray-700 rounded-lg focus:outline-none focus:border-[--color-gold] text-white resize-none"
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2 text-white">Features</label>
                  {packageForm.features.map((feature, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        className="flex-1 px-4 py-2 bg-[--color-black-bg] border border-gray-700 rounded-lg focus:outline-none focus:border-[--color-gold] text-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(index)}
                        className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="mt-2 text-sm text-[--color-gold] hover:underline"
                  >
                    + Add Feature
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="popular"
                    checked={packageForm.popular}
                    onChange={(e) => setPackageForm({...packageForm, popular: e.target.checked})}
                    className="w-4 h-4 accent-[--color-gold]"
                  />
                  <label htmlFor="popular" className="text-sm font-semibold text-white">Mark as "Most Popular"</label>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button type="submit" disabled={savingPackage} className="flex-1 btn-primary">
                    {savingPackage ? 'Saving...' : (editingPackage ? 'Update Package' : 'Add Package')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPackageModal(false)}
                    className="flex-1 px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Booking Details Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedBooking(null)}>
            <div className="bg-[--color-dark-gray] rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-[--color-dark-gray] px-6 py-4 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-xl font-semibold">Booking Details</h3>
                <button onClick={() => setSelectedBooking(null)} className="text-gray-400 hover:text-white text-2xl">×</button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-gray-400 text-sm">Name</label><p className="font-medium">{selectedBooking.name}</p></div>
                  <div><label className="text-gray-400 text-sm">Phone</label><p className="font-medium">{selectedBooking.phone}</p></div>
                  <div><label className="text-gray-400 text-sm">Email</label><p className="font-medium">{selectedBooking.email || 'Not provided'}</p></div>
                  <div><label className="text-gray-400 text-sm">Event Type</label><p className="font-medium">{formatEventType(selectedBooking.eventType)}</p></div>
                  <div><label className="text-gray-400 text-sm">Event Date</label><p className="font-medium">{formatDate(selectedBooking.eventDate)}</p></div>
                  <div><label className="text-gray-400 text-sm">Event Location</label><p className="font-medium">{selectedBooking.eventLocation}</p></div>
                </div>
                <div><label className="text-gray-400 text-sm">Message</label><p className="mt-1 p-3 bg-[--color-black-bg] rounded-lg">{selectedBooking.message || 'No message provided'}</p></div>
              </div>
            </div>
          </div>
        )}

        {/* Image Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4" onClick={() => setSelectedImage(null)}>
            <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setSelectedImage(null)} className="absolute -top-12 right-0 text-white text-3xl hover:text-[--color-gold]">×</button>
              <img src={selectedImage.imageUrl} alt={selectedImage.title} className="w-full h-auto rounded-lg" />
              <div className="mt-4 text-center"><h3 className="text-xl font-semibold">{selectedImage.title}</h3><p className="text-gray-400">{selectedImage.description}</p></div>
            </div>
          </div>
        )}

        {/* Video Modal */}
        {selectedVideo && (
          <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4" onClick={() => setSelectedVideo(null)}>
            <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setSelectedVideo(null)} className="absolute -top-12 right-0 text-white text-3xl hover:text-[--color-gold]">×</button>
              <div className="relative pb-[56.25%]">
                {selectedVideo.type === 'file' ? (
                  <video src={selectedVideo.videoUrl} className="absolute top-0 left-0 w-full h-full" controls autoPlay />
                ) : (
                  <iframe
                    src={selectedVideo.videoUrl?.replace('watch?v=', 'embed/')}
                    title={selectedVideo.title}
                    className="absolute top-0 left-0 w-full h-full"
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                )}
              </div>
              <div className="mt-4 text-center"><h3 className="text-2xl font-semibold text-white">{selectedVideo.title}</h3><p className="text-gray-400 mt-2">{selectedVideo.description}</p></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;