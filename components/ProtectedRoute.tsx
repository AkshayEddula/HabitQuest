import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    loadingComponent?: React.ReactNode;
    redirectTo?: string;
}

export function ProtectedRoute({
    children,
    loadingComponent,
    redirectTo = "/(auth)/welcome"
}: ProtectedRouteProps) {
    const { user, isLoading } = useAuth();

    // Show loading state
    if (isLoading) {
        if (loadingComponent) {
            return <>{loadingComponent}</>;
        }
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#6C63FF" />
            </View>
        );
    }

    // Redirect if not authenticated
    if (!user) {
        return <Redirect href={redirectTo} />;
    }

    // Render protected content
    return <>{children}</>;
}

// HOC version for class components
export function withProtectedRoute<P extends object>(
    WrappedComponent: React.ComponentType<P>,
    options: Omit<ProtectedRouteProps, 'children'> = {}
) {
    return function WithProtectedRouteWrapper(props: P) {
        return (
            <ProtectedRoute {...options}>
                <WrappedComponent {...props} />
            </ProtectedRoute>
        );
    };
}
