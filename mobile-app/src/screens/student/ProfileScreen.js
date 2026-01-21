import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../theme';

const ProfileScreen = () => {
    const { user, logout, updateUser } = useAuth();
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        branch: user?.branch || '',
        batch: user?.batch || '',
        cgr: user?.cgr?.toString() || '',
        resumeLink: user?.resumeLink || '',
    });

    const handleUpdate = async () => {
        try {
            setLoading(true);
            const dataToUpdate = {
                ...formData,
                cgr: formData.cgr ? parseFloat(formData.cgr) : undefined,
            };
            const result = await updateUser(dataToUpdate);
            if (result.success) {
                Alert.alert('Success', 'Profile updated successfully');
                setEditing(false);
            } else {
                Alert.alert('Error', result.error);
            }
        } catch (error) {
            console.error('Update profile error:', error);
            Alert.alert('Error', 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const renderInput = (label, value, key, placeholder, icon, keyboardType = 'default') => (
        <View style={styles.inputContainer}>
            <Text style={styles.label}>{label}</Text>
            <View style={[styles.inputWrapper, !editing && styles.disabledWrapper]}>
                <Ionicons name={icon} size={20} color={editing ? theme.colors.textLight : '#94a3b8'} style={styles.inputIcon} />
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={(text) => setFormData({ ...formData, [key]: text })}
                    editable={editing}
                    placeholder={placeholder}
                    placeholderTextColor="#94a3b8"
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
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarText}>{(user?.name || 'U').charAt(0)}</Text>
                        {editing && (
                            <View style={styles.cameraIcon}>
                                <Ionicons name="camera" size={16} color="#fff" />
                            </View>
                        )}
                    </View>
                    <Text style={styles.name}>{user?.name}</Text>
                    <Text style={styles.email}>{user?.email}</Text>
                    <View style={styles.roleBadge}>
                        <Text style={styles.roleText}>{user?.role?.toUpperCase()}</Text>
                    </View>
                </View>

                <View style={styles.content}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Academic & Career</Text>
                        <TouchableOpacity
                            style={[styles.editCircle, editing && styles.activeEditCircle]}
                            onPress={() => setEditing(!editing)}
                        >
                            <Ionicons
                                name={editing ? "close" : "create-outline"}
                                size={20}
                                color={editing ? theme.colors.error : theme.colors.primary}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.formCard}>
                        {renderInput('Branch', formData.branch, 'branch', 'e.g., Computer Science', 'git-branch-outline')}
                        {renderInput('Batch', formData.batch, 'batch', 'e.g., 2025', 'calendar-outline')}
                        {renderInput('CGPA / CGR', formData.cgr, 'cgr', 'e.g., 9.2', 'school-outline', 'decimal-pad')}
                        {renderInput('Resume Link', formData.resumeLink, 'resumeLink', 'Full URL to your resume', 'link-outline')}

                        {editing && (
                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={handleUpdate}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.saveButtonText}>Save Profile</Text>
                                )}
                            </TouchableOpacity>
                        )}
                    </View>

                    <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                        <Ionicons name="log-out-outline" size={22} color="#ef4444" />
                        <Text style={styles.logoutText}>Log Out</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        padding: 40,
        backgroundColor: theme.colors.white,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        ...theme.shadows.sm,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#e0e7ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 4,
        borderColor: '#f1f5f9',
        position: 'relative',
    },
    avatarText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: theme.colors.primary,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: theme.colors.textLight,
        marginBottom: 16,
    },
    roleBadge: {
        backgroundColor: '#eff6ff',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 99,
    },
    roleText: {
        fontSize: 12,
        fontWeight: '800',
        color: theme.colors.primary,
        letterSpacing: 1,
    },
    content: {
        padding: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    editCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.sm,
    },
    activeEditCircle: {
        backgroundColor: '#fee2e2',
    },
    formCard: {
        backgroundColor: theme.colors.white,
        borderRadius: 24,
        padding: 20,
        ...theme.shadows.sm,
        marginBottom: 24,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
        color: theme.colors.textLight,
        textTransform: 'uppercase',
        letterSpacing: 1,
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
        borderColor: '#e2e8f0',
    },
    disabledWrapper: {
        backgroundColor: '#fff',
        borderColor: 'transparent',
        paddingHorizontal: 4,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 15,
        color: theme.colors.text,
        fontWeight: '500',
    },
    saveButton: {
        backgroundColor: theme.colors.primary,
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 10,
        ...theme.shadows.md,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fee2e2',
        paddingVertical: 18,
        borderRadius: 20,
        gap: 10,
    },
    logoutText: {
        color: '#ef4444',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ProfileScreen;
