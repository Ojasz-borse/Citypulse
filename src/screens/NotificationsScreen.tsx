import React, { JSX } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Svg, { Path, Circle, Polyline, Polygon } from 'react-native-svg';

// --- TYPE DEFINITIONS ---
type NotificationType = 'Status Update' | 'New Comment' | 'Resolved' | 'Broadcast';

type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
};

// --- MOCK DATA ---
const DUMMY_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'Status Update',
    title: 'Pothole Report Updated',
    message: 'Your report #C1024 is now "In Progress". The public works department is on it.',
    timestamp: '2 hours ago',
    read: false,
  },
  {
    id: '2',
    type: 'Resolved',
    title: 'Streetlight Fixed!',
    message: 'Great news! The broken streetlight you reported has been successfully repaired.',
    timestamp: '1 day ago',
    read: false,
  },
  {
    id: '3',
    type: 'New Comment',
    title: 'Comment on Report #C1022',
    message: 'An official from the waste management dept. left a comment on your "Overflowing Bin" report.',
    timestamp: '2 days ago',
    read: true,
  },
  {
    id: '4',
    type: 'Broadcast',
    title: 'Water Supply Update',
    message: 'Scheduled maintenance will cause a temporary water outage in the Shivajinagar area tomorrow.',
    timestamp: '3 days ago',
    read: true,
  },
  {
    id: '5',
    type: 'Resolved',
    title: 'Overflowing Bin Cleared',
    message: 'The overflowing bin near Deccan Gymkhana has been cleared.',
    timestamp: '4 days ago',
    read: true,
  },
  {
    id: '6',
    type: 'Status Update',
    title: 'Water Leakage Report',
    message: 'Report #C1029 has been assigned to a technician and will be inspected shortly.',
    timestamp: '5 days ago',
    read: true,
  },
  {
    id: '7',
    type: 'Broadcast',
    title: 'Road Closure Notice',
    message: 'FC Road will be partially closed for metro construction work this Sunday from 8 AM to 11 AM.',
    timestamp: '6 days ago',
    read: true,
  },
  {
    id: '8',
    type: 'New Comment',
    title: 'Comment on Report #C1024',
    message: 'A fellow citizen has added a new photo to your Pothole Report.',
    timestamp: '6 days ago',
    read: true,
  },
];


// --- SVG ICON COMPONENTS ---
const BackIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M15 18l-6-6 6-6"/>
    </Svg>
);

const CheckCircleIcon = () => <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><Polyline points="22 4 12 14.01 9 11.01"/></Svg>;
const MessageSquareIcon = () => <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></Svg>;
const ZapIcon = () => <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><Polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></Svg>;
const MegaphoneIcon = () => <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><Path d="m3 11 18-5v12L3 14v-3z"/><Path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></Svg>;

const NOTIFICATION_ICONS: Record<NotificationType, { icon: JSX.Element; color: string }> = {
    'Status Update': { icon: <ZapIcon />, color: '#FFFBEB' },
    'Resolved': { icon: <CheckCircleIcon />, color: '#F0FDF4' },
    'New Comment': { icon: <MessageSquareIcon />, color: '#EFF6FF' },
    'Broadcast': { icon: <MegaphoneIcon />, color: '#EEF2FF' },
};


// --- THE MAIN NOTIFICATIONS SCREEN COMPONENT ---
export default function NotificationsScreen() {
  
  const renderNotification = ({ item }: { item: Notification }) => {
    const { icon, color } = NOTIFICATION_ICONS[item.type];
    return (
        <TouchableOpacity style={[styles.notificationCard, !item.read && styles.unreadCard]}>
            <View style={[styles.iconContainer, { backgroundColor: color }]}>
                {icon}
            </View>
            <View style={styles.notificationTextContainer}>
                <Text style={styles.notificationTitle}>{item.title}</Text>
                <Text style={styles.notificationMessage}>{item.message}</Text>
                <Text style={styles.notificationTimestamp}>{item.timestamp}</Text>
            </View>
        </TouchableOpacity>
    );
  };
    
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity>
            <BackIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity>
            <Text style={styles.headerAction}>Mark all as read</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={DUMMY_NOTIFICATIONS}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
      
    </SafeAreaView>
  );
}

// --- STYLESHEET ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'bree-serif-regular-ttf',
  },
  headerAction: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
    fontFamily: 'bree-serif-regular-ttf',
  },
  listContainer: {
    padding: 20,
  },
  notificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  unreadCard: {
      backgroundColor: '#FDFEFF',
      borderColor: '#D1E6FF',
  },
  iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
    fontFamily: 'bree-serif-regular-ttf',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    fontFamily: 'bree-serif-regular-ttf',
  },
  notificationTimestamp: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 6,
    fontFamily: 'bree-serif-regular-ttf',
  }
});

