import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { adminAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../theme';

const AdminDashboardScreen = ({ navigation }) => {
    const { logout } = useAuth();
    const [stats, setStats] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsResponse, analyticsResponse] = await Promise.all([
                adminAPI.getStats(),
                adminAPI.getAnalytics(),
            ]);

            setStats(statsResponse.data);
            setAnalytics(analyticsResponse.data);
        } catch (error) {
            console.error('Fetch data error:', error);
            Alert.alert('Error', 'Failed to load dashboard data');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />}
        >
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Overview</Text>
                    <Text style={styles.headerSubtitle}>Real-time placement insights</Text>
                </View>
                <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                    <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <View style={[styles.iconBox, { backgroundColor: '#e0e7ff' }]}>
                            <Ionicons name="people" size={24} color={theme.colors.primary} />
                        </View>
                        <Text style={styles.statValue}>{stats?.totalStudents || 0}</Text>
                        <Text style={styles.statLabel}>Total Students</Text>
                    </View>

                    <View style={styles.statCard}>
                        <View style={[styles.iconBox, { backgroundColor: '#ecfdf5' }]}>
                            <Ionicons name="briefcase" size={24} color={theme.colors.success} />
                        </View>
                        <Text style={styles.statValue}>{stats?.activeOpportunities || 0}</Text>
                        <Text style={styles.statLabel}>Active Jobs</Text>
                    </View>

                    <View style={styles.statCard}>
                        <View style={[styles.iconBox, { backgroundColor: '#fff7ed' }]}>
                            <Ionicons name="send" size={24} color={theme.colors.warning} />
                        </View>
                        <Text style={styles.statValue}>{stats?.totalApplications || 0}</Text>
                        <Text style={styles.statLabel}>Total Apps</Text>
                    </View>

                    <View style={styles.statCard}>
                        <View style={[styles.iconBox, { backgroundColor: '#fdf2f8' }]}>
                            <Ionicons name="stats-chart" size={24} color="#db2777" />
                        </View>
                        <Text style={styles.statValue}>{analytics?.participationRate || 0}%</Text>
                        <Text style={styles.statLabel}>Participation</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <View style={styles.actionGrid}>
                        <TouchableOpacity
                            style={styles.actionCard}
                            onPress={() => navigation.navigate('CreateOpportunity')}
                        >
                            <View style={[styles.actionIcon, { backgroundColor: theme.colors.primary }]}>
                                <Ionicons name="add" size={24} color="#fff" />
                            </View>
                            <Text style={styles.actionText}>Post Job</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionCard}
                            onPress={() => navigation.navigate('ManageOpportunities')}
                        >
                            <View style={[styles.actionIcon, { backgroundColor: theme.colors.success }]}>
                                <Ionicons name="settings-outline" size={24} color="#fff" />
                            </View>
                            <Text style={styles.actionText}>Manage</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Application Status</Text>
                    <View style={styles.chartContainer}>
                        <View style={styles.statusRow}>
                            <View style={[styles.statusDot, { backgroundColor: '#2196f3' }]} />
                            <Text style={styles.statusLabelName}>Applied</Text>
                            <Text style={styles.statusCount}>{stats?.applicationsByStatus?.Applied || 0}</Text>
                        </View>
                        <View style={styles.statusRow}>
                            <View style={[styles.statusDot, { backgroundColor: '#4caf50' }]} />
                            <Text style={styles.statusLabelName}>Shortlisted</Text>
                            <Text style={styles.statusCount}>{stats?.applicationsByStatus?.Shortlisted || 0}</Text>
                        </View>
                        <View style={styles.statusRow}>
                            <View style={[styles.statusDot, { backgroundColor: '#ff5252' }]} />
                            <Text style={styles.statusLabelName}>Rejected</Text>
                            <Text style={styles.statusCount}>{stats?.applicationsByStatus?.Rejected || 0}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
        backgroundColor: theme.colors.white,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    headerSubtitle: {
        fontSize: 14,
        color: theme.colors.textLight,
        marginTop: 4,
    },
    logoutButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#fee2e2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: 20,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 24,
    },
    statCard: {
        backgroundColor: theme.colors.white,
        width: '48%',
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(226, 232, 240, 0.5)',
        ...theme.shadows.sm,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    statLabel: {
        fontSize: 12,
        color: theme.colors.textLight,
        marginTop: 4,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 16,
    },
    actionGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    actionCard: {
        backgroundColor: theme.colors.white,
        flex: 1,
        padding: 16,
        borderRadius: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(226, 232, 240, 0.5)',
        ...theme.shadows.sm,
    },
    actionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    actionText: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text,
    },
    chartContainer: {
        backgroundColor: theme.colors.white,
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(226, 232, 240, 0.5)',
        ...theme.shadows.sm,
        gap: 16,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    statusLabelName: {
        flex: 1,
        marginLeft: 12,
        fontSize: 15,
        color: theme.colors.text,
    },
    statusCount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
});

export default AdminDashboardScreen;
