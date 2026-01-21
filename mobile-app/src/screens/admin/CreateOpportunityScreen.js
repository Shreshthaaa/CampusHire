import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { opportunitiesAPI } from '../../services/api';
import { theme } from '../../theme';

const CreateOpportunityScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        companyName: '',
        role: '',
        description: '',
        requirements: '',
        location: '',
        salary: '',
        minCGR: '',
        branch: '',
        batch: '',
        deadline: '',
    });

    const handleCreate = async () => {
        if (!formData.companyName || !formData.role || !formData.description || !formData.deadline) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                companyName: formData.companyName,
                role: formData.role,
                description: formData.description,
                requirements: formData.requirements,
                location: formData.location,
                salary: formData.salary,
                deadline: formData.deadline,
                eligibility: {
                    minCGR: formData.minCGR ? parseFloat(formData.minCGR) : 0,
                    branches: formData.branch ? formData.branch.split(',').map(b => b.trim()) : [],
                    batches: formData.batch ? formData.batch.split(',').map(b => b.trim()) : [],
                }
            };
            await opportunitiesAPI.create(payload);
            Alert.alert('Success', 'Opportunity posted successfully', [
                { text: 'Great!', onPress: () => navigation.goBack() },
            ]);
        } catch (error) {
            console.error('Create opportunity error:', error);
            Alert.alert('Error', error.response?.data?.message || 'Failed to create opportunity');
        } finally {
            setLoading(false);
        }
    };

    const renderInput = (label, value, key, placeholder, icon, multiline = false, keyboardType = 'default') => (
        <View style={styles.inputContainer}>
            <Text style={styles.label}>{label}</Text>
            <View style={[styles.inputWrapper, multiline && styles.textAreaWrapper]}>
                <Ionicons name={icon} size={20} color={theme.colors.textLight} style={styles.inputIcon} />
                <TextInput
                    style={[styles.input, multiline && styles.textArea]}
                    value={value}
                    onChangeText={(text) => setFormData({ ...formData, [key]: text })}
                    placeholder={placeholder}
                    placeholderTextColor="#94a3b8"
                    multiline={multiline}
                    numberOfLines={multiline ? 4 : 1}
                    keyboardType={keyboardType}
                />
            </View>
        </View>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>Post New Opportunity</Text>
                    <Text style={styles.subtitle}>Fill in the details for the new job posting</Text>
                </View>

                <View style={styles.form}>
                    {renderInput('Company Name *', formData.companyName, 'companyName', 'e.g., Google', 'business-outline')}
                    {renderInput('Position/Role *', formData.role, 'role', 'e.g., Full Stack Developer', 'briefcase-outline')}
                    {renderInput('Location', formData.location, 'location', 'e.g., Bangalore, Remote', 'location-outline')}
                    {renderInput('Salary Package', formData.salary, 'salary', 'e.g., 12-15 LPA', 'cash-outline')}

                    <View style={styles.row}>
                        <View style={{ flex: 1 }}>
                            {renderInput('Min CGPA', formData.minCGR, 'minCGR', 'e.g., 7.5', 'school-outline', false, 'decimal-pad')}
                        </View>
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            {renderInput('Batch', formData.batch, 'batch', 'e.g., 2025', 'calendar-outline')}
                        </View>
                    </View>

                    {renderInput('Eligible Branch', formData.branch, 'branch', 'e.g., CSE, ECE', 'git-branch-outline')}
                    {renderInput('Deadline *', formData.deadline, 'deadline', 'YYYY-MM-DD', 'time-outline')}
                    {renderInput('Job Description *', formData.description, 'description', 'Key responsibilities and overview...', 'document-text-outline', true)}
                    {renderInput('Requirements', formData.requirements, 'requirements', 'Skills, experience, etc.', 'list-outline', true)}

                    <TouchableOpacity
                        style={[styles.createButton, loading && styles.disabledButton]}
                        onPress={handleCreate}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <Text style={styles.createButtonText}>Publish Opportunity</Text>
                                <Ionicons name="send" size={18} color="#fff" />
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    header: {
        padding: 24,
        backgroundColor: '#f8fafc',
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    subtitle: {
        fontSize: 14,
        color: theme.colors.textLight,
        marginTop: 4,
    },
    form: {
        padding: 24,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: 8,
        marginLeft: 4,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f5f9',
        borderRadius: 12,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 15,
        color: theme.colors.text,
    },
    textAreaWrapper: {
        alignItems: 'flex-start',
        paddingTop: 12,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    row: {
        flexDirection: 'row',
    },
    createButton: {
        backgroundColor: theme.colors.primary,
        borderRadius: 16,
        paddingVertical: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        gap: 8,
        ...theme.shadows.md,
    },
    createButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: '#cbd5e1',
    },
});

export default CreateOpportunityScreen;
