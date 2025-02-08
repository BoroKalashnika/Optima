import { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, Image, ScrollView, StyleSheet, Modal, Alert, Pressable } from 'react-native';
import { Button } from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';
import postData from '../../Utils/services/postData';
import getData from '../../Utils/services/getData';
import Icon from 'react-native-vector-icons/Ionicons';
import Context from '../../Utils/Context';
import Carga from '../../Components/carga/Carga';

const CrearRutina = (props) => {
    const [nomRutina, setNomRutina] = useState('');
    const [dificultad, setDificultad] = useState('Principiante');
    const [tipo, setTipo] = useState('Gimnasio');
    const [ambito, setAmbito] = useState('');
    const [dieta, setDieta] = useState('');
    const [vistaPrevia, setVistaPrevia] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');
    const { token } = useContext(Context);
    const { email, setEmail } = useContext(Context);
    const { setIdRutina } = useContext(Context);
    const { loading, setLoading } = useContext(Context);
    const { idEjercicios, setIdEjercicios } = useContext(Context);

    useEffect(() => {
        crearRutinaId();
    }, []);

    const crearRutinaId = async () => {
        setLoading(true);

        const usuario = await getData('http://13.216.205.228:8080/optima/tokenUsuario?token=' + token);

        setEmail(usuario.correo);

        const rutinas = await getData('http://13.216.205.228:8080/optima/obtenerRutinasCreadas?token=' + token + '&idUsuario=' + usuario.id);
        let existe = false;
        //añadir validacion en el back por si a caso
        rutinas.rutinas.forEach(element => {
            if (element.nombreRutina == '$¿¡crea!?') {
                existe = true;
            }
        });

        if (!existe) {
            const json = {
                nombreRutina: "$¿¡crea!?",
                creador: usuario.correo,
                token: token,
                idUsuario: usuario.id
            };

            const response = await postData('http://13.216.205.228:8080/optima/crearRutina', json, setLoading);

            setIdRutina(response.data.idRutina);
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <Carga />
        );
    }

    const registrarRutina = async () => {
        const json = {
            nombreRutina: nomRutina,
            valoracion: '0',
            dificultad: dificultad,
            tipo: tipo,
            ambito: ambito,
            ejercicios: idEjercicios,
            dieta: dieta,
            vistaPrevia: vistaPrevia,
            token: token,
        };
        console.log(json);

        const response = await postData(
            'http://13.216.205.228:8080/optima/crearRutina',
            json, setLoading
        );

        if (response.status === 201) {
            setAlertMessage('Rutina creada correctamente.');
            setAlertTitle('Éxito');
            setModalVisible(true);
            props.navigation.navigate('RutinasCreadas');
        } else {
            setAlertMessage(response.data.message);
            setAlertTitle('ERROR');
            setModalVisible(true);
        }
        setIdEjercicios([]);
    };

    const pickImage = () => {
        const options = {
            mediaType: 'photo',
            includeBase64: false,
            maxWidth: 800,
            maxHeight: 600,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                Alert.alert('Cancelado', 'Seleccionaste cancelar la imagen');
            } else if (response.errorCode) {
                Alert.alert('Error', 'Ocurrió un error al seleccionar la imagen');
            } else {
                setVistaPrevia(response.assets[0].uri);
            }
        });
    };

    const limpiarCampos = () => {
        setNomRutina('');
        setDificultad('Principiante');
        setTipo('Gimnasio');
        setAmbito('');
        setDieta('');
        setVistaPrevia(null);
        setIdEjercicios([]);
    };

    const validarCampos = () => {
        if (!nomRutina || !ambito || idEjercicios == [] || !dieta || !vistaPrevia) {
            if (idEjercicios == []) {
                setAlertMessage('No ha insertado ningún ejercicio.');
                setAlertTitle('Error');
                setModalVisible(true);
                return;
            }
            setAlertMessage('Todos los campos deben estar completos antes de guardar.');
            setAlertTitle('Error');
            setModalVisible(true);
            return;
        }
        registrarRutina();

    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Crear Nueva Rutina</Text>
            <TextInput
                style={styles.input}
                placeholder="Nombre de la rutina"
                placeholderTextColor="#90caf9"
                value={nomRutina}
                onChangeText={setNomRutina}
            />
            <TextInput
                style={styles.input}
                placeholder="Ámbito"
                placeholderTextColor="#90caf9"
                value={ambito}
                onChangeText={setAmbito}
            />
            <Pressable style={styles.containerCrear} onPress={() => props.navigation.navigate('CrearEjercicio')}>
                <Icon name="add-circle-outline" color="#607cff" size={50} style={{ marginHorizontal: "5%" }} />
                <Text style={styles.text}>Crear Ejercicio</Text>
            </Pressable>

            <TextInput
                style={styles.input}
                placeholder="Dieta"
                placeholderTextColor="#90caf9"
                value={dieta}
                onChangeText={setDieta}
            />
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
                    selectedValue={tipo}
                    onValueChange={(itemValue) => setTipo(itemValue)}
                    style={styles.picker}>
                    <Picker.Item label="Gimnasio" value="Gimnasio" style={styles.pickerItem} />
                    <Picker.Item label="Calistenia" value="Calistenia" style={styles.pickerItem} />
                    <Picker.Item label="Casa" value="Casa" style={styles.pickerItem} />
                </Picker>
            </View>
            <View style={styles.buttonContainer}>
                <Button mode="contained" style={styles.imagePickerButton} onPress={pickImage}>
                    Seleccionar Imagen
                </Button>
            </View>
            {vistaPrevia && (
                <Image source={{ uri: vistaPrevia }} style={styles.image} />
            )}
            <View style={styles.buttonContainer}>
                <Button mode="contained" style={styles.button} onPress={validarCampos}>
                    Guardar
                </Button>
                <Button mode="contained" style={styles.buttonClear} onPress={limpiarCampos}>
                    Limpiar
                </Button>
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
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#1F2937',
        alignItems: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#bbdefb',
        marginBottom: 20,
        textAlign: 'center',
        marginTop: 40,
    },
    input: {
        borderRadius: 10,
        marginBottom: 10,
        width: '90%',
        backgroundColor: '#374151',
        color: '#bbdefb',
        padding: 12,
        borderColor: '#607cff',
        borderWidth: 1,
    },
    pickerContainer: {
        marginBottom: 10,
        width: '90%',
        backgroundColor: '#374151',
        color: '#F9FAFB',
        borderRadius: 8,
        borderColor: '#607cff',
        borderWidth: 1,
    },
    picker: {
        color: '#bbdefb',
    },
    pickerItem: {
        color: '#607cff',
        fontSize: 16,
    },
    imagePickerButton: {
        flex: 1,
        marginRight: 10,
        backgroundColor: '#607cff',
        justifyContent: 'center',
        borderWidth: 2,
        borderRadius: 10,
        height: 50,
        width: '90%',
        alignItems: 'center',
        marginBottom: 10,
    },
    image: {
        width: '90%',
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
    },
    button: {
        flex: 1,
        marginRight: 10,
        backgroundColor: '#607cff',
        justifyContent: 'center',
        borderWidth: 2,
        borderRadius: 10,
        height: 55,
        width: 160,
        alignItems: 'center',
    },
    buttonClear: {
        flex: 1,
        marginRight: 10,
        backgroundColor: '#607cff',
        justifyContent: 'center',
        borderWidth: 2,
        borderRadius: 10,
        height: 55,
        width: 160,
        alignItems: 'center',
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
    containerCrear: {
        width: '90%',
        flexDirection: 'row',
        borderColor: '#607cff',
        borderRadius: 30,
        borderWidth: 2,
        marginBottom: 10,
        alignItems: "center",
    },
    text: {
        fontSize: 30,
        color: 'white',
    }
});

export default CrearRutina;