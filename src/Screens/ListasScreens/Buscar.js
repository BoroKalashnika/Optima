import { FlatList, View, StyleSheet, Text, Pressable, Modal } from 'react-native';
import { Button } from 'react-native-paper';
import { useState, useContext, useCallback } from 'react';
import Card from '../../Components/card/Card';
import HeaderRutina from '../../Components/headerRutina/HeaderRutina';
import Icon from 'react-native-vector-icons/Ionicons';
import getData from '../../Utils/services/getData';
import Context from '../../Utils/Context';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';
import config from '../../config/config';

const Buscar = (props) => {
    const { token, setToken } = useContext(Context);
    const { modalVisible, setModalVisible } = useContext(Context);
    const { alertMessage, setAlertMessage } = useContext(Context);
    const { alertTitle, setAlertTitle } = useContext(Context);
    const [rutinas, setRutinas] = useState([]);
    const [paginasTotal, setPaginasTotal] = useState();
    const [paginActual, setPaginActual] = useState(0);
    const [indiceActual, setIndiceActual] = useState(0);
    const [filtro, setFiltro] = useState(false);
    const [dificultad, setDificultad] = useState('Principiante');
    const [musculo, setMusculo] = useState('Biceps');
    const [ambito, setAmbito] = useState('Gimnasio');
    const { idRutina, setIdRutina } = useContext(Context);

    useFocusEffect(
        useCallback(() => {
            setPaginActual(0);
            setIndiceActual(0);
            getRutinas();
        }, [])
    );

    const getRutinas = async () => {
        try {
            const response = await getData(config.API_OPTIMA + 'obtenerRutinas?token=' + token);
            const totalRutinas = response.count;
            setPaginasTotal(Math.ceil(totalRutinas / 4));
            const newArray = [];
            response.rutinas.map((element) => {
                newArray.push(element);
            })
            setRutinas(newArray);
        } catch (error) {
            setAlertTitle("Error");
            setAlertMessage("No se pudo cargar las rutinas. Por favor, inténtalo de nuevo.");
            setModalVisible(true);
        }
    };

    const handleNext = () => {
        if (paginActual < paginasTotal - 1) {
            setPaginActual(paginActual + 1);
        }
    };

    const handlePrevious = () => {
        if (paginActual > 0) {
            setPaginActual(paginActual - 1);
        }
    };

    const paginatedRutinas = rutinas.slice(paginActual * 4, (paginActual + 1) * 4);

    return (
        <View style={styles.container}>
            <HeaderRutina tipo={'ajustes'} titulo={'Buscar Rutinas'} />
            {/* onPress={()=> props.navigation.navigate('Ajustes')} */}

            {filtro ? (
                <View style={styles.ContainerFiltro}>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={dificultad}
                            onValueChange={(itemValue) => setDificultad(itemValue)}
                            style={styles.picker}>
                            <Picker.Item label="Principiante" value="Principiante" style={styles.pickerItem} />
                            <Picker.Item label="Intermedio" value="Intermedio" style={styles.pickerItem} />
                            <Picker.Item label="Experto" value="Experto" style={styles.pickerItem} />
                        </Picker>
                    </View>

                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={ambito}
                            onValueChange={(itemValue) => setAmbito(itemValue)}
                            style={styles.picker}>
                            <Picker.Item label="Gimnasio" value="Gimnasio" style={styles.pickerItem} />
                            <Picker.Item label="Calistenia" value="Calistenia" style={styles.pickerItem} />
                            <Picker.Item label="Casa" value="Casa" style={styles.pickerItem} />
                        </Picker>
                    </View>

                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={musculo}
                            onValueChange={(itemValue) => setMusculo(itemValue)}
                            style={styles.picker}>
                            <Picker.Item label="Biceps" value="Biceps" style={styles.pickerItem} />
                            <Picker.Item label="Triceps" value="Triceps" style={styles.pickerItem} />
                            <Picker.Item label="Pecho" value="Pecho" style={styles.pickerItem} />
                            <Picker.Item label="Espalda" value="Espalda" style={styles.pickerItem} />
                            <Picker.Item label="Pierna" value="Pierna" style={styles.pickerItem} />
                        </Picker>
                    </View>
                    <Button mode="contained" style={styles.imagePickerButton} onPress={() => { setFiltro(false) }}>
                        Buscar
                    </Button>
                </View>
            ) : (
                <View style={styles.buttonContainer}>
                    <Button mode="contained" style={styles.imagePickerButton} onPress={() => { setFiltro(true) }}>
                        Filtrar
                    </Button>
                </View>
            )}

            <View style={{ flex: 7, marginBottom: 20, width: '85%' }}>
                <Text style={styles.textRutinas}> ───── Rutinas ─────</Text>
                <FlatList
                    data={paginatedRutinas}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <Card
                            dificultad={item.dificultad}
                            ambito={item.ambito}
                            imagen={item.vistaPrevia}
                            musculo={item.grupoMuscular}
                            estrellas={item.valoracion}
                            titulo={item.nombreRutina}
                            onRutina={() => {
                                props.navigation.navigate('VerRutina');
                                setIdRutina(item.id);
                            }}
                        />
                    )}
                />
            </View>
            <View style={styles.subContainer}>
                {paginActual > 0 && (
                    <Pressable
                        style={[styles.bottom, { marginRight: 5 }]}
                        onPress={() => handlePrevious()}>
                        <Text style={styles.resetPasswordText}>Atras</Text>
                    </Pressable>
                )}
                {paginActual < paginasTotal - 1 && (
                    <Pressable
                        style={[styles.bottom, { marginLeft: 5 }]}
                        onPress={() => handleNext()}>
                        <Text style={styles.resetPasswordText}>Siguiente</Text>
                    </Pressable>
                )}
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>{alertTitle}</Text>
                        <Text style={styles.modalMessage}>{alertMessage}</Text>
                        <Button mode="contained" onPress={() => setModalVisible(false)} style={styles.modalButton}>
                            Cerrar
                        </Button>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1F2937', // bg-gray-950
        alignItems: "center"
    },
    containerRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 30,
        width: '100%',
    },
    subContainer: {
        flexDirection: 'row',
        marginTop: 5,
        marginBottom: 10,
        padding: 5
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        color: "white",
        marginTop: 10,
    },
    containerCrear: {
        width: '90%',
        flexDirection: 'row',
        borderColor: '#607cff',
        borderRadius: 30,
        borderWidth: 2,
        marginBottom: 20,
        alignItems: "center",
    },

    picker: {
        color: '#bbdefb',
    },
    pickerItem: {
        color: '#607cff',
        fontSize: 16,
    },
    image: {
        width: 100,
        height: 100,
    },
    title: {
        fontSize: 30,
        textAlign: 'center',
        color: 'white',
    },
    textRutinas: {
        fontSize: 25,
        width: "100%",
        color: 'white',
        padding: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        textAlign: "center"
    },
    text: {
        fontSize: 30,
        color: 'white',
        textAlign: 'center'
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
    modalButton: {
        backgroundColor: '#607cff',
    },
    bottom: {
        backgroundColor: '#607cff',
        justifyContent: 'center',
        borderWidth: 2,
        borderRadius: 10,
        borderColor: 'black',
        height: 55,
        width: 'auto',
        alignItems: 'center',
        marginTop: 5,
        flexDirection: 'row',
        flex: 1
    },
    ContainerFiltro: {
        width: '90%', // Ocupa el 90% del ancho
        marginTop: 15,
        marginBottom: 10,
        padding: 5,
        justifyContent: 'center', // Centra los elementos verticalmente
        alignItems: 'center', // Centra los elementos horizontalmente
    },

    pickerContainer: {
        width: '100%', // Ocupa el 100% del ancho del contenedor padre (90% del total)
        marginBottom: 10,
        backgroundColor: '#374151',
        color: '#F9FAFB',
        borderRadius: 8,
        borderColor: '#607cff',
        borderWidth: 1,
    },

    imagePickerButton: {
        width: '100%', // Ocupa el 100% del ancho del contenedor padre (90% del total)
        backgroundColor: '#607cff',
        justifyContent: 'center',
        borderWidth: 2,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
});

export default Buscar;