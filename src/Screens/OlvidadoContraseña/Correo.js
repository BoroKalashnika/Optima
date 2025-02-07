import { useState, useContext } from 'react';
import Context from '../../Utils/Context';
import {
    View,
    Text,
    Pressable,
    TextInput,
    Button,
    Alert,
    StyleSheet,
    Image,
    ScrollView
} from 'react-native';
import { HelperText } from 'react-native-paper';
import postData from '../../Utils/services/postData';
import Carga from '../../Components/carga/Carga';
const Correo = (props) => {
    const { loading, setLoading } = useContext(Context);
    const { email, setEmail } = useContext(Context);
    const [correo, setCorreo] = useState('');

    const emailHasErrors = () => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return correo != '' && !regex.test(correo)
    }

    const handleOnPress = async () => {
        if (correo === '') {
            Alert.alert("ERROR", 'Correo Vacio')
        } else if (emailHasErrors()) {
            Alert.alert("ERROR", 'Correo invalido')
        } else {
            const json = {
                nomUsu: "",
                contrasenya: "",
                correo: correo,
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

            const response = await postData('http://13.216.205.228:8080/optima/restablecerContrasenya', json, setLoading);

            if (response.status === 200) {
                setEmail(correo);
                props.navigation.navigate('Codigo')
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
        <View style={styles.container}>
            <View style={styles.subContainer}>
                <Image source={require('../../Assets/img/logo.png')} style={styles.image} />
            </View>
            <View style={styles.formContainer}>
                <Text style={styles.text}>Introduce tu correo para enviarte un código de un solo uso</Text>
                <View style={styles.inputContainer}>
                    {(correo != '' && emailHasErrors()) && (
                        <HelperText type="error">
                            Dirección de correo invalida
                        </HelperText>
                    )}
                    <TextInput
                        style={styles.input}
                        placeholder="Introduce tu correo electronico"
                        placeholderTextColor="#9CA3AF"
                        value={correo}
                        onChangeText={(newEmail) => setCorreo(newEmail)}
                    />
                </View>

                <View style={styles.subContainer}>
                    <Pressable style={styles.bottom} onPress={() => handleOnPress()}>
                        <Text style={styles.textLogin}>Enviar</Text>
                    </Pressable>
                </View>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1F2937',
        paddingTop: 60
    },
    subContainer: {
        alignItems: 'center',
        marginBottom: 15,
        flex: 1,
    },
    formContainer: {
        paddingHorizontal: 16,
        width: '100%',
        color: '#00008B',
        flex: 1.5
    },
    text: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
        fontStyle: 'italic',
        padding: 10,
        textAlign: "center"
    },
    inputContainer: {
        flexDirection: 'column',
        gap: 16,
        marginTop: 20,
        marginBottom: 20
    },
    input: {
        backgroundColor: '#374151',
        color: '#F9FAFB',
        padding: 12,
        borderRadius: 8,
        borderColor: "#607cff",
        borderWidth: 1
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
        width: 160,
        alignItems: 'center',
    },
});

export default Correo;