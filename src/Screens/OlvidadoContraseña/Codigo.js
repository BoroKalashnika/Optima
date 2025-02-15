import { useContext, useState } from 'react';
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
import getData from "../../Utils/services/getData";
import config from '../../config/config';
import { ScrollView } from 'react-native-gesture-handler';

const Codigo = (props) => {
    const [codigoEscrito, setCodigoEscrito] = useState('');
    const { setCodigo } = useContext(Context);

    const handleOnPress = () => {
        if (codigoEscrito === '') {
            Alert.alert("ERROR", 'Empty code')
        } else {
            getData(config.API_OPTIMA + 'codigo?codigo=' + codigoEscrito).then((response) => {
                if (response.message === "") {
                    setCodigo(codigoEscrito);
                    props.navigation.navigate('RestablecerContra');
                } else {
                    Alert.alert("INVALID CODE", response.message)
                }
            })
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView>
            <View style={styles.subContainer}>
                <Image source={require('../../Assets/img/logo.png')} style={styles.image} />
            </View>
            <View style={styles.formContainer}>
                <Text style={styles.text}>We have sent a verification code to your email, please go to your email and enter the code</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter the verification code"
                        placeholderTextColor="#9CA3AF"
                        value={codigoEscrito}
                        onChangeText={(newCodigo) => setCodigoEscrito(newCodigo)}
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

export default Codigo;