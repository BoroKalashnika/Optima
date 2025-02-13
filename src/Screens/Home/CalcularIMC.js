import { useState, useContext, useCallback, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, ScrollView } from 'react-native';
import { HelperText } from 'react-native-paper';
import MensajeAlert from '../../Components/mensajeAlert/MensajeAlert';
import Context from '../../Utils/Context';
import { useFocusEffect } from '@react-navigation/native';
import config from '../../config/config';
import getData from '../../Utils/services/getData';
import postData from '../../Utils/services/postData';
import deleteData from '../../Utils/services/deleteData';
import Carga from '../../Components/carga/Carga'

const CalcularIMC = (props) => {
    const [peso, setPeso] = useState('');
    const [altura, setAltura] = useState('');
    const [imc, setImc] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [titulo, setTitulo] = useState('');
    const [historial, setHistorial] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const { token } = useContext(Context);
    const { loading, setLoading } = useContext(Context);

    useFocusEffect(
        useCallback(() => {
            getHistorial();
        }, [])
    );

    useEffect(() => {
        getHistorial();
    }, [historial]);

    const getHistorial = async () => {
        const usuario = await getData(config.API_OPTIMA + 'tokenUsuario?token=' + token);
        setHistorial(usuario.historialImc);
    }

    const alturaHasErrors = () => {
        const regex = /^(0\.[5-9]\d?|[1-2]\.\d{1,2})$/;
        return altura != '' && !regex.test(altura)
    }
    const pesoHasErrors = () => {
        const regex = /^([3-9][0-9]|1[0-9]{2}|200)(\.\d{1,2})?\s?$/;
        return peso != '' && !regex.test(peso)
    }

    const cerrarModal = () => {
        setModalVisible(false);
    };

    const calcularIMC = async () => {
        const pesoNum = parseFloat(peso);
        const alturaNum = parseFloat(altura);

        if (!pesoNum || !alturaNum || alturaNum <= 0 || pesoNum <= 0) {
            setTitulo('Error')
            setMensaje('Por favor, ingrese valores válidos.');
            setModalVisible(true);
            return;
        } else if (alturaHasErrors() || pesoHasErrors()) {
            setTitulo('Error')
            setMensaje('Por favor, ingrese valores válidos.');
            setModalVisible(true);
            return;
        }


        const resultadoIMC = pesoNum / (alturaNum * alturaNum);
        setImc(resultadoIMC.toFixed(2));

        let mensajeResultado = '';
        if (resultadoIMC < 18.5) {
            mensajeResultado = 'Bajo peso';
        } else if (resultadoIMC >= 18.5 && resultadoIMC < 24.9) {
            mensajeResultado = 'Peso normal';
        } else if (resultadoIMC >= 25 && resultadoIMC < 29.9) {
            mensajeResultado = 'Sobrepeso';
        } else {
            mensajeResultado = 'Obesidad';
        }
        setTitulo('Resultado')
        setMensaje(mensajeResultado);
        setModalVisible(true);

        const mensaje = `Peso: ${pesoNum} kg | Altura: ${alturaNum} m | IMC: ${resultadoIMC.toFixed(2)} - ${mensajeResultado}`

        const json = {
            token: token,
            imc: resultadoIMC.toFixed(2),
            mensaje: mensaje,
        }

        try {
            const response = await postData(config.API_OPTIMA + 'registrarImc', json, setLoading);
            if (response.status === 200) {
                setTitulo('Calculado');
                setMensaje('Cálculo realizado con exito \n' + response.data.message);
                setModalVisible(true);
                const nuevoHistorial = [
                    ...historial,
                    mensaje
                ];
                setHistorial(nuevoHistorial);
            } else {
                setTitulo('Error');
                setMensaje(response.data.message);
                setModalVisible(true);
            }
        } catch (error) {
            setTitulo('Error');
            setMensaje('Error al registrar el IMC');
            setModalVisible(true);
        }
    };

    if (loading) {
        return (
            <Carga />
        );
    }

    const limpiarCampos = async () => {
        setPeso('');
        setAltura('');
        setImc(null);
        setMensaje('');
        setTitulo('');
        setLoading(true);
        const response = await deleteData(
            config.API_OPTIMA + 'eliminarHistorialImc?token=' + token, setLoading
        );
        if (response.status !== 200) {
            setAlertMessage(response.message);
            setAlertTitle('ERROR');
            setModalVisible(true);
        }
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Calculadora de IMC</Text>
            {(peso != '' && pesoHasErrors()) && (
                <HelperText type="error">
                    Peso en kilogramos
                </HelperText>
            )}
            <TextInput
                style={styles.input}
                placeholder="Peso (kg)"
                placeholderTextColor="#90caf9"
                keyboardType="numeric"
                value={peso}
                onChangeText={(newPeso) => setPeso(newPeso)}
            />
            {(altura != '' && alturaHasErrors()) && (
                <HelperText type="error">
                    Altura en metros
                </HelperText>
            )}
            <TextInput
                style={styles.input}
                placeholder="Altura (m)"
                placeholderTextColor="#90caf9"
                keyboardType="numeric"
                value={altura}
                onChangeText={(newAltura) => setAltura(newAltura)}
            />

            <View style={styles.buttonContainer}>
                <Button title="Calcular IMC" onPress={() => calcularIMC()} color="#607cff" />
                <Button title="Limpiar" onPress={() => limpiarCampos()} color="#607cff" />
                <Button title="Volver" onPress={() => props.navigation.goBack()} color="#607cff" />
            </View>

            {imc && (
                <Text style={styles.resultado}>
                    IMC: {imc} - {mensaje}
                </Text>
            )}

            <View style={styles.historialContainer}>
                <Text style={styles.historialTitle}>Historial</Text>
                <ScrollView style={styles.historial}>
                    {historial && historial.slice().reverse().map((item, index) => (
                        <View key={index} style={styles.historialItem}>
                            <Text style={styles.historialText}>
                                {item}
                            </Text>
                        </View>
                    ))}
                </ScrollView>
            </View>
            <MensajeAlert visible={modalVisible} mensaje={mensaje} titulo={titulo} cerrarModal={cerrarModal} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#1F2937',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#bbdefb',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        width: '90%',
        height: 50,
        backgroundColor: '#374151',
        color: '#bbdefb',
        paddingLeft: 10,
        marginBottom: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#607cff',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        marginTop: 20,
    },
    resultado: {
        fontSize: 20,
        color: '#bbdefb',
        marginTop: 15,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    historialContainer: {
        marginTop: 30,
        width: '100%',
    },
    historialTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#bbdefb',
        textAlign: 'center',
        marginBottom: 10,
    },
    historial: {
        maxHeight: 300,
        width: '100%',
    },
    historialItem: {
        backgroundColor: '#374151',
        marginBottom: 10,
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#607cff',

    },
    historialText: {
        color: '#bbdefb',
        fontSize: 14,
    },
});

export default CalcularIMC;