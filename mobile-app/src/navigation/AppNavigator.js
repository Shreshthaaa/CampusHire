import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';

// Student Screens
import HomeScreen from '../screens/student/HomeScreen';
import OpportunityDetailScreen from '../screens/student/OpportunityDetailScreen';
import MyApplicationsScreen from '../screens/student/MyApplicationsScreen';
import ProfileScreen from '../screens/student/ProfileScreen';

// Admin Screens
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import CreateOpportunityScreen from '../screens/admin/CreateOpportunityScreen';
import ManageOpportunitiesScreen from '../screens/admin/ManageOpportunitiesScreen';
import ApplicantsScreen from '../screens/admin/ApplicantsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const headerOptions = {
    headerStyle: {
        backgroundColor: theme.colors.white,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    headerTitleStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    headerTintColor: theme.colors.primary,
};

// Student Tab Navigator
const StudentTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === 'Home') iconName = 'briefcase';
                    else if (route.name === 'MyApplications') iconName = 'document-text';
                    else if (route.name === 'Profile') iconName = 'person';
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.textLight,
                tabBarStyle: {
                    paddingBottom: 10,
                    paddingTop: 10,
                    height: 70,
                    backgroundColor: theme.colors.white,
                    borderTopWidth: 1,
                    borderTopColor: theme.colors.border,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                    marginBottom: 5,
                },
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    title: 'Opportunities',
                    headerShown: true,
                    ...headerOptions,
                }}
            />
            <Tab.Screen
                name="MyApplications"
                component={MyApplicationsScreen}
                options={{
                    title: 'Applications',
                    headerShown: true,
                    ...headerOptions,
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    title: 'Profile',
                    headerShown: true,
                    ...headerOptions,
                }}
            />
        </Tab.Navigator>
    );
};

// Student Stack Navigator
const StudentStack = () => {
    return (
        <Stack.Navigator screenOptions={headerOptions}>
            <Stack.Screen
                name="StudentTabs"
                component={StudentTabs}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="OpportunityDetail"
                component={OpportunityDetailScreen}
                options={{ title: 'Job Details' }}
            />
        </Stack.Navigator>
    );
};

// Admin Stack Navigator
const AdminStack = () => {
    return (
        <Stack.Navigator screenOptions={headerOptions}>
            <Stack.Screen
                name="AdminDashboard"
                component={AdminDashboardScreen}
                options={{ title: 'Admin Overview' }}
            />
            <Stack.Screen
                name="CreateOpportunity"
                component={CreateOpportunityScreen}
                options={{ title: 'Post New Job' }}
            />
            <Stack.Screen
                name="ManageOpportunities"
                component={ManageOpportunitiesScreen}
                options={{ title: 'Manage Jobs' }}
            />
            <Stack.Screen
                name="Applicants"
                component={ApplicantsScreen}
                options={{ title: 'Applicant List' }}
            />
        </Stack.Navigator>
    );
};

// Main App Navigator
const AppNavigator = () => {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) {
        return null;
    }

    return (
        <NavigationContainer>
            {!isAuthenticated ? (
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Login" component={LoginScreen} />
                </Stack.Navigator>
            ) : user?.role === 'admin' ? (
                <AdminStack />
            ) : (
                <StudentStack />
            )}
        </NavigationContainer>
    );
};

export default AppNavigator;
