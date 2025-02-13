import { useContext, useEffect, useState, useCallback } from 'react';
import Context from '../Utils/Context';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import HeaderRutina from '../Components/headerRutina/HeaderRutina';
import Icon from 'react-native-vector-icons/AntDesign';
import postData from '../Utils/services/postData';
import deleteData from '../Utils/services/deleteData';
import config from '../config/config';
import Carga from '../Components/carga/Carga';
const Ajustes = (props) => {
    const { token, setToken } = useContext(Context);
    const { loading, setLoading } = useContext(Context);
    const [nombre, setNombre] = useState("nombre");

    const cerrarSesion = async () => {
        setLoading(true);
        const json = {
            token: token
        }
        const response = await postData(
            config.API_OPTIMA + 'logout',
            json, setLoading
        );
        if (!response.status === 202) {
            setAlertMessage(response.message);
            setAlertTitle('ERROR');
            setModalVisible(true);
            console.log(response);
        }
        setLoading(false);
    }
    if (loading) {
        return (
            <Carga />
        );
    }
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <HeaderRutina tipo={'user'} />



            <View style={styles.profileContainer}>
                <Pressable onPress={() => console.log('Editar foto')}>
                    <Image source={require('../Assets/img/perfil.png')} style={styles.profileImage} />
                    <View style={styles.editIcon}>
                        <Icon name="form" size={35} color="#607cff" />
                    </View>
                </Pressable>
            </View>

            <Text style={styles.name}>{nombre}</Text>

            <Text style={styles.languageText}>Idioma de la aplicación</Text>
            <View style={styles.flagsContainer}>
                <Pressable>
                    <Image source={require('../Assets/img/spain.png')} style={styles.flag} />
                </Pressable>
                <Pressable>
                    <Image source={require('../Assets/img/english.png')} style={styles.flag} />
                </Pressable>
            </View>       
                <Pressable style={styles.logoutButton} onPress={() => cerrarSesion()}>
                    <Text style={styles.logoutText}>Cerrar sesión</Text>
                </Pressable>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#1F2937',
    },
    profileContainer: {
        position: 'relative',
    },
    profileImage: {
        width: 185,
        height: 185,
        borderRadius: 50,
        marginTop: 10,
    },
    editIcon: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        backgroundColor: '#1F2937',
        borderRadius: 15,
        padding: 5,
    },
    icon: {
        width: 20,
        height: 20,
    },
    name: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#bbdefb',
        marginTop: 10,
    },
    languageText: {
        fontSize: 25,
        color: 'white',
        marginTop: 20,
        marginBottom: 10,
    },
    flagsContainer: {
        flexDirection: 'row',
        marginTop: 10,
        gap: 15
    },
    flag: {
        width: 100,
        height: 55,
        borderRadius: 5,
    },
    logoutButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#FF3B30',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    logoutText: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    }
});

export default Ajustes;