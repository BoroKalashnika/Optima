import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveToken = async (token) => {
    const tokenData = {
        token,
        dateTimeTokenGenerado: new Date(),
    };
    try {
        await AsyncStorage.setItem('tokenCache', JSON.stringify(tokenData));
    } catch (error) {
        console.error('Error al guardar el token en la cache:', error);
    }
};

export const getToken = async () => {
    try {
        const data = await AsyncStorage.getItem('tokenCache');
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error al obtener el token de la cache:', error);
        return null;
    }
};

export const removeToken = async () => {
    await AsyncStorage.removeItem('tokenCache');
};
