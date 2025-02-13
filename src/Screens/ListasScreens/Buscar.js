import { FlatList, View, StyleSheet, Text, Modal } from 'react-native';
import { Button } from 'react-native-paper';
import { useState, useContext, useCallback } from 'react';
import Card from '../../Components/card/Card';
import HeaderRutina from '../../Components/headerRutina/HeaderRutina';
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
    const { idRutina, setIdRutina } = useContext(Context);
    const [filtro, setFiltro] = useState(false);
    const [dificultad, setDificultad] = useState('Principiante');
    const [musculo, setMusculo] = useState('Biceps');
    const [ambito, setAmbito] = useState('Gimnasio');
    const [rutinas, setRutinas] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [index, setIndex] = useState(0);

    useFocusEffect(
        useCallback(() => {
            setIndex(0);
            setRutinas([]);
            setHasMore(true);
            getRutinas(0);
        }, [])
    );

    const getRutinas = async (currentIndex) => {
        if (loading || !hasMore) return;
        setLoading(true);

        try {
            const response = await getData(config.API_OPTIMA + `obtenerRutinas?token=${token}&index=${currentIndex}&offset=5`);
            const newRutinas = response.rutinas;

            if (newRutinas.length > 0) {
                setRutinas((prevRutinas) => [...prevRutinas, ...newRutinas]);
                setIndex(currentIndex + 4);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            /*
            setAlertTitle("Error");
            setAlertMessage("No se pudo cargar las rutinas. Por favor, inténtalo de nuevo.");
            setModalVisible(true);
            */
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <HeaderRutina tipo={'ajustes'} titulo={'Buscar Rutinas'} />

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
                    data={rutinas}
                    keyExtractor={(item) => item.id.toString()}
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
                    onEndReached={() => getRutinas(index)}
                    onEndReachedThreshold={0.01}
                    ListFooterComponent={loading && <Text style={styles.loadingText}>Cargando más rutinas...</Text>}
                />
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
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
};

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
    loadingText: {
        textAlign: 'center',
        color: 'white',
        marginVertical: 10
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
        width: '90%',
        marginTop: 15,
        marginBottom: 10,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },

    pickerContainer: {
        width: '100%',
        marginBottom: 10,
        backgroundColor: '#374151',
        color: '#F9FAFB',
        borderRadius: 8,
        borderColor: '#607cff',
        borderWidth: 1,
    },

    imagePickerButton: {
        width: '100%',
        backgroundColor: '#607cff',
        justifyContent: 'center',
        borderWidth: 2,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
});

export default Buscar;