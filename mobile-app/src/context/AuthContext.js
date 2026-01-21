import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const userData = await AsyncStorage.getItem('user');

            if (token && userData) {
                setUser(JSON.parse(userData));
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Check auth error:', error);
        } finally {
            setLoading(false);
        }
    };

    const register = async (name, email, password) => {
        try {
            setLoading(true);

            const response = await authAPI.register({ name, email, password });
            const { token, user: userData } = response.data;

            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('user', JSON.stringify(userData));

            setUser(userData);
            setIsAuthenticated(true);

            return { success: true };
        } catch (error) {
            console.error('Register error:', error);

            let message = 'Registration failed. Please try again.';
            if (error.response?.data?.message) {
                message = error.response.data.message;
            }

            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            setLoading(true);

            const response = await authAPI.login({ email, password });
            const { token, user: userData } = response.data;

            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('user', JSON.stringify(userData));

            setUser(userData);
            setIsAuthenticated(true);

            return { success: true };
        } catch (error) {
            console.error('Login error:', error);

            let message = 'Login failed. Please try again.';
            if (error.response?.data?.message) {
                message = error.response.data.message;
            }

            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setLoading(true);

            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');

            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateUser = async (updatedData) => {
        try {
            const response = await authAPI.updateProfile(updatedData);
            const updatedUser = response.data.user;

            await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);

            return { success: true, user: updatedUser };
        } catch (error) {
            console.error('Update user error:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to update profile'
            };
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        register,
        login,
        logout,
        updateUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
