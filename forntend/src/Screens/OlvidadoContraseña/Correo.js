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
} from 'react-native';
import { HelperText } from 'react-native-paper';
import postData from '../../Utils/services/postData';
import Carga from '../../Components/carga/Carga';
import config from '../../config/config';
import { ScrollView } from 'react-native-gesture-handler';

const Correo = (props) => {
    const { loading, setLoading } = useContext(Context);
    const { setEmail } = useContext(Context);
    const [correo, setCorreo] = useState('');

    const emailHasErrors = () => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return correo != '' && !regex.test(correo)
    }

    const handleOnPress = async () => {
        if (correo === '') {
            Alert.alert("ERROR", 'Email empty')
        } else if (emailHasErrors()) {
            Alert.alert("ERROR", 'Invalid email')
        } else {
            const json = {
                nombre: "",
                contrasenya: "",
                correo: correo,
                token: "",
                fotoPerfil: "",
                rutinasGuardadas: [],
                rutinasCreadas: [],
                nivel: "",
                peso: "",
                altura: "",
                historialImc: [],
                macros: "",
                puntuacion: "",
                verificado: false
            };

            const response = await postData(config.API_OPTIMA + 'restablecerContrasenya', json, setLoading);

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
            <ScrollView>
                <View style={styles.subContainer}>
                    <Image source={require('../../Assets/img/logo.png')} style={styles.image} />
                </View>
                <View style={styles.formContainer}>
                    <Text style={styles.text}>Enter your email to receive a one-time verification code</Text>
                    <View style={styles.inputContainer}>
                        {(correo != '' && emailHasErrors()) && (
                            <HelperText type="error">
                                Invalid email address
                            </HelperText>
                        )}
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your email"
                            placeholderTextColor="#9CA3AF"
                            value={correo}
                            onChangeText={(newEmail) => setCorreo(newEmail)}
                            keyboardType='email-address'
                        />
                    </View>

                    <View style={styles.subContainer}>
                        <Pressable style={styles.bottom} onPress={() => handleOnPress()}>
                            <Text style={styles.textLogin}>Send</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
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