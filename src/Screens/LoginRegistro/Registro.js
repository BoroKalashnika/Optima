import { useState, useContext } from 'react';
import Context from '../../Utils/Context';
import {
    View,
    Text,
    Pressable,
    TextInput,
    Alert,
    StyleSheet,
    Image,
    ScrollView,
    Modal
} from 'react-native';
import { HelperText } from 'react-native-paper';
import { Button } from 'react-native-paper';
import { SelectList } from 'react-native-dropdown-select-list';
import { Checkbox } from 'react-native-paper';
import postData from '../../Utils/services/postData';
import Carga from '../../Components/carga/Carga';
import config from '../../config/config';

const Registro = (props) => {
    const { loading, setLoading } = useContext(Context);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repetriContra, setRepetirContras] = useState('');
    const [usuario, setUsuario] = useState('');
    const [peso, setPeso] = useState('');
    const [altura, setAltura] = useState('');
    const [opcion, setOpcion] = useState('');
    const [checked, setChecked] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const data = [
        { key: '1', value: 'Beginner' },
        { key: '2', value: 'Intermediate' },
        { key: '3', value: 'Professional' },
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
            Alert.alert("ERROR", 'Please fill in all fields')
        } else if (password !== repetriContra) {
            Alert.alert("ERROR", 'Passwords do not match')
        } else if (emailHasErrors() || usuarioHasErrors() || contrasenyaHasErrors() || alturaHasErrors() || pesoHasErrors()) {
            Alert.alert("ERROR", 'Some fields are invalid')
        } else if (!checked) {
            Alert.alert("YOU HAVE NOT ACCEPTED THE TERMS AND PRIVACY", 'You cannot register without accepting the terms and policies')
        } else {
            const json = {
                nombre: usuario,
                contrasenya: password,
                correo: email,
                token: "",
                fotoPerfil: "",
                rutinasGuardadas: [],
                rutinasCreadas: [],
                nivel: opcion,
                peso: peso,
                altura: altura,
                historialImc: [],
                macros: "",
                puntuacion: "0",
                verificado: false
            };

            const response = await postData(config.API_OPTIMA + 'registrar', json, setLoading);

            if (response.status === 201) {
                Alert.alert("USER REGISTERED", response.data.message);
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
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.subContainer}>
                <Image source={require('../../Assets/img/logo.png')} style={styles.image} />
            </View>
            <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                    {(email != '' && emailHasErrors()) && (
                        <HelperText type="error">
                            Invalid email address
                        </HelperText>
                    )}
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Email"
                        placeholderTextColor="#9CA3AF"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    {(password != '' && contrasenyaHasErrors()) && (
                        <HelperText type="error">
                            Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number
                        </HelperText>
                    )}
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Password"
                        placeholderTextColor="#9CA3AF"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Repeat Password"
                        placeholderTextColor="#9CA3AF"
                        value={repetriContra}
                        onChangeText={setRepetirContras}
                        secureTextEntry
                    />
                </View>
                {(usuario != '' && usuarioHasErrors()) && (
                    <HelperText type="error">
                        Invalid username, must be 3-20 characters long
                    </HelperText>
                )}
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    placeholderTextColor="#9CA3AF"
                    value={usuario}
                    onChangeText={setUsuario}
                    maxLength={15}
                />
                <View style={styles.helpersDatos}>
                    <View style={styles.containerHelper}>
                        {(altura != '' && alturaHasErrors()) && (
                            <HelperText type="error">
                                Height in centimeters
                            </HelperText>
                        )}
                    </View>
                    <View style={styles.containerHelper}>
                        {(peso != '' && pesoHasErrors()) && (
                            <HelperText type="error">
                                Weight in kilograms
                            </HelperText>
                        )}
                    </View>
                </View>
                <View style={styles.containerDatos}>
                    <TextInput
                        style={[styles.input, { width: '49%' }]}
                        placeholder="Height (cm)"
                        placeholderTextColor="#9CA3AF"
                        value={altura}
                        onChangeText={setAltura}
                        maxLength={3}
                    />

                    <TextInput
                        style={[styles.input, { width: '49%' }]}
                        placeholder="Weight (kg)"
                        placeholderTextColor="#9CA3AF"
                        value={peso}
                        onChangeText={setPeso}
                        maxLength={3}
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
                    placeholder='Select an initial difficulty level'
                />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Checkbox
                        status={checked ? 'checked' : 'unchecked'}
                        onPress={() => setChecked(!checked)}
                        color={checked ? '#607cff' : '#ffffff'}
                        uncheckedColor="#ffffff"
                        size={80}
                    />
                    <Text style={{ color: '#ffffff', marginLeft: 8, fontSize: 16 }}>
                        I agree to the Privacy Policy and Terms of Service
                    </Text>
                </View>
                <View style={{ marginTop: 10, marginLeft: 10 }}>
                    <Pressable onPress={() => setModalVisible(true)}>
                        <Text style={{ color: 'white', textDecorationLine: 'underline' }}>See more</Text>
                    </Pressable>
                </View>
                <View style={styles.registrar}>
                    <Pressable style={styles.bottom} onPress={() => registrarUsuario()}>
                        <Text style={styles.textLogin}>Register</Text>
                    </Pressable>
                </View>
                <View style={styles.login}>
                    <Text style={styles.resetPasswordText}>Already have an account</Text>
                    <Pressable style={styles.bottom} onPress={() => props.navigation.navigate("Login")}>
                        <Text style={styles.textLogin}>Login</Text>
                    </Pressable>
                </View>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Privacy Consent Agreement</Text>
                        <Text style={styles.modalMessage}>By registering, you agree to our Privacy Policy and Terms of Service.{'\n\n'}You consent to the collection, storage, and processing of your personal data in accordance with our policies.{'\n\n'}Your information will be used to provide and improve our services, and we will not share it with third parties without your consent, except as required by law.</Text>
                        <Button mode="contained" onPress={() => setModalVisible(false)} style={styles.modalButton}>
                            Close
                        </Button>
                    </View>
                </View>
            </Modal>
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
    registrar: {
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 10,
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
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#0d47a1',
        marginBottom: 10,
    },
    modalMessage: {
        fontSize: 16,
        color: '#333333',
        marginBottom: 20,
    },
    modalButton: {
        backgroundColor: '#607cff',
    },
});

export default Registro;