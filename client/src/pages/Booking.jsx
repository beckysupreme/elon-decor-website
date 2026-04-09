import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';

// Form validation schema
const bookingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name is too long'),
  phone: z.string().min(10, 'Please enter a valid phone number').max(15, 'Phone number is too long'),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  eventType: z.string().min(1, 'Please select an event type'),
  eventDate: z.string().min(1, 'Please select an event date'),
  eventLocation: z.string().min(5, 'Please enter a valid location').max(200, 'Location is too long'),
  guestCount: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().max(500, 'Message is too long').optional(),
});

const Booking = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      eventType: '',
      eventDate: '',
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      // Send booking data to backend
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: 'Booking request sent successfully! We will contact you within 24 hours.',
        });
        reset(); // Clear the form
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.message || 'Something went wrong. Please try again.',
        });
      }
    } catch (error) {
      console.error('Booking error:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Something went wrong. Please try again or contact us directly.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[--color-black-bg] to-[--color-dark-gray] py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-[--font-playfair] font-bold mb-4">
            Book Your <span className="text-[--color-gold]">Event</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Fill out the form below and we'll get back to you within 24 hours to discuss your event details
          </p>
        </div>
      </section>
      
      {/* Booking Form */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="bg-[--color-dark-gray] rounded-lg p-6 md:p-8">
            {submitStatus && (
              <div className={`mb-6 p-4 rounded-lg ${
                submitStatus.type === 'success' 
                  ? 'bg-green-500/20 border border-green-500 text-green-400' 
                  : 'bg-red-500/20 border border-red-500 text-red-400'
              }`}>
                {submitStatus.message}
              </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Full Name <span className="text-[--color-gold]">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('name')}
                    className="w-full px-4 py-2 bg-[--color-black-bg] border border-gray-700 rounded-lg focus:outline-none focus:border-[--color-gold] text-white"
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Phone Number <span className="text-[--color-gold]">*</span>
                  </label>
                  <input
                    type="tel"
                    {...register('phone')}
                    className="w-full px-4 py-2 bg-[--color-black-bg] border border-gray-700 rounded-lg focus:outline-none focus:border-[--color-gold] text-white"
                    placeholder="+251 912 345 678"
                  />
                  {errors.phone && (
                    <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full px-4 py-2 bg-[--color-black-bg] border border-gray-700 rounded-lg focus:outline-none focus:border-[--color-gold] text-white"
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                {/* Event Type */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Event Type <span className="text-[--color-gold]">*</span>
                  </label>
                  <select
                    {...register('eventType')}
                    className="btn-now"
                  >
                    <option value="">Select event type</option>
                    <option value="wedding">Wedding</option>
                    <option value="birthday">Birthday</option>
                    <option value="engagement">Engagement</option>
                    <option value="corporate">Corporate Event</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.eventType && (
                    <p className="text-red-400 text-sm mt-1">{errors.eventType.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Event Date */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Event Date <span className="text-[--color-gold]">*</span>
                  </label>
                  <input
                    type="date"
                    {...register('eventDate')}
                    className="w-full px-4 py-2 bg-[--color-black-bg] border border-gray-700 rounded-lg focus:outline-none focus:border-[--color-gold] text-white"
                  />
                  {errors.eventDate && (
                    <p className="text-red-400 text-sm mt-1">{errors.eventDate.message}</p>
                  )}
                </div>

                {/* Guest Count */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Estimated Guest Count (Optional)
                  </label>
                  <input
                    type="number"
                    {...register('guestCount')}
                    className="w-full px-4 py-2 bg-[--color-black-bg] border border-gray-700 rounded-lg focus:outline-none focus:border-[--color-gold] text-white"
                    placeholder="50"
                  />
                </div>
              </div>

              {/* Event Location */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Event Location <span className="text-[--color-gold]">*</span>
                </label>
                <input
                  type="text"
                  {...register('eventLocation')}
                  className="w-full px-4 py-2 bg-[--color-black-bg] border border-gray-700 rounded-lg focus:outline-none focus:border-[--color-gold] text-white"
                  placeholder="Hotel name, venue address, or area in Addis Ababa"
                />
                {errors.eventLocation && (
                  <p className="text-red-400 text-sm mt-1">{errors.eventLocation.message}</p>
                )}
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Estimated Budget (Optional)
                </label>
                <select
                  {...register('budget')}
                  className="btn-now"
                >
                  <option value="">Select budget range</option>
                  <option value="under-10k">Under ETB 10,000</option>
                  <option value="10k-25k">ETB 10,000 - 25,000</option>
                  <option value="25k-50k">ETB 25,000 - 50,000</option>
                  <option value="50k-100k">ETB 50,000 - 100,000</option>
                  <option value="above-100k">Above ETB 100,000</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Additional Message or Requirements (Optional)
                </label>
                <textarea
                  {...register('message')}
                  rows={4}
                  className="w-full px-4 py-2 bg-[--color-black-bg] border border-gray-700 rounded-lg focus:outline-none focus:border-[--color-gold] text-white resize-none"
                  placeholder="Tell us more about your vision, theme, or special requirements..."
                ></textarea>
                {errors.message && (
                  <p className="text-red-400 text-sm mt-1">{errors.message.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Booking Request'}
              </button>

              <p className="text-gray-400 text-xs text-center mt-4">
                By submitting this form, you agree to our privacy policy. We'll contact you within 24 hours.
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Booking;