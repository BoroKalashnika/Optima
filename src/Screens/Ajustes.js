import { useContext, useEffect, useState } from 'react';
import Context from '../Utils/Context';
import { View, Text, Image, ScrollView, StyleSheet, Alert, Pressable, Switch, TextInput } from 'react-native';
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
    const { setModalVisible } = useContext(Context);
    const { setAlertMessage } = useContext(Context);
    const { setAlertTitle } = useContext(Context);
    const [nombre, setNombre] = useState("nombre");
    const [vistaPrevia, setVistaPrevia] = useState(null);
    const [foto, setFoto] = useState();
    const [isDarkMode, setIsDarkMode] = useState(true); // Estado para el modo oscuro/claro
    const [nombreEditable, setNombreEditable] = useState(false);
    const [nuevoNombre, setNuevoNombre] = useState(nombre); // Inicializa nuevoNombre con el valor de nombre

    useEffect(() => {
        getData(config.API_OPTIMA + 'tokenUsuario?token=' + token).then((response) => {
            setNombre(response.nombre);
            setNuevoNombre(response.nombre); // Actualiza nuevoNombre con el nombre del usuario
            if (response.fotoPerfil !== "") {
                setFoto(response.fotoPerfil);
            }
        });
    }, []);

    // Elimina este useEffect, ya que no es necesario
    // useEffect(() => { setNuevoNombre(nombre) }, [nombre]);

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
                    if (response.status !== 200) {
                        setAlertMessage(response.data.message);
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

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    const toggleEditNombre = async () => {
        if (nombreEditable) {
            setLoading(true);
            const json = {
                token: token,
                nuevoNombre: nuevoNombre,
            };
            console.log(nuevoNombre);
            try {
                const response = await postData(config.API_OPTIMA + 'cambiarNombre', json, setLoading);
                if (response.status === 200) {
                    setNombre(nuevoNombre);  // Actualizamos el nombre en el estado local
                    setAlertMessage("Nombre actualizado correctamente");
                    setAlertTitle("Éxito");
                    setModalVisible(true);
                } else {
                    console.error("Error en la respuesta de la API:", response);
                    Alert.alert("ERROR", response.data?.message || "No se pudo actualizar el nombre");
                }
            } catch (error) {
                console.error("Error al actualizar el nombre:", error);
                Alert.alert("ERROR", "Hubo un problema al comunicarse con el servidor");
            }

            setLoading(false);
        }
        setNombreEditable(!nombreEditable);
    };
    if (loading) {
        return <Carga />;
    }

    return (
        <ScrollView contentContainerStyle={[styles.container, isDarkMode ? styles.darkMode : styles.lightMode]}>
            <HeaderRutina tipo={'user'} />
            <View style={styles.profileContainer}>
                <Pressable onPress={() => cambairFoto()}>
                    {vistaPrevia ?
                        <>
                            <Image source={{ uri: foto }} style={styles.profileImage} />
                            <View style={styles.editIcon}>
                                <Icon name="form" size={35} color="#607cff" />
                            </View>
                        </> : (
                            <>
                                <Image source={require('../Assets/img/perfil.png')} style={styles.profileImage} />
                                <View style={styles.editIcon}>
                                    <Icon name="form" size={35} color="#607cff" />
                                </View>
                            </>
                        )}
                </Pressable>
            </View>

            <View style={styles.profileContainer}>
                <View style={styles.editContainer}>
                    {nombreEditable ? (
                        <TextInput
                            style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]}
                            value={nuevoNombre}
                            onChangeText={setNuevoNombre}
                            maxLength={15}
                        />
                    ) : (
                        <Text style={[styles.name, isDarkMode ? styles.darkText : styles.lightText]}>{nombre}</Text>
                    )}
                    <Pressable style={styles.editButton} onPress={toggleEditNombre}>
                        <Text style={styles.editButtonText}>{nombreEditable ? 'Guardar' : 'Modificar'}</Text>
                    </Pressable>
                </View>
            </View>

            <View style={styles.themeContainer}>
                <Text style={[styles.themeText, isDarkMode ? styles.darkText : styles.lightText]}>Modo Oscuro</Text>
                <Switch
                    value={isDarkMode}
                    onValueChange={toggleDarkMode}
                    thumbColor={isDarkMode ? '#607cff' : '#f4f3f4'}
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                />
            </View>

            <Pressable style={[styles.logoutButton, isDarkMode ? styles.darkButton : styles.lightButton]} onPress={() => cerrarSesion()}>
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
    },
    input: {
        borderRadius: 10,
        marginBottom: 10,
        width: '60%',
        backgroundColor: '#374151',
        color: '#bbdefb',
        padding: 12,
        borderColor: '#607cff',
        borderWidth: 1,
    },
    darkMode: {
        backgroundColor: '#1F2937',
    },
    lightMode: {
        backgroundColor: '#ffffff',
    },
    darkText: {
        color: '#bbdefb',
    },
    lightText: {
        color: '#1F2937',
    },
    profileContainer: {
        position: 'relative',
        marginTop: 50
    },
    editContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        gap: 20
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
    name: {
        fontSize: 40,
        fontWeight: 'bold',
        marginTop: 10,
    },
    languageText: {
        fontSize: 25,
        marginTop: 20,
        marginBottom: 10,
    },
    themeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 40,
        gap: 10,
    },
    themeText: {
        fontSize: 20,
    },
    logoutButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    darkButton: {
        backgroundColor: '#FF3B30',
    },
    lightButton: {
        backgroundColor: '#607cff',
    },
    logoutText: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
    editButton: {
        padding: 8,
        backgroundColor: '#607cff',
        borderRadius: 5,
        height: 45,
        width: 90,
        justifyContent: "center",
        alignItems: "center"
    },
    editButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default Ajustes;