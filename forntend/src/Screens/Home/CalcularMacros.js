import { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Dimensions } from 'react-native';
import { HelperText } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { PieChart } from 'react-native-chart-kit';
import MensajeAlert from '../../Components/mensajeAlert/MensajeAlert';
import Context from '../../Utils/Context';
import config from '../../config/config';
import postData from '../../Utils/services/postData';
import Carga from '../../Components/carga/Carga'
import { ScrollView } from 'react-native-gesture-handler';

const CalcularMacros = (props) => {
    const [peso, setPeso] = useState('');
    const [edad, setEdad] = useState('');
    const [altura, setAltura] = useState('');
    const [sexo, setSexo] = useState('masculino');
    const [actividad, setActividad] = useState('pocoActivo');
    const [macros, setMacros] = useState(null);
    const [mensaje, setMensaje] = useState('');
    const [titulo, setTitulo] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const { token } = useContext(Context);
    const { loading, setLoading } = useContext(Context);

    const screenWidth = Dimensions.get('window').width;

    const alturaHasErrors = () => {
        const regex = /^(1[0-9]{2}|2[0-4][0-9]|250)\s?$/;
        return altura != '' && !regex.test(altura)
    }

    const pesoHasErrors = () => {
        const regex = /^([3-9][0-9]|1[0-9]{2}|200)(\.\d{1,2})?\s?$/;
        return peso != '' && !regex.test(peso)
    }

    const edadHasErrors = () => {
        const regex = /^([1-9]|[1-8][0-9]|90)$/;
        return edad != '' && !regex.test(edad)
    }

    const cerrarModal = () => {
        setModalVisible(false);
    };

    const calcularMacros = async () => {
        const pesoNum = parseFloat(peso);
        const edadNum = parseInt(edad);
        const alturaNum = parseFloat(altura);

        if (!pesoNum || !edadNum || !alturaNum || pesoNum <= 0 || edadNum <= 0 || alturaNum <= 0) {
            setTitulo('Error');
            setMensaje('Please enter valid values.');
            setModalVisible(true);
            return;
        } else if (alturaHasErrors() || pesoHasErrors() || edadHasErrors()) {
            setTitulo('Error');
            setMensaje('Invalid values.');
            setModalVisible(true);
            return;
        }

        let tmb;

        if (sexo === 'masculino') {
            tmb = 66.5 + (13.75 * pesoNum) + (5.003 * alturaNum) - (6.755 * edadNum);
        } else {
            tmb = 655.1 + (9.563 * pesoNum) + (1.850 * alturaNum) - (4.676 * edadNum);
        }

        let factorActividad;
        if (actividad === 'pocoActivo') factorActividad = 1.2;
        if (actividad === 'medioActivo') factorActividad = 1.55;
        if (actividad === 'muyActivo') factorActividad = 1.9;

        const caloriasTotales = tmb * factorActividad;

        const carbos = (caloriasTotales * 0.4) / 4;
        const proteinas = (caloriasTotales * 0.3) / 4;
        const grasas = (caloriasTotales * 0.3) / 9;

        setMacros({
            caloriasTotales: caloriasTotales.toFixed(0),
            carbos: carbos.toFixed(0),
            proteinas: proteinas.toFixed(0),
            grasas: grasas.toFixed(0)
        });

        const json = {
            token: token,
            macros: `${caloriasTotales.toFixed(0)}|${carbos.toFixed(0)}|${proteinas.toFixed(0)}|${grasas.toFixed(0)}`,
        }

        const response = await postData(config.API_OPTIMA + 'registrarMacros', json, setLoading);

        if (response.status === 200) {
            setTitulo('Success');
            setMensaje(response.data.message);
            setModalVisible(true);
        } else {
            setTitulo('Error');
            setMensaje(response.data.message);
            setModalVisible(true);
        }
    };

    if (loading) {
        return (
            <Carga />
        );
    }

    const limpiarCampos = () => {
        setPeso('');
        setEdad('');
        setAltura('');
        setSexo('masculino');
        setActividad('pocoActivo');
        setMacros(null);
        setMensaje('');
        setTitulo('');
    };

    return (
        <ScrollView style={styles.container}>
            <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                <Text style={styles.title}>Macro Calculator</Text>
                {(peso != '' && pesoHasErrors()) && (
                    <HelperText type="error">
                        Weight in kilograms
                    </HelperText>
                )}
                <TextInput
                    style={styles.input}
                    placeholder="Weight (kg)"
                    placeholderTextColor="#90caf9"
                    keyboardType="numeric"
                    value={peso}
                    onChangeText={setPeso}
                />
                {(edad != '' && edadHasErrors()) && (
                    <HelperText type="error">
                        Age from 1-90 years
                    </HelperText>
                )}
                <TextInput
                    style={styles.input}
                    placeholder="Age (years)"
                    placeholderTextColor="#90caf9"
                    keyboardType="numeric"
                    value={edad}
                    onChangeText={setEdad}
                />
                {(altura != '' && alturaHasErrors()) && (
                    <HelperText type="error">
                        Height in centimeters
                    </HelperText>
                )}
                <TextInput
                    style={styles.input}
                    placeholder="Height (cm)"
                    placeholderTextColor="#90caf9"
                    keyboardType="numeric"
                    value={altura}
                    onChangeText={setAltura}
                />

                <View style={styles.pickerContainer}>
                    <Text style={styles.label}>Gender</Text>
                    <Picker
                        selectedValue={sexo}
                        style={styles.picker}
                        onValueChange={(itemValue) => setSexo(itemValue)}
                    >
                        <Picker.Item label="Male" value="masculino" />
                        <Picker.Item label="Female" value="femenino" />
                    </Picker>
                </View>

                <View style={styles.pickerContainer}>
                    <Text style={styles.label}>Activity Level</Text>
                    <Picker
                        selectedValue={actividad}
                        style={styles.picker}
                        onValueChange={(itemValue) => setActividad(itemValue)}
                    >
                        <Picker.Item label="Not Active" value="pocoActivo" />
                        <Picker.Item label="Active" value="medioActivo" />
                        <Picker.Item label="Very Active" value="muyActivo" />
                    </Picker>
                </View>

                <View style={styles.buttonContainer}>
                    <Button title="Calculate" onPress={calcularMacros} color="#607cff" />
                    <Button title="Clean" onPress={limpiarCampos} color="#607cff" />
                    <Button title="Return" onPress={() => { props.navigation.goBack() }} color="#607cff" />
                </View>

                {macros && (
                    <View style={styles.resultContainer}>
                        <Text style={styles.result}>Total Calories: {macros.caloriasTotales} kcal</Text>
                        <Text style={styles.result}>Carbohydrates: {macros.carbos} g</Text>
                        <Text style={styles.result}>Proteins: {macros.proteinas} g</Text>
                        <Text style={styles.result}>Fats: {macros.grasas} g</Text>

                        <PieChart
                            data={[
                                {
                                    name: 'Carbs',
                                    population: parseFloat(macros.carbos),
                                    color: '#FF6347',
                                    legendFontColor: '#7F7F7F',
                                    legendFontSize: 15
                                },
                                {
                                    name: 'Proteins',
                                    population: parseFloat(macros.proteinas),
                                    color: '#4CAF50',
                                    legendFontColor: '#7F7F7F',
                                    legendFontSize: 15
                                },
                                {
                                    name: 'Fats',
                                    population: parseFloat(macros.grasas),
                                    color: '#FFD700',
                                    legendFontColor: '#7F7F7F',
                                    legendFontSize: 15
                                }
                            ]}
                            width={screenWidth - 60}
                            height={100}
                            chartConfig={{
                                backgroundColor: '#ffffff',
                                backgroundGradientFrom: '#ffffff',
                                backgroundGradientTo: '#ffffff',
                                decimalPlaces: 0,
                                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            }}
                            accessor="population"
                            style={{
                                marginVertical: 8,
                                borderRadius: 16,
                            }}
                        />
                    </View>
                )}
                <MensajeAlert visible={modalVisible} mensaje={mensaje} titulo={titulo} cerrarModal={cerrarModal} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    label: {
        fontSize: 16,
        color: '#bbdefb',
        marginBottom: 10,
    },
    pickerContainer: {
        width: '90%',
        marginBottom: 15,
    },
    picker: {
        height: 50,
        backgroundColor: '#374151',
        color: '#bbdefb',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#607cff',
    },
    resultContainer: {
        marginVertical: 20,
        width: '90%',
    },
    result: {
        fontSize: 15,
        color: '#bbdefb',
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        marginTop: 20,
    },
    backButton: {
        marginBottom: 20,
    },
});

export default CalcularMacros;