import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { opportunitiesAPI, applicationsAPI } from '../../services/api';
import { theme } from '../../theme';

const ApplicantsScreen = ({ route }) => {
    const { opportunityId, companyName } = route.params;
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplicants();
    }, []);

    const fetchApplicants = async () => {
        try {
            const response = await opportunitiesAPI.getApplicants(opportunityId);
            setApplicants(response.data);
        } catch (error) {
            console.error('Fetch applicants error:', error);
            Alert.alert('Error', 'Failed to load applicants');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = (applicationId, currentStatus) => {
        const statuses = ['Applied', 'Shortlisted', 'Rejected'];

        Alert.alert(
            'Update Status',
            'Select new status for this candidate:',
            statuses.map(status => ({
                text: status,
                onPress: async () => {
                    if (status === currentStatus) return;

                    try {
                        await applicationsAPI.updateStatus(applicationId, status);
                        fetchApplicants();
                    } catch (error) {
                        Alert.alert('Error', 'Failed to update status');
                    }
                },
            })).concat([{ text: 'Cancel', style: 'cancel' }])
        );
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Shortlisted': return theme.colors.success;
            case 'Rejected': return theme.colors.error;
            case 'Applied': return theme.colors.primary;
            default: return theme.colors.textLight;
        }
    };

    const renderApplicantCard = ({ item }) => {
        const student = item.userId;
        if (!student) return null;

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{(student.name || 'S').charAt(0)}</Text>
                    </View>
                    <View style={styles.headerInfo}>
                        <Text style={styles.studentName}>{student.name}</Text>
                        <Text style={styles.studentEmail}>{student.email}</Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}
                        onPress={() => handleStatusUpdate(item._id, item.status)}
                    >
                        <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
                        <Ionicons name="chevron-down" size={12} color={getStatusColor(item.status)} />
                    </TouchableOpacity>
                </View>

                <View style={styles.detailsGrid}>
                    <View style={styles.detailItem}>
                        <Ionicons name="school-outline" size={14} color={theme.colors.textLight} />
                        <Text style={styles.detailText}>{student.branch || 'N/A'}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Ionicons name="calendar-outline" size={14} color={theme.colors.textLight} />
                        <Text style={styles.detailText}>Batch: {student.batch || 'N/A'}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Ionicons name="star-outline" size={14} color={theme.colors.textLight} />
                        <Text style={styles.detailText}>CGPA: {student.cgr || 'N/A'}</Text>
                    </View>
                </View>

                {student.resumeLink && (
                    <TouchableOpacity style={styles.resumeButton}>
                        <Ionicons name="document-text-outline" size={18} color={theme.colors.primary} />
                        <Text style={styles.resumeButtonText}>View Resume</Text>
                    </TouchableOpacity>
                )}
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
            <View style={styles.topBar}>
                <Text style={styles.topBarTitle}>{companyName}</Text>
                <View style={styles.countBadge}>
                    <Text style={styles.countBadgeText}>{applicants.length} Applicants</Text>
                </View>
            </View>

            <FlatList
                data={applicants}
                renderItem={renderApplicantCard}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="people-outline" size={64} color={theme.colors.border} />
                        <Text style={styles.emptyText}>No applications received yet</Text>
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
    topBar: {
        padding: 20,
        backgroundColor: theme.colors.white,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    topBarTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    countBadge: {
        backgroundColor: '#eff6ff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 99,
    },
    countBadgeText: {
        color: theme.colors.primary,
        fontSize: 12,
        fontWeight: 'bold',
    },
    listContainer: {
        padding: 16,
    },
    card: {
        backgroundColor: theme.colors.white,
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        ...theme.shadows.sm,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    headerInfo: {
        flex: 1,
        marginLeft: 12,
    },
    studentName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    studentEmail: {
        fontSize: 13,
        color: theme.colors.textLight,
        marginTop: 2,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        gap: 4,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    detailsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    detailText: {
        fontSize: 13,
        color: theme.colors.textLight,
    },
    resumeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        paddingVertical: 12,
        marginTop: 16,
        gap: 8,
    },
    resumeButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: theme.colors.primary,
    },
    emptyContainer: {
        paddingTop: 100,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: theme.colors.textLight,
        marginTop: 20,
    },
});

export default ApplicantsScreen;
