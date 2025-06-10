import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

// Store
import { RootState } from '../../store/store';

// Components
import TrustScoreCard from '../../components/TrustScore/TrustScoreCard';
import QuickActions from '../../components/Home/QuickActions';
import RecentActivity from '../../components/Home/RecentActivity';
import SocialAccountsOverview from '../../components/Home/SocialAccountsOverview';
import UpcomingEvents from '../../components/Home/UpcomingEvents';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

// Hooks
import { useQuery } from '@tanstack/react-query';

// Services
import { getDashboardData } from '../../services/dashboard';

const { width } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useSelector((state: RootState) => state.auth);
  const [refreshing, setRefreshing] = useState(false);

  // Mock dashboard data for now
  const dashboardData = {
    unreadNotifications: 3,
    upcomingEvents: [],
    recentActivity: [],
    friendSuggestions: [],
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#84cc16';
    if (score >= 40) return '#eab308';
    if (score >= 20) return '#f97316';
    return '#ef4444';
  };

  const getTrustScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    if (score >= 20) return 'Poor';
    return 'Building Trust';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={() => {
              setRefreshing(true);
              setTimeout(() => setRefreshing(false), 1000);
            }} 
          />
        }
      >
        {/* Header with Welcome and Notifications */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Good morning,</Text>
            <Text style={styles.nameText}>{user?.firstName || 'User'}!</Text>
          </View>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => navigation.navigate('Notifications' as never)}
          >
            <Icon name="notifications-outline" size={24} color="#1f2937" />
            {dashboardData.unreadNotifications > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>
                  {dashboardData.unreadNotifications}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Trust Score Card */}
        <TouchableOpacity
          style={styles.trustScoreContainer}
          onPress={() => navigation.navigate('TrustScore' as never)}
        >
          <LinearGradient
            colors={['#3b82f6', '#1d4ed8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.trustScoreCard}
          >
            <View style={styles.trustScoreHeader}>
              <Text style={styles.trustScoreTitle}>Your Trust Score</Text>
              <Icon name="shield-checkmark" size={24} color="#ffffff" />
            </View>
            
            <View style={styles.trustScoreBody}>
              <View style={styles.scoreDisplay}>
                <Text style={styles.scoreNumber}>
                  {Math.round(user?.trustScore?.current || 42)}
                </Text>
                <Text style={styles.scoreOutOf}>/100</Text>
              </View>
              
              <View style={styles.scoreDetails}>
                <Text style={styles.scoreLabel}>
                  {getTrustScoreLabel(user?.trustScore?.current || 42)}
                </Text>
                <Text style={styles.scoreSubtext}>
                  Connect more accounts to improve
                </Text>
              </View>
            </View>

            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${user?.trustScore?.current || 42}%` }
                ]} 
              />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Quick Actions Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => navigation.navigate('SocialAccounts' as never)}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#dbeafe' }]}>
                <Icon name="link" size={24} color="#3b82f6" />
              </View>
              <Text style={styles.quickActionText}>Add Account</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => navigation.navigate('CreateEvent' as never)}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#dcfce7' }]}>
                <Icon name="calendar-outline" size={24} color="#22c55e" />
              </View>
              <Text style={styles.quickActionText}>Create Event</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => navigation.navigate('FeedTab' as never)}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#fef3c7' }]}>
                <Icon name="chatbubbles-outline" size={24} color="#f59e0b" />
              </View>
              <Text style={styles.quickActionText}>View Feed</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => navigation.navigate('MapTab' as never)}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#e0e7ff' }]}>
                <Icon name="map-outline" size={24} color="#6366f1" />
              </View>
              <Text style={styles.quickActionText}>Explore Map</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Social Accounts Overview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Connected Accounts</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SocialAccounts' as never)}>
              <Text style={styles.seeAllText}>Manage</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.socialAccountsContainer}>
            {user?.socialAccounts?.length > 0 ? (
              <View style={styles.connectedAccountsGrid}>
                {user.socialAccounts.slice(0, 4).map((account, index) => (
                  <View key={index} style={styles.socialAccountItem}>
                    <View style={styles.socialAccountIcon}>
                      <Icon name="logo-twitter" size={20} color="#1DA1F2" />
                    </View>
                    <Text style={styles.socialAccountName}>{account.platform}</Text>
                  </View>
                ))}
                {user.socialAccounts.length > 4 && (
                  <View style={styles.socialAccountItem}>
                    <View style={styles.moreAccountsIcon}>
                      <Text style={styles.moreAccountsText}>+{user.socialAccounts.length - 4}</Text>
                    </View>
                    <Text style={styles.socialAccountName}>More</Text>
                  </View>
                )}
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.emptyStateCard}
                onPress={() => navigation.navigate('SocialAccounts' as never)}
              >
                <Icon name="add-circle-outline" size={48} color="#6b7280" />
                <Text style={styles.emptyStateText}>Connect your first social account</Text>
                <Text style={styles.emptyStateSubtext}>Build trust by linking your social media profiles</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Icon name="checkmark-circle" size={16} color="#22c55e" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>Trust score updated</Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
            </View>
            
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Icon name="person-add" size={16} color="#3b82f6" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>New friend suggestion</Text>
                <Text style={styles.activityTime}>5 hours ago</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '400',
  },
  nameText: {
    fontSize: 24,
    color: '#1f2937',
    fontWeight: '700',
    marginTop: 2,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  trustScoreContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  trustScoreCard: {
    borderRadius: 16,
    padding: 20,
  },
  trustScoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  trustScoreTitle: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '600',
  },
  trustScoreBody: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginRight: 20,
  },
  scoreNumber: {
    fontSize: 36,
    color: '#ffffff',
    fontWeight: '800',
  },
  scoreOutOf: {
    fontSize: 18,
    color: '#e0e7ff',
    fontWeight: '500',
    marginLeft: 4,
  },
  scoreDetails: {
    flex: 1,
  },
  scoreLabel: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: 4,
  },
  scoreSubtext: {
    fontSize: 14,
    color: '#e0e7ff',
    fontWeight: '400',
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#1f2937',
    fontWeight: '700',
  },
  seeAllText: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '600',
    textAlign: 'center',
  },
  socialAccountsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  connectedAccountsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  socialAccountItem: {
    width: '22%',
    alignItems: 'center',
    marginBottom: 8,
  },
  socialAccountIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  moreAccountsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  moreAccountsText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
  },
  socialAccountName: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    textAlign: 'center',
  },
  emptyStateCard: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  activityCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500',
  },
  activityTime: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default HomeScreen;