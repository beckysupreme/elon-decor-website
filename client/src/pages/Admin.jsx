import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  
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
    const response = await axios.get('http://localhost:5000/api/bookings');
    if (response.data && response.data.success) {
      console.log('Bookings data:', response.data.data);
      // Log the first booking to see its structure
      if (response.data.data && response.data.data.length > 0) {
        console.log('First booking structure:', response.data.data[0]);
        console.log('ID field:', response.data.data[0]._id);
      }
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
      const response = await axios.get('http://localhost:5000/api/gallery');
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
      const response = await axios.get('http://localhost:5000/api/videos');
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
      const response = await axios.get('http://localhost:5000/api/packages');
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
      const response = await axios.get(`http://localhost:5000/api/search?q=${searchQuery}`);
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
      const response = await axios.patch(`http://localhost:5000/api/bookings/${id}/status`, {
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

// Delete booking - FIXED
const deleteBooking = async (id) => {
  // Handle both id and _id
  const bookingId = id?._id || id;
  console.log('Delete button clicked, received ID:', id);
  console.log('Using bookingId:', bookingId);
  
  if (!bookingId) {
    alert('No booking ID found. Please refresh the page and try again.');
    return;
  }
  
  if (window.confirm('Are you sure you want to delete this booking?')) {
    try {
      const response = await axios.delete(`http://localhost:5000/api/bookings/${bookingId}`);
      console.log('Delete response:', response.data);
      
      if (response.data && response.data.success) {
        alert('Booking deleted successfully');
        await fetchBookings();
      } else {
        alert('Failed to delete booking: ' + (response.data?.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete booking: ' + (error.response?.data?.message || error.message));
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

  // Add axios interceptor to add token to all requests
   useEffect(() => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    navigate('/login');
    return;
  }
  
  // Add token to all axios requests
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  
  // Verify token
  const verifyToken = async () => {
    try {
      await axios.get('http://localhost:5000/api/admin-auth/verify');
    } catch (error) {
      localStorage.removeItem('adminToken');
      navigate('/login');
    }
  };
  verifyToken();
}, [navigate]);


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
        const response = await axios.put(`http://localhost:5000/api/packages/${editingPackage.id}`, {
          ...packageForm,
          features: filteredFeatures
        });
        if (response.data && response.data.success) {
          alert('Package updated successfully!');
        }
      } else {
        const response = await axios.post('http://localhost:5000/api/packages', {
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

// Delete package - FIXED
const deletePackage = async (id) => {
  const packageId = id?._id || id;
  console.log('Deleting package with ID:', packageId);
  
  if (!packageId) {
    alert('No package ID found');
    return;
  }
  
  if (window.confirm('Are you sure you want to delete this package?')) {
    try {
      const response = await axios.delete(`http://localhost:5000/api/packages/${packageId}`);
      if (response.data && response.data.success) {
        alert('Package deleted successfully');
        await fetchPackages();
      } else {
        alert('Failed to delete package');
      }
    } catch (error) {
      console.error('Delete error:', error);
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
      const response = await axios.post('http://localhost:5000/api/gallery/upload', formData, {
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
      alert('Failed to upload image. Make sure the backend server is running.');
    } finally {
      setUploadingImage(false);
    }
  };

// Delete image - FIXED
const deleteImage = async (id) => {
  const imageId = id?._id || id;
  console.log('Deleting image with ID:', imageId);
  
  if (!imageId) {
    alert('No image ID found');
    return;
  }
  
  if (window.confirm('Are you sure you want to delete this image?')) {
    try {
      const response = await axios.delete(`http://localhost:5000/api/gallery/${imageId}`);
      if (response.data && response.data.success) {
        alert('Image deleted successfully');
        await fetchImages();
      } else {
        alert('Failed to delete image');
      }
    } catch (error) {
      console.error('Delete error:', error);
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
      const response = await axios.post('http://localhost:5000/api/videos/upload', formData, {
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
      alert('Failed to upload video. Make sure the backend server is running.');
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
      const response = await axios.post('http://localhost:5000/api/videos/link', videoLinkForm);
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

  // Delete video - FIXED
const deleteVideo = async (id) => {
  const videoId = id?._id || id;
  console.log('Deleting video with ID:', videoId);
  
  if (!videoId) {
    alert('No video ID found');
    return;
  }
  
  if (window.confirm('Are you sure you want to delete this video?')) {
    try {
      const response = await axios.delete(`http://localhost:5000/api/videos/${videoId}`);
      if (response.data && response.data.success) {
        alert('Video deleted successfully');
        await fetchVideos();
      } else {
        alert('Failed to delete video');
      }
    } catch (error) {
      console.error('Delete error:', error);
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
      <div className="bg-gradient-to-r from-[--color-black-bg] to-[--color-dark-gray] border-b border-[--color-gold]/20">
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
              className="px-6 py-2 bg-[--color-gold] text-black rounded-lg font-semibold hover:bg-[--color-dark-gold] transition-colors"
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
            
            {searchResults.bookings?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[--color-gold] mb-2">Bookings ({searchResults.bookings.length})</h3>
                <div className="space-y-2">
                  {searchResults.bookings.map(booking => (
                    <div key={booking.id} className="bg-[--color-dark-gray] p-3 rounded-lg flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{booking.name}</p>
                        <p className="text-sm text-gray-400">{booking.phone} - {formatEventType(booking.eventType)}</p>
                      </div>
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="text-[--color-gold] hover:underline text-sm"
                      >
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {searchResults.images?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[--color-gold] mb-2">Images ({searchResults.images.length})</h3>
                <div className="grid grid-cols-3 gap-2">
                  {searchResults.images.map(image => (
                    <div key={image.id} className="relative cursor-pointer" onClick={() => setSelectedImage(image)}>
                      <img src={image.imageUrl} alt={image.title} className="w-full h-24 object-cover rounded" />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {searchResults.videos?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[--color-gold] mb-2">Videos ({searchResults.videos.length})</h3>
                <div className="space-y-2">
                  {searchResults.videos.map(video => (
                    <div key={video.id} className="bg-[--color-dark-gray] p-3 rounded-lg flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{video.title}</p>
                        <p className="text-sm text-gray-400">{video.category}</p>
                      </div>
                      <button
                        onClick={() => setSelectedVideo(video)}
                        className="text-[--color-gold] hover:underline text-sm"
                      >
                        Watch
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchResults.packages?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[--color-gold] mb-2">Packages ({searchResults.packages.length})</h3>
                <div className="space-y-2">
                  {searchResults.packages.map(pkg => (
                    <div key={pkg.id} className="bg-[--color-dark-gray] p-3 rounded-lg flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{pkg.name}</p>
                        <p className="text-sm text-gray-400">ETB {pkg.price}</p>
                      </div>
                      <button
                        onClick={() => handleEditPackage(pkg)}
                        className="text-[--color-gold] hover:underline text-sm"
                      >
                        Edit
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {searchResults.bookings?.length === 0 && 
             searchResults.images?.length === 0 && 
             searchResults.videos?.length === 0 &&
             searchResults.packages?.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No results found for "{searchQuery}"
              </div>
            )}
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
                  {!bookings || bookings.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                        No bookings yet
                       </td>
                    </tr>
                  ) : (
                    bookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-gray-700 hover:bg-[--color-black-bg]/50">
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
                              className="btn-now"
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Images Tab */}
        {activeTab === 'images' && !searchResults && (
          <div>
            {/* Upload Image Form */}
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
                      className="btn-now"
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
                <button
                  type="submit"
                  disabled={uploadingImage}
                  className="btn-primary"
                >
                  {uploadingImage ? 'Uploading...' : 'Upload Image'}
                </button>
              </form>
            </div>

            {/* Images Grid */}
            <h3 className="text-lg font-semibold mb-4">📷 Gallery Images ({images?.length || 0})</h3>
            {!images || images.length === 0 ? (
              <div className="text-center py-12 text-gray-400">No images yet. Upload your first image above!</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image) => (
                  <div key={image.id} className="bg-[--color-dark-gray] rounded-lg overflow-hidden group">
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
            )}
          </div>
        )}

        {/* Videos Tab */}
        {activeTab === 'videos' && !searchResults && (
          <div>
            {/* Video Upload Options */}
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
                        className="btn-now"
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
                  <button
                    type="submit"
                    disabled={uploadingVideoFile}
                    className="btn-primary"
                  >
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
                  <button
                    type="submit"
                    disabled={addingVideoLink}
                    className="btn-primary"
                  >
                    {addingVideoLink ? 'Adding...' : 'Add Video Link'}
                  </button>
                </form>
              )}
            </div>

            {/* Videos List */}
            <h3 className="text-lg font-semibold mb-4">🎬 All Videos ({videos?.length || 0})</h3>
            {!videos || videos.length === 0 ? (
              <div className="text-center py-12 text-gray-400">No videos yet. Upload your first video above!</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {videos.map((video) => (
                  <div key={video.id} className="bg-[--color-dark-gray] rounded-lg overflow-hidden">
                    <div className="relative pb-[56.25%]">
                      {video.type === 'file' ? (
                        <video 
                          src={video.videoUrl} 
                          className="absolute top-0 left-0 w-full h-full object-cover"
                          controls
                        />
                      ) : (
                        <iframe
                          src={video.videoUrl?.replace('watch?v=', 'embed/')}
                          title={video.title}
                          className="absolute top-0 left-0 w-full h-full"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{video.title}</h3>
                          <p className="text-sm text-gray-400">{video.category}</p>
                          {video.description && <p className="text-sm text-gray-400 mt-1">{video.description}</p>}
                          <p className="text-xs text-gray-500 mt-1">{video.type === 'file' ? '📁 Uploaded File' : '🔗 External Link'}</p>
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
            )}
          </div>
        )}

        {/* Packages Tab */}
        {activeTab === 'packages' && !searchResults && (
          <div>
            {/* Add Package Button */}
            <div className="mb-6">
              <button
                onClick={handleAddPackage}
                className="btn-primary"
              >
                + Add New Package
              </button>
            </div>

            {/* Packages Grid */}
            {!packages || packages.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                No packages yet. Click "Add New Package" to create one.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                  <div 
                    key={pkg.id}
                    className={`relative bg-[--color-dark-gray] rounded-lg overflow-hidden ${
                      pkg.popular ? 'border-2 border-[--color-gold]' : ''
                    }`}
                  >
                    {pkg.popular && (
                      <div className="absolute top-0 right-0 bg-[--color-gold] text-black px-4 py-1 text-sm font-semibold rounded-bl-lg">
                        Most Popular
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                      <div className="mb-4">
                        <span className="text-3xl font-bold text-[--color-gold]">ETB {pkg.price}</span>
                        <span className="text-gray-400"> / event</span>
                      </div>
                      {pkg.description && (
                        <p className="text-gray-400 text-sm mb-4">{pkg.description}</p>
                      )}
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
                          className="flex-1 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deletePackage(pkg._id)}
                          className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Package Modal */}
        {showPackageModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowPackageModal(false)}>
            <div className="bg-[--color-dark-gray] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-[--color-dark-gray] px-6 py-4 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-xl font-semibold">
                  {editingPackage ? 'Edit Package' : 'Add New Package'}
                </h3>
                <button onClick={() => setShowPackageModal(false)} className="text-gray-400 hover:text-white text-2xl">×</button>
              </div>
              <form onSubmit={savePackage} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Package Name *</label>
                    <input
                      type="text"
                      value={packageForm.name}
                      onChange={(e) => setPackageForm({...packageForm, name: e.target.value})}
                      className="w-full px-4 py-2 bg-[--color-black-bg] border border-gray-700 rounded-lg focus:outline-none focus:border-[--color-gold] text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Price (ETB) *</label>
                    <input
                      type="text"
                      value={packageForm.price}
                      onChange={(e) => setPackageForm({...packageForm, price: e.target.value})}
                      placeholder="30,000"
                      className="w-full px-4 py-2 bg-[--color-black-bg] border border-gray-700 rounded-lg focus:outline-none focus:border-[--color-gold] text-white"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2">Description (Optional)</label>
                  <textarea
                    value={packageForm.description}
                    onChange={(e) => setPackageForm({...packageForm, description: e.target.value})}
                    rows="2"
                    className="w-full px-4 py-2 bg-[--color-black-bg] border border-gray-700 rounded-lg focus:outline-none focus:border-[--color-gold] text-white resize-none"
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2">Features</label>
                  {packageForm.features.map((feature, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        placeholder="e.g., Premium flower arrangements"
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
                  <label htmlFor="popular" className="text-sm font-semibold">Mark as "Most Popular"</label>
                </div>
                
                <div className="flex gap-3 pt-4">
  <button
    type="submit"
    disabled={savingPackage}
    className="flex-1 px-6 py-2 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-600 disabled:opacity-50 transition-colors"
  >
    {savingPackage ? 'Saving...' : (editingPackage ? 'Update Package' : 'Add Package')}
  </button>
  <button
    type="button"
    onClick={() => setShowPackageModal(false)}
    className="flex-1 px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
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
                  <div><label className="text-gray-400 text-sm">Guest Count</label><p className="font-medium">{selectedBooking.guestCount || 'Not specified'}</p></div>
                  <div><label className="text-gray-400 text-sm">Budget</label><p className="font-medium">{selectedBooking.budget || 'Not specified'}</p></div>
                </div>
                <div><label className="text-gray-400 text-sm">Message</label><p className="mt-1 p-3 bg-[--color-black-bg] rounded-lg">{selectedBooking.message || 'No message provided'}</p></div>
                <div><label className="text-gray-400 text-sm">Booked On</label><p className="mt-1">{new Date(selectedBooking.createdAt).toLocaleString()}</p></div>
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
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                )}
              </div>
              <div className="mt-4 text-center"><h3 className="text-2xl font-semibold">{selectedVideo.title}</h3><p className="text-gray-400 mt-2">{selectedVideo.description}</p></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;