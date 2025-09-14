import React, { JSX } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  Share,
} from 'react-native';
import Svg, { Path, Circle, Polyline, G } from 'react-native-svg';

// --- TYPE DEFINITIONS ---
type Badge = {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  color: string;
};
9
// --- MOCK DATA ---
const USER_DATA = {
  name: 'Aarav Sharma',
  location: 'Pune, Maharashtra',
  reportsSubmitted: 24,
  issuesResolved: 15,
  profilePicture: 'https://placehold.co/100x100/E5F1FF/3778C2?text=AS',
};

// --- SVG ICON COMPONENTS (Moved before usage) ---
const CommunityIcon = () => <Svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><Circle cx="9" cy="7" r="4"/><Path d="M23 21v-2a4 4 0 0 0-3-3.87"/><Path d="M16 3.13a4 4 0 0 1 0 7.75"/></Svg>;
const RoadIcon = () => <Svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><Path d="M4 13L8 5l4 8L16 5l4 8"/><Path d="M4 18l4-8 4 8 4-8 4 8"/></Svg>;
const WatchdogIcon = () => <Svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><Circle cx="12" cy="12" r="3"/></Svg>;
const CleanIcon = () => <Svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><Polyline points="3 6 5 6 21 6"/><Path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></Svg>;
const ChevronRightIcon = () => <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><Path d="m9 18 6-6-6-6"/></Svg>;

const USER_BADGES: Badge[] = [
  {
    id: '1',
    title: 'Community Helper',
    description: 'Resolved 5+ issues',
    icon: <CommunityIcon/>,
    color: '#10B981'
  },
  {
    id: '2',
    title: 'Road Warrior',
    description: 'Reported 10+ road issues',
    icon: <RoadIcon/>,
    color: '#F59E0B'
  },
  {
    id: '3',
    title: 'City Watchdog',
    description: 'First to report 3 critical issues',
    icon: <WatchdogIcon/>,
    color: '#3B82F6'
  },
    {
    id: '4',
    title: 'Clean Crusader',
    description: 'Reported 5+ waste issues',
    icon: <CleanIcon/>,
    color: '#EF4444'
  },
];


// --- THE MAIN PROFILE SCREEN COMPONENT ---
export default function ProfileScreen() {

  const handleShare = async (badgeTitle: string) => {
    try {
      await Share.share({
        message: `I just earned the "${badgeTitle}" badge on CITYPULSE for helping improve my city! Join me in making a difference.`,
        // url: 'https://citypulse.app/badges' // Optional: Link to your app
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>

          {/* --- User Info Header --- */}
          <View style={styles.userInfoHeader}>
            <Image source={{ uri: USER_DATA.profilePicture }} style={styles.profileImage} />
            <Text style={styles.userName}>{USER_DATA.name}</Text>
            <Text style={styles.userLocation}>{USER_DATA.location}</Text>
          </View>

          {/* --- User Stats --- */}
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{USER_DATA.reportsSubmitted}</Text>
              <Text style={styles.statLabel}>Reports Submitted</Text>
            </View>
            <View style={styles.statSeparator} />
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{USER_DATA.issuesResolved}</Text>
              <Text style={styles.statLabel}>Issues Resolved</Text>
            </View>
          </View>

          {/* --- Badges & Rewards --- */}
          <Text style={styles.sectionTitle}>My Badges</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgesScrollView}>
            {USER_BADGES.map((badge) => (
              <View key={badge.id} style={styles.badgeCard}>
                <View style={[styles.badgeIconContainer, { backgroundColor: badge.color }]}>
                  {badge.icon}
                </View>
                <Text style={styles.badgeTitle}>{badge.title}</Text>
                <Text style={styles.badgeDescription}>{badge.description}</Text>
                <TouchableOpacity style={styles.shareButton} onPress={() => handleShare(badge.title)}>
                  <Text style={styles.shareButtonText}>Share</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          {/* --- Menu Options --- */}
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem}>
                <Text style={styles.menuItemText}>Edit Profile</Text>
                <ChevronRightIcon />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
                <Text style={styles.menuItemText}>App Settings</Text>
                <ChevronRightIcon />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
                <Text style={styles.menuItemText}>Help & Support</Text>
                <ChevronRightIcon />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.menuItem, styles.logoutItem]}>
                <Text style={[styles.menuItemText, styles.logoutText]}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- STYLESHEET ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  contentContainer: {
    padding: 20,
  },
  userInfoHeader: {
    alignItems: 'center',
    marginBottom: 25,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    marginBottom: 15,
  },
  userName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1F2937',
    fontFamily: 'bree-serif-regular-ttf',
  },
  userLocation: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
    fontFamily: 'bree-serif-regular-ttf',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    justifyContent: 'space-around',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statBox: {
    alignItems: 'center',
    width: '50%',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    fontFamily: 'bree-serif-regular-ttf',
  },
  statLabel: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 4,
    fontFamily: 'bree-serif-regular-ttf',
  },
  statSeparator: {
    width: 1,
    backgroundColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 15,
    fontFamily: 'bree-serif-regular-ttf',
  },
  badgesScrollView: {
    paddingBottom: 10,
    marginBottom: 20,
  },
  badgeCard: {
    width: 150,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  badgeIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    fontFamily: 'bree-serif-regular-ttf',
    textAlign: 'center',
  },
  badgeDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 15,
    fontFamily: 'bree-serif-regular-ttf',
  },
  shareButton: {
    backgroundColor: '#E5F1FF',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  shareButtonText: {
    color: '#007AFF',
    fontWeight: 'bold',
    fontSize: 12,
    fontFamily: 'bree-serif-regular-ttf',
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemText: {
    fontSize: 16,
    color: '#374151',
    fontFamily: 'bree-serif-regular-ttf',
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#EF4444',
  }
});
