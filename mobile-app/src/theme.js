export const theme = {
    colors: {
        primary: '#0066ff', // Vibrant Sky Blue
        secondary: '#0052cc', // Deep Royal Blue
        accent: '#3399ff', // Bright Sky Blue
        success: '#00c853', // Bright Green
        error: '#ff1744', // Bright Red
        warning: '#ffab00', // Bright Amber
        background: '#ffffff', // Pure White for brightness
        card: '#f8f9fa', // Light Gray card
        text: '#091e42', // Deep Blue-Black for readability
        textLight: '#505f79', // Muted Blue-Gray
        border: '#dfe1e6', // Light Border
        white: '#ffffff',
        black: '#000000',
        transparent: 'transparent',
        glass: 'rgba(255, 255, 255, 0.9)',
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
    },
    borderRadius: {
        sm: 4,
        md: 8,
        lg: 16,
        xl: 24,
        full: 9999,
    },
    typography: {
        h1: {
            fontSize: 32,
            fontWeight: 'bold',
        },
        h2: {
            fontSize: 24,
            fontWeight: 'bold',
        },
        h3: {
            fontSize: 18,
            fontWeight: '600',
        },
        body: {
            fontSize: 16,
            fontWeight: 'normal',
        },
        caption: {
            fontSize: 12,
            fontWeight: 'normal',
        },
        button: {
            fontSize: 16,
            fontWeight: '600',
        },
    },
    shadows: {
        sm: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 2,
        },
        md: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 4,
        },
        lg: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.15,
            shadowRadius: 15,
            elevation: 8,
        },
    }
};
