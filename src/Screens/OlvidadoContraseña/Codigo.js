import {useContext } from 'react';
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
import getData from "../../Utils/services/getData";
const Codigo = (props) => {
    const { codigo, setCodigo } = useContext(Context);

    const handleOnPress = () => {
        if (codigo === '') {
            Alert.alert("ERROR", 'Codigo vacio')
        } else {
            getData('http://13.216.205.228:8080/optima/codigo?codigo=' + codigo).then((response) => {
                console.log(response);
                if (response.message === "") {
                    props.navigation.navigate('RestablecerContra');
                } else {
                    Alert.alert("CODIGO NO VALIDO", response.message)
                }
            })
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.subContainer}>
                <Image source={require('../../Assets/img/logo.png')} style={styles.image} />
            </View>
            <View style={styles.formContainer}>
                <Text style={styles.text}>Hemos enviado un código de verificación a tu correo, por favor ves a tu correo e introduce el código</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Introduce el codigo de verificacion"
                        placeholderTextColor="#9CA3AF"
                        value={codigo}
                        onChangeText={(newCodigo) => setCodigo(newCodigo)}
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

export default Codigo;