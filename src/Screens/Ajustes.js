import { useContext, useEffect, useState, useCallback } from 'react';
import Context from '../Utils/Context';
import {  View, Text, Image, ScrollView, StyleSheet, Alert, Pressable} from 'react-native';
import HeaderRutina from '../Components/headerRutina/HeaderRutina';
import Icon from 'react-native-vector-icons/AntDesign';
import postData from '../Utils/services/postData';
import deleteData from '../Utils/services/deleteData';
import config from '../config/config';
import Carga from '../Components/carga/Carga';
import RNFS from 'react-native-fs';
import { launchImageLibrary } from 'react-native-image-picker';

const Ajustes = (props) => {
    const { token, setToken } = useContext(Context);
    const { loading, setLoading } = useContext(Context);
    const [nombre, setNombre] = useState("nombre");
    const { modalVisible, setModalVisible } = useContext(Context);
    const { alertMessage, setAlertMessage } = useContext(Context);
    const { alertTitle, setAlertTitle } = useContext(Context);
    const [modificar, setModificar] = useState(false);

    const cerrarSesion = async () => {
        setLoading(true);
        const json = {
            token: token
        }
        const response = await postData(
            config.API_OPTIMA + 'logout',
            json, setLoading
        );
        if (response.status === 200) {
            setAlertMessage(response.message);
            setAlertTitle('Has cerrado sesion');
            setModalVisible(true);
            props.navigation.navigate('Login');
        }
        setLoading(false);
    }

    const cambairFoto=()=>{
        const options = {
            mediaType: 'photo',
            includeBase64: false,
            maxWidth: 800,
            maxHeight: 600,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                Alert.alert('Cancelado', 'Seleccionaste cancelar la imagen');
            } else if (response.errorCode) {
                Alert.alert('Error', 'Ocurrió un error al seleccionar la imagen');
            } else {
                const format = response.assets[0].type;
                RNFS.readFile(response.assets[0].uri, 'base64')
                    .then(base64String => {
                        setVistaPrevia(`data:${format};base64,${base64String}`);
                    }).catch(err => console.error(err));
            }
        });
        setModificar(true);
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
                <Pressable onPress={() => cambairFoto()}>
                    {modificar ? <Image source={require('../Assets/img/perfil.png')} style={styles.profileImage} /> : (
                        <>
                            <Image source={require('../Assets/img/perfil.png')} style={styles.profileImage} />
                            <View style={styles.editIcon}>
                                <Icon name="form" size={35} color="#607cff" />
                            </View>
                        </>
                    )}
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