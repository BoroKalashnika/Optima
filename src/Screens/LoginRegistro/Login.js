import { useState, useContext, useEffect } from 'react';
import Context from '../../Utils/Context';
import {
    View,
    Text,
    Pressable,
    TextInput,
    Alert,
    StyleSheet,
    Image,
    BackHandler,
    ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import postData from '../../Utils/services/postData';
import getData from '../../Utils/services/getData';
import Carga from '../../Components/carga/Carga';
import { saveToken, getToken, removeToken } from '../../Utils/storage';
const Login = (props) => {
    const { loading, setLoading } = useContext(Context);
    const { token, setToken } = useContext(Context);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useFocusEffect(() => {
        const backAction = () => {
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    });

    useEffect(() => {
        const checkToken = async () => {
            const tokenCache = await getToken();
            if (tokenCache) {
                getData('http://13.216.205.228:8080/optima/tokenUsuario?token=' + tokenCache.token).then(async (response) => {
                    if (response.token === tokenCache.token) {
                        const fechaGuardada = new Date(tokenCache.dateTimeTokenGenerado);
                        const fechaActual = new Date();
                        const diferenciaTiempo = fechaActual.getTime() - fechaGuardada.getTime();
                        const diferenciaDias = Math.floor(diferenciaTiempo / (1000 * 60 * 60 * 24));
                        if (diferenciaDias >= 1) {
                            await postData('http://13.216.205.228:8080/optima/logout', tokenCache, setLoading)
                            await removeToken();
                            setToken('');
                            Alert.alert("CADUCIDAD CREDENCIALES", 'Por favor vuelve a iniciar sesión')
                        } else {
                            setToken(tokenCache.token);
                            props.navigation.navigate('Home');
                        }
                    } else {
                        await postData('http://13.216.205.228:8080/optima/logout', tokenCache, setLoading)
                        await removeToken();
                        setToken('');
                        Alert.alert("CADUCIDAD CREDENCIALES", 'Por favor vuelve a iniciar sesión')
                    }
                })
            }
        };
        checkToken();
    }, []);

    const loginUsuario = async () => {
        if (email === '' || password === '') {
            Alert.alert("ERROR", 'Campos vacios porfavor completalos')
        } else {
            const json = {
                nomUsu: "",
                contrasenya: password,
                correo: email,
                token: "",
                fotoPerfil: "",
                rutinasGuardadas: [],
                rutinasCreadas: [],
                nivel: "",
                peso: "",
                altura: "",
                imc: "",
                macros: [],
                puntuacion: "",
                verificado: false
            };

            const response = await postData('http://13.216.205.228:8080/optima/login', json, setLoading);

            if (response.status === 200) {
                await saveToken(response.data.token);
                setToken({ token: response.data.token });
                props.navigation.navigate('HomeNavegacion');
            } else {
                Alert.alert("ERROR", response.data.message);
            }
        }
    }

    if (loading) {
        return (
            <Carga />
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.subContainer}>
                <Image source={require('../../Assets/img/logo.png')} style={styles.image} />
            </View>
            <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Introduce el Email"
                        placeholderTextColor="#9CA3AF"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Introduce la contraseña"
                        placeholderTextColor="#9CA3AF"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                <View style={styles.optionsContainer}>
                    <Pressable onPress={() => props.navigation.navigate("StacksOlvidadoContraseña")}>
                        <Text style={styles.resetPasswordText}>He olvidado la contraseña</Text>
                    </Pressable>
                </View>
                <View style={styles.containerBotones}>
                    <View style={styles.subContainer}>
                        <Pressable style={styles.bottom} onPress={() => loginUsuario()}>
                            <Text style={styles.textLogin}>LOGIN</Text>
                        </Pressable>
                    </View>
                    <View style={styles.subContainer}>
                        <Pressable style={styles.bottom} onPress={() => props.navigation.navigate("Registro")}>
                            <Text style={styles.textLogin}>REGISTRO</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1F2937',
    },
    subContainer: {
        alignItems: 'center',
        marginBottom: 15,

    },
    formContainer: {
        paddingHorizontal: 16, // px-4
        width: '100%',
        maxWidth: 384, // max-w-sm
        color: '#00008B',
    },
    textLogin: {
        fontSize: 20,
        color: 'white',
    },
    inputContainer: {
        flexDirection: 'column',
        gap: 16, // gap-4
    },
    input: {
        backgroundColor: '#374151', // bg-gray-800
        color: '#F9FAFB', // text-gray-50
        padding: 12, // p-3
        borderRadius: 8, // rounded-lg
        borderColor: "#607cff",
        borderWidth: 1
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 32, // my-8
    },
    resetPasswordText: {
        color: '#F9FAFB', // text-gray-50
        fontWeight: 'bold',
    },
    image: {
        width: 260,
        height: 260,
    },
    bottom: {
        backgroundColor: '#607cff',
        justifyContent: 'center',
        borderWidth: 2,
        borderRadius: 10,
        borderColor: 'black',
        height: 55,
        width: 200,
        alignItems: 'center',
    },
    containerBotones: {
        marginTop: 55,
    }
});

export default Login;