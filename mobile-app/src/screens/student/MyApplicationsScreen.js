import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { applicationsAPI } from '../../services/api';
import { theme } from '../../theme';

const MyApplicationsScreen = ({ navigation }) => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const response = await applicationsAPI.getMyApplications();
            setApplications(response.data);
        } catch (error) {
            console.error('Fetch applications error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Shortlisted': return theme.colors.success;
            case 'Rejected': return theme.colors.error;
            case 'Applied': return '#2196f3';
            default: return theme.colors.textLight;
        }
    };

    const renderApplication = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => {
                const id = item.opportunityId?._id;
                if (!id) console.error('Application missing opportunity ID:', item);
                navigation.navigate('OpportunityDetail', { id });
            }}
        >
            <View style={styles.cardHeader}>
                <View style={styles.companyIcon}>
                    <Text style={styles.logoText}>{(item.opportunityId?.companyName || 'C').charAt(0)}</Text>
                </View>
                <View style={styles.headerInfo}>
                    <Text style={styles.companyName}>{item.opportunityId?.companyName || 'Unknown Company'}</Text>
                    <Text style={styles.positionText}>{item.opportunityId?.role || 'Unknown Position'}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
                </View>
            </View>

            <View style={styles.cardFooter}>
                <View style={styles.dateInfo}>
                    <Ionicons name="calendar-outline" size={14} color={theme.colors.textLight} />
                    <Text style={styles.dateText}>Applied on {new Date(item.appliedAt).toLocaleDateString()}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={theme.colors.border} />
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={applications}
                renderItem={renderApplication}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="document-text-outline" size={64} color={theme.colors.border} />
                        <Text style={styles.emptyTitle}>No applications yet</Text>
                        <Text style={styles.emptySubtitle}>Your submitted job applications will appear here</Text>
                    </View>
                }
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={fetchApplications}
                        colors={[theme.colors.primary]}
                    />
                }
            />
        </View>
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
    listContainer: {
        padding: 20,
    },
    card: {
        backgroundColor: theme.colors.white,
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(226, 232, 240, 0.5)',
        ...theme.shadows.sm,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    companyIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    headerInfo: {
        flex: 1,
        marginLeft: 12,
    },
    companyName: {
        fontSize: 13,
        color: theme.colors.textLight,
        fontWeight: '500',
    },
    positionText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginTop: 2,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
    },
    dateInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dateText: {
        fontSize: 12,
        color: theme.colors.textLight,
    },
    emptyContainer: {
        paddingTop: 60,
        alignItems: 'center',
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginTop: 20,
    },
    emptySubtitle: {
        fontSize: 14,
        color: theme.colors.textLight,
        textAlign: 'center',
        marginTop: 8,
        paddingHorizontal: 40,
    },
});

export default MyApplicationsScreen;
