import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Modal, Button, ScrollView } from 'react-native';
import { HelperText } from 'react-native-paper';

const CalcularIMC = (props) => {
    const [peso, setPeso] = useState('');
    const [altura, setAltura] = useState('');
    const [imc, setImc] = useState(null);
    const [mensaje, setMensaje] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [historial, setHistorial] = useState([]);

    const alturaHasErrors = () => {
        const regex = /^([0-2](\.\d{1,2})?)$/;
        return altura != '' && !regex.test(altura)
    }
    const pesoHasErrors = () => {
        const regex = /^([3-9][0-9]|1[0-9]{2}|200)(\.\d{1,2})?\s?$/;
        return peso != '' && !regex.test(peso)
    }

    const calcularIMC = () => {
        const pesoNum = parseFloat(peso);
        const alturaNum = parseFloat(altura);

        if (!pesoNum || !alturaNum || alturaNum <= 0 || pesoNum <= 0) {
            setMensaje('Por favor, ingrese valores válidos.');
            setModalVisible(true);
            return;
        }else if (alturaHasErrors()&&pesoHasErrors()){
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

        setMensaje(mensajeResultado);
        setModalVisible(true);

        // Guardar en el historial
        const nuevoHistorial = [
            ...historial,
            { peso: pesoNum, altura: alturaNum, imc: resultadoIMC.toFixed(2), mensaje: mensajeResultado }
        ];
        setHistorial(nuevoHistorial);
    };

    const limpiarCampos = () => {
        setPeso('');
        setAltura('');
        setImc(null);
        setMensaje('');
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

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Resultado</Text>
                        <Text style={styles.modalMessage}>{mensaje}</Text>
                        <Button title="Cerrar" onPress={() => setModalVisible(false)} color="#607cff" />
                    </View>
                </View>
            </Modal>

            <View style={styles.historialContainer}>
                <Text style={styles.historialTitle}>Historial</Text>
                <ScrollView style={styles.historial}>
                    {historial.map((item, index) => (
                        <View key={index} style={styles.historialItem}>
                            <Text style={styles.historialText}>
                                {`Peso: ${item.peso} kg | Altura: ${item.altura} m | IMC: ${item.imc} - ${item.mensaje}`}
                            </Text>
                        </View>
                    ))}
                </ScrollView>
            </View>
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
        textAlign: 'center',
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