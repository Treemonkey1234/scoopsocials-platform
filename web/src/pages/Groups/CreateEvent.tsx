import React, { useState } from 'react';

interface CreateEventProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: () => void;
}

interface EventFormData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  category: string;
  address: string;
  visibility: 'public' | 'private';
  capacity: number;
  trustScoreMin: number;
  enforceTrustScore: boolean;
}

const CreateEvent: React.FC<CreateEventProps> = ({ isOpen, onClose, onEventCreated }) => {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    category: 'social',
    address: '',
    visibility: 'public',
    capacity: 50,
    trustScoreMin: 0,
    enforceTrustScore: false
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const categories = [
    'social', 'professional', 'educational', 'entertainment', 
    'sports', 'health', 'food', 'travel', 'technology', 
    'arts', 'music', 'gaming', 'charity', 'religious', 'other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    try {
      const token = localStorage.getItem('token');
      
      // Validate dates
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      
      if (start >= end) {
        setErrors(['End date must be after start date']);
        setLoading(false);
        return;
      }

      if (start <= new Date()) {
        setErrors(['Start date must be in the future']);
        setLoading(false);
        return;
      }

      // Get coordinates for address (simplified - in real app would use geocoding API)
      const mockCoordinates = [-74.0060, 40.7128]; // Default NYC coordinates

      const eventData = {
        title: formData.title,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        category: formData.category,
        location: {
          type: 'physical',
          physical: {
            address: formData.address,
            coordinates: {
              latitude: mockCoordinates[1],
              longitude: mockCoordinates[0]
            }
          }
        },
        visibility: formData.visibility,
        capacity: {
          max: formData.capacity
        },
        trustScoreRequirement: {
          min: formData.trustScoreMin,
          enforced: formData.enforceTrustScore
        }
      };

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
      });

      if (response.ok) {
        onEventCreated();
        onClose();
        // Reset form
        setFormData({
          title: '',
          description: '',
          startDate: '',
          endDate: '',
          category: 'social',
          address: '',
          visibility: 'public',
          capacity: 50,
          trustScoreMin: 0,
          enforceTrustScore: false
        });
      } else {
        const errorData = await response.json();
        setErrors([errorData.message || 'Failed to create event']);
      }
    } catch (error) {
      setErrors(['An error occurred while creating the event']);
      console.error('Create event error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create New Event</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="text-red-800">
              {errors.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Enter event title"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Describe your event..."
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                Start Date & Time *
              </label>
              <input
                type="datetime-local"
                id="startDate"
                name="startDate"
                required
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                End Date & Time *
              </label>
              <input
                type="datetime-local"
                id="endDate"
                name="endDate"
                required
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          {/* Category and Visibility */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="visibility" className="block text-sm font-medium text-gray-700 mb-2">
                Visibility
              </label>
              <select
                id="visibility"
                name="visibility"
                value={formData.visibility}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Address *
            </label>
            <input
              type="text"
              id="address"
              name="address"
              required
              value={formData.address}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Enter event address"
            />
          </div>

          {/* Capacity */}
          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Capacity (up to 200)
            </label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              min="1"
              max="200"
              value={formData.capacity}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Trust Score Requirements */}
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enforceTrustScore"
                name="enforceTrustScore"
                checked={formData.enforceTrustScore}
                onChange={handleInputChange}
                className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
              />
              <label htmlFor="enforceTrustScore" className="ml-2 block text-sm text-gray-700">
                Enforce minimum trust score requirement
              </label>
            </div>
            
            {formData.enforceTrustScore && (
              <div>
                <label htmlFor="trustScoreMin" className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Trust Score (0-100)
                </label>
                <input
                  type="number"
                  id="trustScoreMin"
                  name="trustScoreMin"
                  min="0"
                  max="100"
                  value={formData.trustScoreMin}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md font-medium hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-cyan-600 text-white px-4 py-2 rounded-md font-medium hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;