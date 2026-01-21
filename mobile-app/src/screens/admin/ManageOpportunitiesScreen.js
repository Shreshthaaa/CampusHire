import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { opportunitiesAPI } from '../../services/api';
import { theme } from '../../theme';

const ManageOpportunitiesScreen = ({ navigation }) => {
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchOpportunities();
    }, []);

    const fetchOpportunities = async () => {
        try {
            const response = await opportunitiesAPI.getAll();
            setOpportunities(response.data);
        } catch (error) {
            console.error('Fetch opportunities error:', error);
            Alert.alert('Error', 'Failed to load opportunities');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchOpportunities();
    }, []);

    const handleDelete = (id, companyName) => {
        Alert.alert(
            'Delete Opportunity',
            `Are you sure you want to delete ${companyName}? This action cannot be undone.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await opportunitiesAPI.delete(id);
                            Alert.alert('Success', 'Opportunity deleted');
                            fetchOpportunities();
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete opportunity');
                        }
                    },
                },
            ]
        );
    };

    const renderOpportunityCard = ({ item }) => {
        const isExpired = new Date(item.deadline) < new Date();

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={styles.companyIcon}>
                        <Text style={styles.logoText}>{(item.companyName || 'C').charAt(0)}</Text>
                    </View>
                    <View style={styles.headerInfo}>
                        <Text style={styles.companyName}>{item.companyName}</Text>
                        <Text style={styles.positionText}>{item.role}</Text>
                    </View>
                    {isExpired && (
                        <View style={styles.expiredBadge}>
                            <Text style={styles.expiredText}>Expired</Text>
                        </View>
                    )}
                </View>

                <View style={[styles.infoRow, { marginTop: 12 }]}>
                    <Ionicons name="calendar-outline" size={14} color={theme.colors.textLight} />
                    <Text style={styles.infoText}>Deadline: {new Date(item.deadline).toLocaleDateString()}</Text>
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: '#eff6ff' }]}
                        onPress={() => navigation.navigate('Applicants', { opportunityId: item._id, companyName: item.companyName })}
                    >
                        <Ionicons name="people-outline" size={18} color={theme.colors.primary} />
                        <Text style={[styles.actionButtonText, { color: theme.colors.primary }]}>Applicants</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: '#fef2f2' }]}
                        onPress={() => handleDelete(item._id, item.companyName)}
                    >
                        <Ionicons name="trash-outline" size={18} color={theme.colors.error} />
                        <Text style={[styles.actionButtonText, { color: theme.colors.error }]}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

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
                data={opportunities}
                renderItem={renderOpportunityCard}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="briefcase-outline" size={64} color={theme.colors.border} />
                        <Text style={styles.emptyTitle}>No opportunities yet</Text>
                        <TouchableOpacity
                            style={styles.createButton}
                            onPress={() => navigation.navigate('CreateOpportunity')}
                        >
                            <Text style={styles.createButtonText}>Post New Job</Text>
                        </TouchableOpacity>
                    </View>
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
    },
    companyIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#e0e7ff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.primary,
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
    expiredBadge: {
        backgroundColor: '#fee2e2',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    expiredText: {
        color: theme.colors.error,
        fontSize: 11,
        fontWeight: '700',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    infoText: {
        fontSize: 12,
        color: theme.colors.textLight,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 12,
        gap: 6,
    },
    actionButtonText: {
        fontSize: 13,
        fontWeight: '700',
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
    createButton: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        marginTop: 20,
    },
    createButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
    },
});

export default ManageOpportunitiesScreen;
