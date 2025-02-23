import { useState, useContext, useEffect, useCallback } from 'react';
import { View, Text, TextInput, Image, ScrollView, StyleSheet, BackHandler, Alert, Pressable } from 'react-native';
import { Button } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';
import postData from '../../Utils/services/postData';
import deleteData from '../../Utils/services/deleteData';
import getData from '../../Utils/services/getData';
import Icon from 'react-native-vector-icons/Ionicons';
import Context from '../../Utils/Context';
import Carga from '../../Components/carga/Carga';
import CardEjercicio from '../../Components/cardEjercicio/CardEjercicio';
import RNFS from 'react-native-fs';
import config from '../../config/config';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { format } from 'date-fns';

const CrearRutina = (props) => {
    const [nomRutina, setNomRutina] = useState('');
    const [dificultad, setDificultad] = useState('Principiante');
    const [musculo, setMusculo] = useState('Biceps');
    const [ambito, setAmbito] = useState('Gimnasio');
    const [dieta, setDieta] = useState('');
    const [vistaPrevia, setVistaPrevia] = useState(null);
    const [ejerciciosRutina, setEjerciciosRutina] = useState([]);
    const [draft, setDraft] = useState('');
    const { setModalVisible } = useContext(Context);
    const { setAlertMessage } = useContext(Context);
    const { setAlertTitle } = useContext(Context);
    const { token } = useContext(Context);
    const { email } = useContext(Context);
    const { idRutina, setIdRutina } = useContext(Context);
    const { loading, setLoading } = useContext(Context);
    const { idEjercicios, setIdEjercicios } = useContext(Context);

    useFocusEffect(
        useCallback(() => {
            const backAction = () => {
                return true;
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

    useEffect(() => {
        if (idEjercicios && idEjercicios.length > 0) {
            sumarEjercicios();
        }
    }, [idEjercicios]);

    const getIdRutina = async () => {
        const usuario = await getData(config.API_OPTIMA + 'tokenUsuario?token=' + token);
        const rutinas = await getData(config.API_OPTIMA + 'obtenerRutinasCreadas?token=' + token + '&idUsuario=' + usuario.id);

        rutinas.rutinas.forEach(element => {
            if (element.nombreRutina == config.CREA_RUTINA) {
                setIdRutina(element.id);
                return element.id;
            }
        });
    }

    const getEjercicios = useCallback(async () => {
        const usuario = await getData(config.API_OPTIMA + 'tokenUsuario?token=' + token);
        const rutinas = await getData(config.API_OPTIMA + 'obtenerRutinasCreadas?token=' + token + '&idUsuario=' + usuario.id);
        let rutinaId;

        rutinas.rutinas.forEach(element => {
            if (element.nombreRutina == config.CREA_RUTINA) {
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
            setDraft(' (Draft)');
        } else {
            setEjerciciosRutina([]);
            setIdEjercicios([]);
            setDraft('');
        }
    }, [token, setIdEjercicios]);

    const crearRutinaId = async () => {
        setLoading(true);
        const usuario = await getData(config.API_OPTIMA + 'tokenUsuario?token=' + token);
        const rutinas = await getData(config.API_OPTIMA + 'obtenerRutinasCreadas?token=' + token + '&idUsuario=' + usuario.id);
        let existe = false;

        rutinas.rutinas.forEach(element => {
            if (element.nombreRutina == config.CREA_RUTINA) {
                existe = true;
            }
        });

        if (!existe) {
            const date = new Date();
            const fechaFormateada = format(date, "dd/MM/yyyy, HH:mm:ss");

            const json = {
                nombreRutina: config.CREA_RUTINA,
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

    const sumarEjercicios = async () => {
        if (!idRutina || !idEjercicios || idEjercicios.length === 0) {
            return;
        }
        setLoading(true);
        const json = {
            id: idRutina,
            ejercicios: idEjercicios,
            token: token,
        };

        try {
            const response = await postData(
                config.API_OPTIMA + 'sumarEjerciciosRutina',
                json, setLoading
            );
            if (response.status !== 200) {
                setAlertMessage(response.data.message);
                setAlertTitle('ERROR');
                setModalVisible(true);
            }

        } catch (error) {
            setAlertMessage(error);
            setAlertTitle('ERROR');
            setModalVisible(true);
        }
        setLoading(false);
    };

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
            usuariosValorados: [],
            token: token,
        };

        const response = await postData(
            config.API_OPTIMA + 'crearRutina',
            json, setLoading
        );
        if (response.status === 201) {
            setAlertMessage('Routine created successfully.');
            setAlertTitle('Success');
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
                Alert.alert('Cancelled', 'You cancelled image selection');
            } else if (response.errorCode) {
                Alert.alert('Error', 'An error occurred while selecting the image');
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
        setDieta('');
        setVistaPrevia(null);
        setIdEjercicios([]);
        setEjerciciosRutina([]);
    };

    const cancelarPress = async () => {
        setLoading(true);
        const response = await deleteData(config.API_OPTIMA + 'eliminarRutina?token=' + token + '&id=' + idRutina, setLoading);
        setLoading(false);
        if (response.status === 200) {
            setAlertMessage('Routine creation cancelled');
            setAlertTitle('Cancelled');
            setModalVisible(true);
            limpiarCampos();
            props.navigation.goBack();
        } else {
            setAlertMessage(response.data.message);
            setAlertTitle('ERROR');
            setModalVisible(true);
        }
    }

    const validarCampos = () => {
        if (!nomRutina || !ambito || idEjercicios == '' || ejerciciosRutina == [] || !dieta || !vistaPrevia) {
            if (idEjercicios == '' || ejerciciosRutina == []) {
                setAlertMessage('You have not added any exercises.');
                setAlertTitle('Error');
                setModalVisible(true);
                return;
            }
            setAlertMessage('All fields must be completed before saving.');
            setAlertTitle('Error');
            setModalVisible(true);
            return;
        }

        registrarRutina();
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Create New Routine{draft}</Text>
            <TextInput
                style={styles.input}
                placeholder="Routine Name"
                placeholderTextColor="#90caf9"
                value={nomRutina}
                onChangeText={(newText) => setNomRutina(newText)}
                maxLength={17}
            />
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={dificultad}
                    onValueChange={(itemValue) => setDificultad(itemValue)}
                    style={styles.picker}>
                    <Picker.Item label="Beginner" value="Principiante" style={styles.pickerItem} />
                    <Picker.Item label="Intermediate" value="Intermedio" style={styles.pickerItem} />
                    <Picker.Item label="Expert" value="Experto" style={styles.pickerItem} />
                </Picker>
            </View>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={ambito}
                    onValueChange={(itemValue) => setAmbito(itemValue)}
                    style={styles.picker}>
                    <Picker.Item label="Gym" value="Gimnasio" style={styles.pickerItem} />
                    <Picker.Item label="Calisthenics" value="Calistenia" style={styles.pickerItem} />
                    <Picker.Item label="Home" value="Casa" style={styles.pickerItem} />
                </Picker>
            </View>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={musculo}
                    onValueChange={(itemValue) => setMusculo(itemValue)}
                    style={styles.picker}>
                    <Picker.Item label="Biceps" value="Biceps" style={styles.pickerItem} />
                    <Picker.Item label="Triceps" value="Triceps" style={styles.pickerItem} />
                    <Picker.Item label="Chest" value="Pecho" style={styles.pickerItem} />
                    <Picker.Item label="Back" value="Espalda" style={styles.pickerItem} />
                    <Picker.Item label="Legs" value="Pierna" style={styles.pickerItem} />
                </Picker>
            </View>
            <TextInput
                style={styles.input}
                placeholder="Diet"
                placeholderTextColor="#90caf9"
                value={dieta}
                onChangeText={(newText) => setDieta(newText)}
            />
            <Pressable style={styles.containerCrear} onPress={() => props.navigation.navigate('CrearEjercicio')}>
                <Icon name="add-circle-outline" color="#607cff" size={50} style={{ marginHorizontal: "5%" }} />
                <Text style={styles.text}>Create Exercise</Text>
            </Pressable>
            <View style={styles.listContainer}>
                <ScrollView nestedScrollEnabled={true}>
                    {ejerciciosRutina.map((element, index) => (
                        <CardEjercicio
                            key={index}
                            borrarEnabled={true}
                            idEjercicio={element.id}
                            nombre={element.nombreEjercicio}
                            descripcion={element.explicacion}
                            imagen={element.vistaPrevia}
                            onDelete={getEjercicios}
                        />

                    ))}
                </ScrollView>
            </View>
            <View style={styles.buttonContainer}>
                <Button mode="contained" style={styles.imagePickerButton} onPress={pickImage}>
                    Select Image
                </Button>
            </View>
            {vistaPrevia && (
                <Image source={{ uri: vistaPrevia }} style={styles.image} />
            )}
            <View style={styles.buttonContainer}>
                <Button mode="contained" style={styles.buttonClear} onPress={() => validarCampos()}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <MaterialIcons name="save" color="lightgreen" size={25} style={{ marginRight: 5 }} />
                        <Text style={styles.resetPasswordText}>Save</Text>
                    </View>
                </Button>
                <Button mode="contained" style={styles.buttonClear} onPress={() => cancelarPress()}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <MaterialIcons name="cancel" color="#fe876d" size={25} style={{ marginRight: 5 }} />
                        <Text style={styles.resetPasswordText}>Cancel</Text>
                    </View>
                </Button>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 10,
        backgroundColor: '#1F2937',
        alignItems: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#bbdefb',
        marginBottom: 20,
        textAlign: 'center',
        marginTop: 20,
    },
    resetPasswordText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
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
        borderColor: 'black',
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