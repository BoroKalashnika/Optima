import { useState, useContext, useEffect, useCallback } from 'react';
import { View, Text, TextInput, Image, ScrollView, StyleSheet, BackHandler, Alert, Pressable } from 'react-native';
import { Button } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';
import postData from '../../Utils/services/postData';
import getData from '../../Utils/services/getData';
import Icon from 'react-native-vector-icons/Ionicons';
import Context from '../../Utils/Context';
import Carga from '../../Components/carga/Carga';
import CardEjercicio from '../../Components/cardEjercicio/CardEjercicio';
import RNFS from 'react-native-fs';
import config from '../../config/config';

const CrearRutina = (props) => {
    const [nomRutina, setNomRutina] = useState('');
    const [dificultad, setDificultad] = useState('Principiante');
    const [musculo, setMusculo] = useState('Biceps');
    const [ambito, setAmbito] = useState('Gimnasio');
    const [dieta, setDieta] = useState('');
    const [vistaPrevia, setVistaPrevia] = useState(null);
    const [ejerciciosRutina, setEjerciciosRutina] = useState([]);
    const [draft, setDraft] = useState('');
    const { modalVisible, setModalVisible } = useContext(Context);
    const { alertMessage, setAlertMessage } = useContext(Context);
    const { alertTitle, setAlertTitle } = useContext(Context);
    const { token } = useContext(Context);
    const { email } = useContext(Context);
    const { idRutina, setIdRutina } = useContext(Context);
    const { loading, setLoading } = useContext(Context);
    const { idEjercicios, setIdEjercicios } = useContext(Context);

    useFocusEffect(
        useCallback(() => {
            const backAction = () => {
                return true; // Evita la acción predeterminada de retroceso
            };

            const backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                backAction
            );

            getEjercicios();

            return () => backHandler.remove();
        }, [])
    );

    useEffect(() => {
        crearRutinaId();
        !idRutina && getIdRutina();
        idRutina && getEjercicios();
    }, []);

    const getIdRutina = async () => {
        const usuario = await getData(config.API_OPTIMA + 'tokenUsuario?token=' + token);
        const rutinas = await getData(config.API_OPTIMA + 'obtenerRutinasCreadas?token=' + token + '&idUsuario=' + usuario.id);

        rutinas.rutinas.forEach(element => {
            if (element.nombreRutina == "$$crea$$") {
                setIdRutina(element.id);
                return element.id;
            }
        });
    }

    const getEjercicios = async () => {
        const usuario = await getData(config.API_OPTIMA + 'tokenUsuario?token=' + token);
        const rutinas = await getData(config.API_OPTIMA + 'obtenerRutinasCreadas?token=' + token + '&idUsuario=' + usuario.id);
        let rutinaId;

        rutinas.rutinas.forEach(element => {
            if (element.nombreRutina == "$$crea$$") {
                rutinaId = element.id;
            }
        });

        const response = await getData(config.API_OPTIMA + 'obtenerEjercicios?token=' + token + '&idRutina=' + rutinaId);

        if (response.count != 0) {
            const newArray = [];
            response.ejercicios.map((element) => {
                newArray.push(element);
            })
            setEjerciciosRutina(newArray);
            setIdEjercicios(response.ejercicios.map(element => element.id));
            setDraft(' (Borrador)');
        } else {
            setDraft('');
        }
    }

    const crearRutinaId = async () => {
        setLoading(true);
        const usuario = await getData(config.API_OPTIMA + 'tokenUsuario?token=' + token);
        const rutinas = await getData(config.API_OPTIMA + 'obtenerRutinasCreadas?token=' + token + '&idUsuario=' + usuario.id);
        let existe = false;

        rutinas.rutinas.forEach(element => {
            if (element.nombreRutina == "$$crea$$") {
                existe = true;
            }
        });

        if (!existe) {
            const date = new Date();
            const opciones = { day: "2-digit", year: "numeric", month: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" };
            const fechaFormateada = date.toLocaleString("es-ES", opciones);

            const json = {
                nombreRutina: "$$crea$$",
                creador: email,
                token: token,
                idUsuario: usuario.id,
                timestamp: fechaFormateada,
            };

            const response = await postData(config.API_OPTIMA + 'crearRutina', json, setLoading);

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
        setLoading(true);
        const json = {
            nombreRutina: nomRutina,
            valoracion: '0',
            dificultad: dificultad,
            grupoMuscular: musculo,
            ambito: ambito,
            ejercicios: idEjercicios,
            dieta: dieta,
            vistaPrevia: vistaPrevia,
            token: token,
        };

        const response = await postData(
            config.API_OPTIMA + 'crearRutina',
            json, setLoading
        );
        console.log(response);
        console.log(json);
        if (response.status === 201) {
            setAlertMessage('Rutina creada correctamente.');
            setAlertTitle('Éxito');
            setModalVisible(true);
            props.navigation.goBack();
            limpiarCampos();
        } else {
            setAlertMessage(response.data.message);
            setAlertTitle('ERROR');
            setModalVisible(true);
            props.navigation.goBack();
            limpiarCampos();
        }
        setLoading(false);
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
                const format = response.assets[0].type;
                RNFS.readFile(response.assets[0].uri, 'base64')
                    .then(base64String => {
                        setVistaPrevia(`data:${format};base64,${base64String}`);
                    }).catch(err => console.error(err));
            }
        });
    };

    const limpiarCampos = () => {
        setNomRutina('');
        setDificultad('');
        setAmbito('');
        setAmbito('');
        setDieta('');
        setVistaPrevia(null);
        setIdEjercicios([]);
        setEjerciciosRutina([]);
    };

    const cancelarPress = () => {
        setAlertMessage('Creación de rutina cancelada');
        setAlertTitle('Cancelado');
        setModalVisible(true);
        limpiarCampos();
        props.navigation.goBack();
    }

    const validarCampos = () => {
        if (!nomRutina || !ambito || idEjercicios == '' || ejerciciosRutina == [] || !dieta || !vistaPrevia) {
            if (idEjercicios == '' || ejerciciosRutina == []) {
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
            <Text style={styles.title}>Crear Nueva Rutina{draft}</Text>
            <TextInput
                style={styles.input}
                placeholder="Nombre de la rutina"
                placeholderTextColor="#90caf9"
                value={nomRutina}
                onChangeText={(newText) => setNomRutina(newText)}
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
            <TextInput
                style={styles.input}
                placeholder="Dieta"
                placeholderTextColor="#90caf9"
                value={dieta}
                onChangeText={(newText) => setDieta(newText)}
            />
            <Pressable style={styles.containerCrear} onPress={() => props.navigation.navigate('CrearEjercicio')}>
                <Icon name="add-circle-outline" color="#607cff" size={50} style={{ marginHorizontal: "5%" }} />
                <Text style={styles.text}>Crear Ejercicio</Text>
            </Pressable>
            <View style={styles.listContainer}>
                <ScrollView nestedScrollEnabled={true}>
                    {ejerciciosRutina.map((element, index) => (
                        <CardEjercicio
                            key={index}
                            borrarEnabled={true}
                            idEjercicio={element}
                            nombre={element.nombreEjercicio}
                            descripcion={element.explicacion}
                            imagen={element.vistaPrevia} />
                    ))}
                </ScrollView>
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
                <Button mode="contained" style={styles.button} onPress={() => validarCampos()}>
                    Guardar
                </Button>
                <Button mode="contained" style={styles.buttonClear} onPress={() => cancelarPress()}>
                    Cancelar
                </Button>
            </View>
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
    },
    listContainer: {
        width: '90%',
        maxHeight: 140,
        alignSelf: 'center',
        marginBottom: 8,
    },
});

export default CrearRutina;