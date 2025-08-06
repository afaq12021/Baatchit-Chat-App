import React, { useEffect } from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Logo from '../../assets/images/Baatchit.png';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
    const navigation = useNavigation();
    const { colors } = useTheme();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.navigate('main' as never);
        }, 2000);

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.main}>
                <Image source={Logo} style={styles.logo} />

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    main: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: width * 0.8,
        height: height * 0.4,
        borderRadius: 20
    },
});

export default SplashScreen;
