import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../theme';

const { width } = Dimensions.get('window');

const LoginScreen = () => {
    const { login, register, loading } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const handleSubmit = async () => {
        if (!formData.email || !formData.password) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        if (!isLogin && !formData.name) {
            Alert.alert('Error', 'Please enter your name');
            return;
        }

        let result;
        if (isLogin) {
            result = await login(formData.email, formData.password);
        } else {
            result = await register(formData.name, formData.email, formData.password);
        }

        if (!result.success) {
            Alert.alert('Error', result.error);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <LinearGradient
                colors={[theme.colors.primary, '#0052cc', '#0747a6']}
                style={styles.gradient}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                    <View style={styles.header}>
                        <View style={styles.logoContainer}>
                            <Text style={styles.logo}>SST</Text>
                        </View>
                        <Text style={styles.title}>CampusHire</Text>
                        <Text style={styles.subtitle}>Elevate your career journey</Text>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.formTitle}>{isLogin ? 'Welcome Back' : 'Get Started'}</Text>
                        <Text style={styles.formSubtitle}>
                            {isLogin ? 'Sign in to access opportunities' : 'Create an account to join the network'}
                        </Text>

                        {!isLogin && (
                            <View style={styles.inputWrapper}>
                                <Text style={styles.label}>Full Name</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your name"
                                    placeholderTextColor={theme.colors.textLight}
                                    value={formData.name}
                                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                                    autoCapitalize="words"
                                />
                            </View>
                        )}

                        <View style={styles.inputWrapper}>
                            <Text style={styles.label}>College Email</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="name@college.edu"
                                placeholderTextColor={theme.colors.textLight}
                                value={formData.email}
                                onChangeText={(text) => setFormData({ ...formData, email: text })}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>

                        <View style={styles.inputWrapper}>
                            <Text style={styles.label}>Password</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Min. 6 characters"
                                placeholderTextColor={theme.colors.textLight}
                                value={formData.password}
                                onChangeText={(text) => setFormData({ ...formData, password: text })}
                                secureTextEntry
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.submitButtonText}>
                                    {isLogin ? 'Sign In' : 'Create Account'}
                                </Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>
                                {isLogin ? "Don't have an account?" : "Already have an account?"}
                            </Text>
                            <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                                <Text style={styles.switchText}>
                                    {isLogin ? ' Register' : ' Log In'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logoContainer: {
        width: 75,
        height: 65,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    logo: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 32,
        padding: 32,
        width: '100%',
        ...theme.shadows.lg,
    },
    formTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.text,
        textAlign: 'center',
        marginBottom: 8,
    },
    formSubtitle: {
        fontSize: 14,
        color: theme.colors.textLight,
        textAlign: 'center',
        marginBottom: 32,
    },
    inputWrapper: {
        marginBottom: 20,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
        opacity: 0.8,
    },
    input: {
        backgroundColor: '#f1f5f9',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: theme.colors.text,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    submitButton: {
        backgroundColor: theme.colors.primary,
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 12,
        ...theme.shadows.md,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    footerText: {
        fontSize: 14,
        color: theme.colors.textLight,
    },
    switchText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
});

export default LoginScreen;
