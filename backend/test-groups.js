// Quick test script for Groups API endpoints
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Mock authentication token (in real app this would be from login)
const mockToken = 'mock-token-for-testing';

async function testGroupsAPI() {
  console.log('🧪 Testing Groups API Endpoints...\n');

  try {
    // Test 1: Get events with location filter
    console.log('1. Testing GET /api/events with location filter...');
    try {
      const response = await axios.get(`${BASE_URL}/events`, {
        params: {
          lat: 40.7128,
          lng: -74.0060,
          radius: 5000
        },
        headers: {
          'Authorization': `Bearer ${mockToken}`
        }
      });
      console.log('✅ Events endpoint working');
      console.log(`   Found ${response.data.events?.length || 0} events\n`);
    } catch (error) {
      console.log(`❌ Events endpoint error: ${error.response?.status} - ${error.response?.data?.message || error.message}\n`);
    }

    // Test 2: Get map events
    console.log('2. Testing GET /api/events/map...');
    try {
      const response = await axios.get(`${BASE_URL}/events/map`, {
        params: {
          lat: 40.7128,
          lng: -74.0060,
          radius: 5000
        },
        headers: {
          'Authorization': `Bearer ${mockToken}`
        }
      });
      console.log('✅ Map events endpoint working');
      console.log(`   Found ${response.data.events?.length || 0} map events\n`);
    } catch (error) {
      console.log(`❌ Map events endpoint error: ${error.response?.status} - ${error.response?.data?.message || error.message}\n`);
    }

    // Test 3: Test event creation (will fail due to auth, but should show validation)
    console.log('3. Testing POST /api/events (event creation)...');
    try {
      const eventData = {
        title: 'Test Groups Event',
        description: 'A test event for the Groups feature',
        startDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        endDate: new Date(Date.now() + 90000000).toISOString(), // Tomorrow + 1 hour
        category: 'social',
        location: {
          type: 'physical',
          physical: {
            address: '123 Test St, New York, NY',
            coordinates: {
              latitude: 40.7128,
              longitude: -74.0060
            }
          }
        }
      };

      const response = await axios.post(`${BASE_URL}/events`, eventData, {
        headers: {
          'Authorization': `Bearer ${mockToken}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ Event creation endpoint working');
      console.log(`   Created event: ${response.data.event?.title}\n`);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Event creation endpoint working (auth required as expected)\n');
      } else {
        console.log(`❌ Event creation error: ${error.response?.status} - ${error.response?.data?.message || error.message}\n`);
      }
    }

    // Test 4: Test health endpoint
    console.log('4. Testing GET /health...');
    try {
      const response = await axios.get(`http://localhost:5000/health`);
      console.log('✅ Health endpoint working');
      console.log(`   Status: ${response.data.status}\n`);
    } catch (error) {
      console.log(`❌ Health endpoint error: ${error.message}\n`);
    }

  } catch (error) {
    console.error('🚨 Test suite error:', error.message);
  }
}

// Run the tests
testGroupsAPI();