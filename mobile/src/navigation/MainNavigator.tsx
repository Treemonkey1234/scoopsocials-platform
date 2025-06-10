import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { Platform } from 'react-native';

// Screens
import HomeScreen from '../screens/Home/HomeScreen';
import FeedScreen from '../screens/Feed/FeedScreen';
import EventsScreen from '../screens/Events/EventsScreen';
import EventDetailsScreen from '../screens/Events/EventDetailsScreen';
import CreateEventScreen from '../screens/Events/CreateEventScreen';
import MapScreen from '../screens/Map/MapScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import TrustScoreScreen from '../screens/TrustScore/TrustScoreScreen';
import SocialAccountsScreen from '../screens/SocialAccounts/SocialAccountsScreen';
import FriendsScreen from '../screens/Friends/FriendsScreen';
import NotificationsScreen from '../screens/Notifications/NotificationsScreen';

// Components
import TabBarIcon from '../components/UI/TabBarIcon';
import HeaderTitle from '../components/UI/HeaderTitle';

// Types
export type MainTabParamList = {
  HomeTab: undefined;
  FeedTab: undefined;
  EventsTab: undefined;
  MapTab: undefined;
  ProfileTab: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  TrustScore: undefined;
  Notifications: undefined;
};

export type FeedStackParamList = {
  Feed: undefined;
  CreatePost: undefined;
};

export type EventsStackParamList = {
  Events: undefined;
  EventDetails: { eventId: string };
  CreateEvent: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
  Settings: undefined;
  SocialAccounts: undefined;
  Friends: undefined;
  UserProfile: { userId: string };
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const HomeStack = createStackNavigator<HomeStackParamList>();
const FeedStack = createStackNavigator<FeedStackParamList>();
const EventsStack = createStackNavigator<EventsStackParamList>();
const ProfileStack = createStackNavigator<ProfileStackParamList>();

// Home Stack Navigator
const HomeStackNavigator = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen 
      name="Home" 
      component={HomeScreen}
      options={{
        headerTitle: () => <HeaderTitle title="ScoopSocials" />,
        headerStyle: {
          backgroundColor: '#ffffff',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#e5e7eb',
        },
        headerTitleAlign: 'center',
      }}
    />
    <HomeStack.Screen 
      name="TrustScore" 
      component={TrustScoreScreen}
      options={{
        headerTitle: 'Trust Score',
        headerStyle: { backgroundColor: '#ffffff' },
        headerTintColor: '#1f2937',
      }}
    />
    <HomeStack.Screen 
      name="Notifications" 
      component={NotificationsScreen}
      options={{
        headerTitle: 'Notifications',
        headerStyle: { backgroundColor: '#ffffff' },
        headerTintColor: '#1f2937',
      }}
    />
  </HomeStack.Navigator>
);

// Feed Stack Navigator
const FeedStackNavigator = () => (
  <FeedStack.Navigator>
    <FeedStack.Screen 
      name="Feed" 
      component={FeedScreen}
      options={{
        headerTitle: 'Community Feed',
        headerStyle: { backgroundColor: '#ffffff' },
        headerTintColor: '#1f2937',
      }}
    />
  </FeedStack.Navigator>
);

// Events Stack Navigator
const EventsStackNavigator = () => (
  <EventsStack.Navigator>
    <EventsStack.Screen 
      name="Events" 
      component={EventsScreen}
      options={{
        headerTitle: 'Events',
        headerStyle: { backgroundColor: '#ffffff' },
        headerTintColor: '#1f2937',
      }}
    />
    <EventsStack.Screen 
      name="EventDetails" 
      component={EventDetailsScreen}
      options={{
        headerTitle: 'Event Details',
        headerStyle: { backgroundColor: '#ffffff' },
        headerTintColor: '#1f2937',
      }}
    />
    <EventsStack.Screen 
      name="CreateEvent" 
      component={CreateEventScreen}
      options={{
        headerTitle: 'Create Event',
        headerStyle: { backgroundColor: '#ffffff' },
        headerTintColor: '#1f2937',
      }}
    />
  </EventsStack.Navigator>
);

// Profile Stack Navigator
const ProfileStackNavigator = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen 
      name="Profile" 
      component={ProfileScreen}
      options={{
        headerTitle: 'Profile',
        headerStyle: { backgroundColor: '#ffffff' },
        headerTintColor: '#1f2937',
      }}
    />
    <ProfileStack.Screen 
      name="Settings" 
      component={SettingsScreen}
      options={{
        headerTitle: 'Settings',
        headerStyle: { backgroundColor: '#ffffff' },
        headerTintColor: '#1f2937',
      }}
    />
    <ProfileStack.Screen 
      name="SocialAccounts" 
      component={SocialAccountsScreen}
      options={{
        headerTitle: 'Social Accounts',
        headerStyle: { backgroundColor: '#ffffff' },
        headerTintColor: '#1f2937',
      }}
    />
    <ProfileStack.Screen 
      name="Friends" 
      component={FriendsScreen}
      options={{
        headerTitle: 'Friends',
        headerStyle: { backgroundColor: '#ffffff' },
        headerTintColor: '#1f2937',
      }}
    />
  </ProfileStack.Navigator>
);

const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => (
          <TabBarIcon 
            routeName={route.name as keyof MainTabParamList} 
            focused={focused} 
            color={color} 
            size={size} 
          />
        ),
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}
      initialRouteName="HomeTab"
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeStackNavigator}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="FeedTab" 
        component={FeedStackNavigator}
        options={{
          tabBarLabel: 'Feed',
        }}
      />
      <Tab.Screen 
        name="EventsTab" 
        component={EventsStackNavigator}
        options={{
          tabBarLabel: 'Events',
        }}
      />
      <Tab.Screen 
        name="MapTab" 
        component={MapScreen}
        options={{
          tabBarLabel: 'Map',
          headerShown: true,
          headerTitle: 'Event Map',
          headerStyle: { backgroundColor: '#ffffff' },
          headerTintColor: '#1f2937',
        }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;