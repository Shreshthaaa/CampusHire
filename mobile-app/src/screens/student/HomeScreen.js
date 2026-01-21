import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { opportunitiesAPI } from '../../services/api';
import { theme } from '../../theme';

const HomeScreen = ({ navigation }) => {
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchOpportunities();
    }, []);

    const fetchOpportunities = async () => {
        try {
            const response = await opportunitiesAPI.getAll();
            setOpportunities(response.data);
        } catch (error) {
            console.error('Fetch opportunities error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchOpportunities();
    };

    const filteredOpportunities = opportunities.filter(item => {
        const query = searchQuery.toLowerCase();
        const companyName = (item.companyName || '').toLowerCase();
        const role = (item.role || '').toLowerCase();
        const location = (item.location || '').toLowerCase();

        return companyName.includes(query) || role.includes(query) || location.includes(query);
    });

    const renderOpportunity = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => {
                const id = item._id || item.id;
                navigation.navigate('OpportunityDetail', { id });
            }}
        >
            <View style={styles.cardHeader}>
                <View style={styles.companyLogo}>
                    <Text style={styles.logoText}>{(item.companyName || 'C').charAt(0)}</Text>
                </View>
                <View style={styles.headerInfo}>
                    <Text style={styles.companyName}>{item.companyName || 'Unknown Company'}</Text>
                    <Text style={styles.positionText}>{item.role || 'Unknown Role'}</Text>
                </View>
                <View style={[styles.badge, (item.status === 'Open' || !item.status) ? styles.badgeOpen : styles.badgeClosed]}>
                    <Text style={[styles.badgeText, (item.status === 'Open' || !item.status) ? styles.badgeTextOpen : styles.badgeTextClosed]}>
                        {item.status || 'Open'}
                    </Text>
                </View>
            </View>

            <View style={styles.cardBody}>
                <View style={styles.infoRow}>
                    <Ionicons name="location-outline" size={16} color={theme.colors.textLight} />
                    <Text style={styles.infoText}>{item.location}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="cash-outline" size={16} color={theme.colors.textLight} />
                    <Text style={styles.infoText}>{item.salary}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="calendar-outline" size={16} color={theme.colors.textLight} />
                    <Text style={styles.infoText}>Deadline: {new Date(item.deadline).toLocaleDateString()}</Text>
                </View>
            </View>

            <View style={styles.cardFooter}>
                <Text style={styles.viewDetails}>View Details</Text>
                <Ionicons name="chevron-forward" size={16} color={theme.colors.primary} />
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
            <View style={styles.searchSection}>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color={theme.colors.textLight} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search company, role or location"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            <FlatList
                data={filteredOpportunities}
                renderItem={renderOpportunity}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="briefcase-outline" size={64} color={theme.colors.border} />
                        <Text style={styles.emptyText}>No opportunities found</Text>
                    </View>
                }
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
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
    searchSection: {
        padding: theme.spacing.md,
        backgroundColor: theme.colors.white,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f5f9',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 15,
        color: theme.colors.text,
    },
    listContainer: {
        padding: theme.spacing.md,
    },
    card: {
        backgroundColor: theme.colors.white,
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        ...theme.shadows.sm,
        borderWidth: 1,
        borderColor: 'rgba(226, 232, 240, 0.5)',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    companyLogo: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: '#e0e7ff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    headerInfo: {
        flex: 1,
        marginLeft: 12,
    },
    companyName: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.textLight,
        marginBottom: 2,
    },
    positionText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    badgeOpen: {
        backgroundColor: '#ecfdf5',
    },
    badgeClosed: {
        backgroundColor: '#fef2f2',
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '600',
    },
    badgeTextOpen: {
        color: theme.colors.success,
    },
    badgeTextClosed: {
        color: theme.colors.error,
    },
    cardBody: {
        marginBottom: 16,
        gap: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    infoText: {
        fontSize: 14,
        color: theme.colors.textLight,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
    },
    viewDetails: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.primary,
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        color: theme.colors.textLight,
    },
});

export default HomeScreen;
