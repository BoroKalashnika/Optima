import { useState, useContext } from 'react';
import Context from '../../Utils/Context';
import {
    View,
    Text,
    Pressable,
    TextInput,
    Alert,
    BackHandler,
    StyleSheet,
    Image,
    ScrollView
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { HelperText } from 'react-native-paper';
import Carga from '../../Components/carga/Carga';
import postData from '../../Utils/services/postData';
import config from '../../config/config';

const RestablecerContra = (props) => {
    const { loading, setLoading } = useContext(Context);
    const { email, setEmail } = useContext(Context);
    const { codigo, setCodigo } = useContext(Context);
    const [repetirContra, setRepetirContra] = useState('');
    const [contra, setContra] = useState('');

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

    const contrasenyaHasErrors = () => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return contra != '' && !regex.test(contra)
    }

    const handleOnPress = async () => {
        if (repetirContra === '' && contra === '') {
            Alert.alert("ERROR", 'Campos vacios porfavor completalos')
        } else if (contra !== repetirContra) {
            Alert.alert("ERROR", 'Contraseña no coincide')
        } else if (contrasenyaHasErrors()) {
            Alert.alert("ERROR", 'Contraseña invalida')
        } else {
            const json = {
                nombre: "",
                contrasenya: contra,
                correo: email,
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
                verificado: false,
                codigo: codigo
            };

            const response = await postData(config.API_OPTIMA + 'cambiarContrasenya', json, setLoading);

            if (response.status === 200) {
                Alert.alert("PASSWORD CHANGED", response.data.message);
                setCodigo('');
                setEmail('');
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
                <Text style={styles.title}>Reset Password</Text>
                <View style={styles.inputContainer}>
                    <Text style={styles.text}>Enter a new Password</Text>
                    {(contra != '' && contrasenyaHasErrors()) && (
                        <HelperText type="error">
                            Password with at least one uppercase letter, one lowercase letter and one number
                        </HelperText>
                    )}
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Password"
                        placeholderTextColor="#9CA3AF"
                        value={contra}
                        onChangeText={(newContra) => setContra(newContra)}
                        secureTextEntry
                    />
                    <Text style={styles.text}>Repeat the new password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Repeat the new password"
                        placeholderTextColor="#9CA3AF"
                        value={repetirContra}
                        onChangeText={(newRepetirContra) => setRepetirContra(newRepetirContra)}
                        secureTextEntry
                    />
                </View>

                <View style={styles.subContainer}>
                    <Pressable style={styles.bottom} onPress={() => handleOnPress()}>
                        <Text style={styles.text}>Restore</Text>
                    </Pressable>
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
        paddingTop: 30
    },
    subContainer: {
        alignItems: 'center',
        flex: 1,
        marginTop: 20
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
    },
    inputContainer: {
        flexDirection: 'column',
        gap: 16,

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
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 24,
        color: 'white',
        fontStyle: 'italic',
        padding: 10,
        textAlign: "center"
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

export default RestablecerContra;