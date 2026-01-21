import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { opportunitiesAPI, applicationsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../theme';

const OpportunityDetailScreen = ({ route, navigation }) => {
    const { id } = route.params;
    const { user } = useAuth();
    const [opportunity, setOpportunity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);

    useEffect(() => {
        fetchOpportunity();
    }, []);

    const fetchOpportunity = async () => {
        try {
            if (!id || id === 'undefined') {
                console.error('Invalid ID passed to OpportunityDetailScreen');
                setOpportunity(null);
                setLoading(false);
                return;
            }

            const response = await opportunitiesAPI.getById(id);
            setOpportunity(response.data);
        } catch (error) {
            console.error('Fetch opportunity error:', error);
            Alert.alert('Error', 'Failed to load details');
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async () => {
        try {
            setApplying(true);
            await applicationsAPI.apply(id);
            Alert.alert('Success', 'Application submitted successfully');
            navigation.goBack();
        } catch (error) {
            console.error('Apply error:', error);
            Alert.alert('Error', error.response?.data?.message || 'Failed to apply');
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (!opportunity) {
        return (
            <View style={styles.centerContainer}>
                <Text>Opportunity not found</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <View style={styles.companyIcon}>
                        <Text style={styles.logoText}>{(opportunity.companyName || 'C').charAt(0)}</Text>
                    </View>
                    <Text style={styles.position}>{opportunity.role}</Text>
                    <Text style={styles.company}>{opportunity.companyName}</Text>

                    <View style={styles.tagContainer}>
                        <View style={styles.tag}>
                            <Ionicons name="location-outline" size={14} color={theme.colors.primary} />
                            <Text style={styles.tagText}>{opportunity.location}</Text>
                        </View>
                        <View style={styles.tag}>
                            <Ionicons name="cash-outline" size={14} color={theme.colors.primary} />
                            <Text style={styles.tagText}>{opportunity.salary}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.content}>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Job Description</Text>
                        <Text style={styles.description}>{opportunity.description}</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Requirements</Text>
                        <Text style={styles.description}>{opportunity.requirements}</Text>
                    </View>

                    <View style={styles.detailsGrid}>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Branch</Text>
                            <Text style={styles.detailValue}>
                                {opportunity.eligibility?.branches && opportunity.eligibility.branches.length > 0
                                    ? opportunity.eligibility.branches.join(', ')
                                    : 'All'}
                            </Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Batch</Text>
                            <Text style={styles.detailValue}>
                                {opportunity.eligibility?.batches && opportunity.eligibility.batches.length > 0
                                    ? opportunity.eligibility.batches.join(', ')
                                    : 'All'}
                            </Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Min CGPA</Text>
                            <Text style={styles.detailValue}>{opportunity.eligibility?.minCGR || 'N/A'}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Deadline</Text>
                            <Text style={styles.detailValue}>
                                {opportunity.deadline ? new Date(opportunity.deadline).toLocaleDateString() : 'N/A'}
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[
                        styles.applyButton,
                        (applying || opportunity.status !== 'Open' || !!opportunity.applicationStatus) && styles.disabledButton
                    ]}
                    onPress={handleApply}
                    disabled={applying || opportunity.status !== 'Open' || !!opportunity.applicationStatus}
                >
                    {applying ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.applyButtonText}>
                            {opportunity.applicationStatus
                                ? opportunity.applicationStatus
                                : opportunity.status === 'Open' ? 'Apply Now' : 'Closed'}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#f8fafc',
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    companyIcon: {
        width: 80,
        height: 80,
        borderRadius: 24,
        backgroundColor: '#e0e7ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        ...theme.shadows.sm,
    },
    logoText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    position: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.text,
        textAlign: 'center',
        marginBottom: 8,
    },
    company: {
        fontSize: 18,
        color: theme.colors.textLight,
        marginBottom: 16,
    },
    tagContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#eff6ff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 99,
        gap: 6,
    },
    tagText: {
        fontSize: 13,
        fontWeight: '600',
        color: theme.colors.primary,
    },
    content: {
        padding: 24,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 12,
    },
    description: {
        fontSize: 15,
        lineHeight: 24,
        color: theme.colors.textLight,
    },
    detailsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: '#f1f5f9',
        borderRadius: 16,
        padding: 16,
        gap: 16,
    },
    detailItem: {
        width: '45%',
    },
    detailLabel: {
        fontSize: 12,
        color: theme.colors.textLight,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 15,
        fontWeight: '600',
        color: theme.colors.text,
    },
    footer: {
        padding: 24,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        backgroundColor: theme.colors.white,
    },
    applyButton: {
        backgroundColor: theme.colors.primary,
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
        ...theme.shadows.md,
    },
    applyButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: '#cbd5e1',
    },
});

export default OpportunityDetailScreen;
