import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import CreateEvent from './CreateEvent';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

interface Event {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  category: string;
  organizer: {
    username: string;
    firstName: string;
    lastName: string;
    trustScore: { current: number };
  };
  goingCount: number;
  capacity: number;
  coordinates: [number, number];
  address: string;
  trustScoreRequired: number;
}

interface GroupsProps {}

const Groups: React.FC<GroupsProps> = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([40.7128, -74.0060]); // Default to NYC
  const [radius, setRadius] = useState(5000); // 5km default
  const [categoryFilter, setCategoryFilter] = useState('');

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [
            position.coords.latitude,
            position.coords.longitude
          ];
          setUserLocation(coords);
          setMapCenter(coords);
          fetchMapEvents(coords[0], coords[1]);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to default location
          fetchMapEvents(40.7128, -74.0060);
        }
      );
    }
  }, []);

  const fetchMapEvents = async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams({
        lat: lat.toString(),
        lng: lng.toString(),
        radius: radius.toString(),
        ...(categoryFilter && { category: categoryFilter })
      });

      const response = await fetch(`/api/events/map?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setEvents(data.events);
      } else {
        console.error('Failed to fetch events');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async (eventId: string, status: 'going' | 'maybe' | 'not-going') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/events/${eventId}/rsvp`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        // Refresh events
        if (userLocation) {
          fetchMapEvents(userLocation[0], userLocation[1]);
        }
      } else {
        console.error('Failed to RSVP');
      }
    } catch (error) {
      console.error('Error RSVPing:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      social: 'bg-blue-100 text-blue-800',
      professional: 'bg-green-100 text-green-800',
      educational: 'bg-purple-100 text-purple-800',
      entertainment: 'bg-pink-100 text-pink-800',
      sports: 'bg-orange-100 text-orange-800',
      health: 'bg-red-100 text-red-800',
      food: 'bg-yellow-100 text-yellow-800',
      travel: 'bg-indigo-100 text-indigo-800',
      technology: 'bg-gray-100 text-gray-800',
      arts: 'bg-teal-100 text-teal-800',
      music: 'bg-rose-100 text-rose-800',
      gaming: 'bg-violet-100 text-violet-800',
      default: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.default;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Groups</h1>
              <p className="text-gray-600">Discover local events and activities near you</p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-cyan-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-cyan-700 transition-colors"
            >
              Create Event
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="">All Categories</option>
                <option value="social">Social</option>
                <option value="professional">Professional</option>
                <option value="educational">Educational</option>
                <option value="entertainment">Entertainment</option>
                <option value="sports">Sports</option>
                <option value="health">Health</option>
                <option value="food">Food</option>
                <option value="travel">Travel</option>
                <option value="technology">Technology</option>
                <option value="arts">Arts</option>
                <option value="music">Music</option>
                <option value="gaming">Gaming</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Radius
              </label>
              <select
                value={radius}
                onChange={(e) => setRadius(parseInt(e.target.value))}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value={1000}>1 km</option>
                <option value={5000}>5 km</option>
                <option value={10000}>10 km</option>
                <option value={25000}>25 km</option>
                <option value={50000}>50 km</option>
              </select>
            </div>

            <button
              onClick={() => userLocation && fetchMapEvents(userLocation[0], userLocation[1])}
              disabled={loading || !userLocation}
              className="bg-cyan-600 text-white px-4 py-2 rounded-md font-medium hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="h-96 lg:h-[600px]">
                <MapContainer
                  center={mapCenter}
                  zoom={13}
                  className="h-full w-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  
                  {/* User location marker */}
                  {userLocation && (
                    <Marker position={userLocation}>
                      <Popup>Your location</Popup>
                    </Marker>
                  )}

                  {/* Event markers */}
                  {events.map((event) => (
                    <Marker
                      key={event.id}
                      position={event.coordinates}
                      eventHandlers={{
                        click: () => setSelectedEvent(event)
                      }}
                    >
                      <Popup>
                        <div className="w-64">
                          <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {formatDate(event.startDate)}
                          </p>
                          <div className="flex items-center justify-between mb-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                              {event.category}
                            </span>
                            <span className="text-sm text-gray-500">
                              {event.goingCount}/{event.capacity || '∞'} going
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleRSVP(event.id, 'going')}
                              className="flex-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                            >
                              Going
                            </button>
                            <button
                              onClick={() => handleRSVP(event.id, 'maybe')}
                              className="flex-1 bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
                            >
                              Maybe
                            </button>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>
          </div>

          {/* Event List */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">
              Events Near You ({events.length})
            </h2>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading events...</p>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No events found in your area.</p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="text-cyan-600 hover:text-cyan-700 font-medium mt-2"
                >
                  Create the first event!
                </button>
              </div>
            ) : (
              events.map((event) => (
                <div
                  key={event.id}
                  className={`bg-white rounded-lg shadow-sm p-4 cursor-pointer border-2 transition-colors ${
                    selectedEvent?.id === event.id ? 'border-cyan-500' : 'border-transparent hover:border-gray-200'
                  }`}
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-2">
                      {event.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                      {event.category}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    📅 {formatDate(event.startDate)}
                  </p>
                  
                  <p className="text-sm text-gray-600 mb-3">
                    📍 {event.address}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        By {event.organizer.firstName} {event.organizer.lastName}
                      </span>
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                        Trust: {event.organizer.trustScore.current}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {event.goingCount} going
                    </span>
                  </div>

                  {event.trustScoreRequired > 0 && (
                    <div className="mb-3">
                      <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                        Min Trust Score: {event.trustScoreRequired}
                      </span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRSVP(event.id, 'going');
                      }}
                      className="flex-1 bg-green-600 text-white px-3 py-2 rounded font-medium hover:bg-green-700 transition-colors"
                    >
                      Going
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRSVP(event.id, 'maybe');
                      }}
                      className="flex-1 bg-yellow-600 text-white px-3 py-2 rounded font-medium hover:bg-yellow-700 transition-colors"
                    >
                      Maybe
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRSVP(event.id, 'not-going');
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded font-medium hover:bg-gray-50 transition-colors"
                    >
                      Can&apos;t Go
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Create Event Modal */}
      <CreateEvent
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onEventCreated={() => {
          // Refresh events after creation
          if (userLocation) {
            fetchMapEvents(userLocation[0], userLocation[1]);
          }
        }}
      />
    </div>
  );
};

export default Groups;