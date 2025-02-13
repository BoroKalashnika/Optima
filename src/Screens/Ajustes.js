import { useContext, useEffect, useState, useCallback } from 'react';
import Context from '../Utils/Context';
import { View, Text, Image, ScrollView, StyleSheet, Alert, Pressable } from 'react-native';
import HeaderRutina from '../Components/headerRutina/HeaderRutina';
import Icon from 'react-native-vector-icons/AntDesign';
import postData from '../Utils/services/postData';
import getData from '../Utils/services/getData';
import { removeToken } from '../Utils/storage';
import config from '../config/config';
import Carga from '../Components/carga/Carga';
import RNFS from 'react-native-fs';
import { launchImageLibrary } from 'react-native-image-picker';

const Ajustes = (props) => {
    const { token, setToken } = useContext(Context);
    const { loading, setLoading } = useContext(Context);
    const { modalVisible, setModalVisible } = useContext(Context);
    const { alertMessage, setAlertMessage } = useContext(Context);
    const { alertTitle, setAlertTitle } = useContext(Context);
    const [nombre, setNombre] = useState("nombre");
    const [vistaPrevia, setVistaPrevia] = useState(null);
    const [foto, setFoto] = useState();

    useEffect(() => {
        getData(config.API_OPTIMA + 'tokenUsuario?token=' + token).then((response) => {
            setNombre(response.nombre);
            if (response.fotoPerfil != "") {
                setFoto(response.fotoPerfil);
            }
            console.log(response);
        });
    }, []);

    useEffect(() => {
        const actualizarFoto = async () => {
            if (foto) {
                setLoading(true);
                const json = {
                    token: token,
                    fotoPerfil: foto
                };
                try {
                    const response = await postData(config.API_OPTIMA + 'registrarFoto', json, setLoading);
                    console.log(response);
                    if (response.status !== 200) {
                        setAlertMessage(response.message);
                        setAlertTitle('ERROR');
                        setModalVisible(true);
                    }
                } catch (error) {
                    console.error("Error al subir la foto:", error);
                }
                setLoading(false);
                setVistaPrevia(true);
            }
        };
    
        actualizarFoto();
    }, [foto]);
    

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
            await removeToken();
            setToken('');
            Alert.alert("Cerrando sesión", 'Se ha deslogueado correctamente');
            props.navigation.navigate('Login')
        } else {
            Alert.alert("ERROR", 'No se ha podido cerrar la sesión');
        }
        setLoading(false);
    }

    const cambairFoto = async () => {
        const options = {
            mediaType: 'photo',
            includeBase64: false,
            maxWidth: 800,
            maxHeight: 600,
        };

        launchImageLibrary(options, async (response) => {
            if (response.didCancel) {
                Alert.alert('Cancelado', 'Seleccionaste cancelar la imagen');
            } else if (response.errorCode) {
                Alert.alert('Error', 'Ocurrió un error al seleccionar la imagen');
            } else {
                try {
                    const format = response.assets[0].type;
                    const base64String = await RNFS.readFile(response.assets[0].uri, 'base64');

                    setFoto(`data:${format};base64,${base64String}`);
                    console.log(foto);
                } catch (err) {
                    console.error("Error al procesar la imagen:", err);
                }
            }
        });
    };


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
                    {vistaPrevia ? <Image source={{ uri: foto }} style={styles.profileImage} /> : (
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
        borderRadius: 100,
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