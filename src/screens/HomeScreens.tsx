import React, { useState, useEffect, JSX } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  ActivityIndicator,
  StatusBar,
  TextInput,
  ScrollView,
} from 'react-native';
import Svg, { Path, Circle, Polyline } from 'react-native-svg';

// --- TYPE DEFINITIONS ---
type IssueStatus = 'New' | 'In Progress' | 'Resolved';
type IssueCategory = 'Roads' | 'Waste' | 'Lighting' | 'Water' | 'Other';

type Issue = {
  id: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  title: string;
  status: IssueStatus;
  address: string;
  category: IssueCategory;
  timestamp: string;
};

// --- MOCK DATA (Updated with category and timestamp) ---
const MOCK_ISSUES: Issue[] = [
  { id: '1', coordinate: { latitude: 18.5204, longitude: 73.8567 }, title: 'Large Pothole on Main St', status: 'New', address: 'FC Road, Pune', category: 'Roads', timestamp: '2 hours ago' },
  { id: '2', coordinate: { latitude: 18.5215, longitude: 73.8589 }, title: 'Overflowing garbage bin', status: 'New', address: 'JM Road, Pune', category: 'Waste', timestamp: '5 hours ago' },
  { id: '3', coordinate: { latitude: 18.5190, longitude: 73.8550 }, title: 'Streetlight out near park', status: 'In Progress', address: 'Deccan Gymkhana, Pune', category: 'Lighting', timestamp: '1 day ago' },
  { id: '4', coordinate: { latitude: 18.5230, longitude: 73.8612 }, title: 'Water pipe leakage', status: 'In Progress', address: 'Koregaon Park, Pune', category: 'Water', timestamp: '3 days ago' },
  { id: '5', coordinate: { latitude: 18.5165, longitude: 73.8472 }, title: 'Fallen tree branch blocking path', status: 'Resolved', address: 'Kothrud, Pune', category: 'Other', timestamp: '1 week ago' },
];

// --- SVG ICON COMPONENTS ---
const SearchIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="11" cy="11" r="8" /><Path d="m21 21-4.35-4.35" />
  </Svg>
);

const BellIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><Path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </Svg>
);

const PlusIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M12 5v14M5 12h14" />
    </Svg>
);

// Category Icons
const RoadIcon = () => <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><Path d="M4 13L8 5l4 8L16 5l4 8"/><Path d="M4 18l4-8 4 8 4-8 4 8"/></Svg>;
const WasteIcon = () => <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><Polyline points="3 6 5 6 21 6"/><Path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><Path d="M10 11v6"/><Path d="M14 11v6"/></Svg>;
const LightingIcon = () => <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><Path d="M15 14c.2-1 .7-1.7 1.5-2.5C17.7 10.2 18 9 18 7a6 6 0 0 0-12 0c0 2 1.3 4.3 2.5 6 .8.8 1.3 1.5 1.5 2.5"/><Path d="M9 18h6"/><Path d="M10 22h4"/></Svg>;
const WaterIcon = () => <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><Path d="M12 22a7 7 0 0 0 7-7c0-2-1-3-3-4s-3-2-3-3.5a3.5 3.5 0 0 0-7 0c0 1.5-1 2.5-3 3.5s-3 2-3 4a7 7 0 0 0 7 7z"/></Svg>;
const OtherIcon = () => <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><Circle cx="12" cy="12" r="1"/><Circle cx="19" cy="12" r="1"/><Circle cx="5" cy="12" r="1"/></Svg>;

const CATEGORY_ICONS: Record<IssueCategory, JSX.Element> = {
    'Roads': <RoadIcon />,
    'Waste': <WasteIcon />,
    'Lighting': <LightingIcon />,
    'Water': <WaterIcon />,
    'Other': <OtherIcon />,
};

// --- THE MAIN HOME SCREEN COMPONENT ---
export default function HomeScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading Dashboard...</Text>
      </SafeAreaView>
    );
  }

  const getStatusStyle = (status: IssueStatus) => {
    if (status === 'New') return { color: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.1)' };
    if (status === 'In Progress') return { color: '#F59E0B', backgroundColor: 'rgba(245, 158, 11, 0.1)' };
    if (status === 'Resolved') return { color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.1)' };
    return {};
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>

            {/* --- Header --- */}
            <View style={styles.headerTopRow}>
                <View>
                    <Text style={styles.greetingText}>Good Morning, Citizen!</Text>
                    <Text style={styles.locationText}>Pune, Maharashtra</Text>
                </View>
                <TouchableOpacity style={styles.iconButton}>
                    <BellIcon />
                </TouchableOpacity>
            </View>

            {/* --- Stats Dashboard --- */}
            <View style={styles.statsContainer}>
                <View style={[styles.statCard, {backgroundColor: '#E5F1FF'}]}>
                    <Text style={styles.statNumber}>3</Text>
                    <Text style={styles.statLabel}>Active Reports</Text>
                </View>
                <View style={[styles.statCard, {backgroundColor: '#E7F7F0'}]}>
                    <Text style={styles.statNumber}>8</Text>
                    <Text style={styles.statLabel}>Resolved by You</Text>
                </View>
                <View style={[styles.statCard, {backgroundColor: '#FFF4E5'}]}>
                    <Text style={styles.statNumber}>12</Text>
                    <Text style={styles.statLabel}>Resolved Nearby</Text>
                </View>
            </View>
            
            {/* --- Primary Actions --- */}
            <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.mainActionButton}>
                    <PlusIcon />
                    <Text style={styles.mainActionButtonText}>Report New Issue</Text>
                </TouchableOpacity>
            </View>

            {/* --- Nearby Issues List --- */}
            <View style={styles.listHeader}>
                <Text style={styles.listTitle}>Nearby Issues</Text>
                <TouchableOpacity><Text style={styles.seeAllText}>See All</Text></TouchableOpacity>
            </View>

            {MOCK_ISSUES.map(issue => (
                <TouchableOpacity key={issue.id} style={styles.issueCard}>
                    <View style={styles.issueIconContainer}>
                       {CATEGORY_ICONS[issue.category]}
                    </View>
                    <View style={styles.issueDetails}>
                        <Text style={styles.issueTitle} numberOfLines={1}>{issue.title}</Text>
                        <Text style={styles.issueAddress}>{issue.address} • {issue.timestamp}</Text>
                    </View>
                    <View style={[styles.statusBadge, getStatusStyle(issue.status)]}>
                        <Text style={[styles.statusText, getStatusStyle(issue.status)]}>{issue.status}</Text>
                    </View>
                </TouchableOpacity>
            ))}

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
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 15 : 0,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
      marginTop: 10,
      fontSize: 16,
      color: '#333'
  },
  headerTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 25,
  },
  greetingText: {
      fontSize: 16,
      color: '#6B7280',
  },
  locationText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#1F2937',
  },
  iconButton: {
      padding: 10,
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2, },
      shadowOpacity: 0.05,
      shadowRadius: 3.84,
      elevation: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statCard: {
    width: '32%',
    padding: 15,
    borderRadius: 12,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 2,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  mainActionButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4, },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  mainActionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  seeAllText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  issueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  issueIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F3F4F6',
      marginRight: 15,
  },
  issueDetails: {
    flex: 1,
  },
  issueTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  issueAddress: {
    fontSize: 13,
    color: '#6B7280',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginLeft: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  }
});

