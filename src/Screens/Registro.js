import { useState, useContext } from 'react';
import Context from '../Utils/Context';
import {
    View,
    Text,
    Pressable,
    TextInput,
    Alert,
    StyleSheet,
    Image,
    ScrollView,
} from 'react-native';
import { HelperText } from 'react-native-paper';
import { SelectList } from 'react-native-dropdown-select-list';
import postData from '../Utils/postData';
import Carga from '../Components/carga/Carga';
const Registro = (props) => {
    const { loading, setLoading } = useContext(Context);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repetriContra, setRepetirContras] = useState('');
    const [usuario, setUsuario] = useState('');
    const [peso, setPeso] = useState('');
    const [altura, setAltura] = useState('');
    const [opcion, setOpcion] = useState('');
    const data = [
        { key: '1', value: 'principiante' },
        { key: '2', value: 'intermedio' },
        { key: '3', value: 'profesionl' },
    ];

    const emailHasErrors = () => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return email != '' && !regex.test(email)
    }

    const usuarioHasErrors = () => {
        const regex = /^[a-zA-Z0-9_-]{3,20}$/;
        return usuario != '' && !regex.test(usuario)
    }

    const contrasenyaHasErrors = () => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return password != '' && !regex.test(password)
    }

    const alturaHasErrors = () => {
        const regex = /^(1[0-9]{2}|2[0-4][0-9]|250)\s?$/;
        return altura != '' && !regex.test(altura)
    }
    const pesoHasErrors = () => {
        const regex = /^([3-9][0-9]|1[0-9]{2}|200)(\.\d{1,2})?\s?$/;
        return peso != '' && !regex.test(peso)
    }

    const registrarUsuario = async () => {
        if (email === '' || password === '' || repetriContra === '' || usuario === '' || peso === '' || altura === '' || opcion === '') {
            Alert.alert("ERROR",'Campos vacios porfavor completalos')
        } else if (password !== repetriContra) {
            Alert.alert("ERROR",'Contraseña no coincide')
        } else {
            const json = {
                nomUsu: usuario,
                contrasenya: password,
                correo: email,
                token: "",
                fotoPerfil: "",
                rutinasGuardadas: [],
                rutinasCreadas: [],
                nivel: opcion,
                peso: peso,
                altura: altura,
                imc: "",
                macros: [],
                puntuacion: "",
                verificado: false
            };

            const response = await postData('http://13.216.205.228:8080/optima/registrar', json, setLoading);

            if (response.status === 201) {
                Alert.alert("USUARIO REGISTRADO", response.data.message);
                props.navigation.navigate('Login');
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
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.subContainer}>
                    <Image source={require('../Assets/img/logo.png')} style={styles.image} />
                </View>
                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        {(email != '' && emailHasErrors(email)) && (
                            <HelperText type="error">
                                Dirección de correo invalida
                            </HelperText>
                        )}
                        <TextInput
                            style={styles.input}
                            placeholder="Introduce el Email"
                            placeholderTextColor="#9CA3AF"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        {(password != '' && contrasenyaHasErrors(password)) && (
                            <HelperText type="error">
                                Contraseña con al menos una letra mayúscula, una minúscula y un número
                            </HelperText>
                        )}
                        <TextInput
                            style={styles.input}
                            placeholder="Introduce la contraseña"
                            placeholderTextColor="#9CA3AF"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Repetir Contraseña"
                            placeholderTextColor="#9CA3AF"
                            value={repetriContra}
                            onChangeText={setRepetirContras}
                            secureTextEntry
                        />
                    </View>
                    {(usuario != '' && usuarioHasErrors(usuario)) && (
                        <HelperText type="error">
                            Nombre usuario invalido longitud 3-20 carácteres
                        </HelperText>
                    )}
                    <TextInput
                        style={styles.input}
                        placeholder="Nombre Usuario"
                        placeholderTextColor="#9CA3AF"
                        value={usuario}
                        onChangeText={setUsuario}
                    />
                    <View style={styles.helpersDatos}>
                        <View style={styles.containerHelper}>
                            {(altura != '' && alturaHasErrors(altura)) && (
                                <HelperText type="error">
                                    Altura en centímetros
                                </HelperText>
                            )}
                        </View>
                        <View style={styles.containerHelper}>
                            {(peso != '' && pesoHasErrors(peso)) && (
                                <HelperText type="error">
                                    Peso en kilogramos
                                </HelperText>
                            )}
                        </View>
                    </View>
                    <View style={styles.containerDatos}>
                        <TextInput
                            style={[styles.input, { width: '49%' }]}
                            placeholder="Altura (cm)"
                            placeholderTextColor="#9CA3AF"
                            value={altura}
                            onChangeText={setAltura}
                        />

                        <TextInput
                            style={[styles.input, { width: '49%' }]}
                            placeholder="Peso (kg)"
                            placeholderTextColor="#9CA3AF"
                            value={peso}
                            onChangeText={setPeso}
                        />
                    </View>
                    <SelectList
                        setSelected={(val) => setOpcion(val)}
                        data={data}
                        save="value"
                        boxStyles={styles.selectBox}
                        inputStyles={styles.selectInput}
                        dropdownStyles={styles.dropdown}
                        dropdownTextStyles={styles.dropdownText}
                        placeholder='Selecciona una dificultad inicial'
                    />
                    <View style={styles.subContainer}>
                        <Pressable style={styles.bottom} onPress={() => registrarUsuario()}>
                            <Text style={styles.textLogin}>Registrarse</Text>
                        </Pressable>
                    </View>
                    <View style={styles.login}>
                        <Text style={styles.resetPasswordText}>Ya tengo cuenta</Text>
                        <Pressable style={styles.bottom} onPress={() => props.navigation.navigate("Login")}>
                            <Text style={styles.textLogin}>Login</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1F2937', // bg-gray-950
    },
    containerCarga: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    helpersDatos: {
        width: '100%',
        flexDirection: 'row',
    },
    containerHelper: {
        width: '50%',
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
    containerDatos: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    textLogin: {
        fontSize: 20,
        color: 'white',
    },
    inputContainer: {
        flexDirection: 'column',
        paddingBottom: 10,
    },
    input: {
        backgroundColor: '#374151', // bg-gray-800
        color: 'white', // text-gray-50
        padding: 12, // p-3
        borderRadius: 8, // rounded-lg
        borderColor: '#607cff',
        borderWidth: 1,
        marginBottom: 10,
        width: '100%',
    },
    resetPasswordText: {
        color: 'white', // text-gray-50
        fontWeight: 'bold',
        fontSize: 17
    },
    image: {
        width: 200,
        height: 200,
    },
    bottom: {
        backgroundColor: '#607cff',
        justifyContent: 'center',
        borderWidth: 2,
        borderRadius: 10,
        borderColor: 'black',
        height: 55,
        width: 160,
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 10
    },
    selectBox: {
        backgroundColor: '#374151', // Gris oscuro
        color: '#F9FAFB', // Texto blanco
        padding: 12,
        borderRadius: 8,
        borderColor: '#607cff',
        borderWidth: 1,
        marginBottom: 10,
        width: '100%',
    },
    selectInput: {
        color: '#C6C6C6', // Texto blanco
        fontSize: 16,
    },
    dropdown: {
        backgroundColor: '#1F2937', // Fondo gris oscuro
        borderColor: '#607cff',
        borderWidth: 1,
        color: '#white', // Texto blanco
    },
    dropdownText: {
        color: '#C6C6C6', // Texto blanco
        fontSize: 14,
    },
    login: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 25,
    }
});

export default Registro;