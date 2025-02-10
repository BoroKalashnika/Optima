import { useState, useContext } from 'react';
import {
    View,
    Text,
    Pressable,
    TextInput,
    Alert,
    StyleSheet,
    ScrollView,
    BackHandler,
    Modal
} from 'react-native';
import Video from 'react-native-video';
import { Button } from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import { SelectList } from 'react-native-dropdown-select-list';
import { useFocusEffect } from '@react-navigation/native';
import uploadVideo from '../../Utils/services/uploadVideo';
import postData from '../../Utils/services/postData';
import Context from '../../Utils/Context';
import Carga from '../../Components/carga/Carga';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


const CrearEjercicio = (props) => {
    const [nombre, setNombre] = useState('');
    const [grupoMuscular, setGrupoMuscular] = useState('');
    const [dificultad, setDificultad] = useState('');
    const [videoFile, setVideoFile] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const { modalVisible, setModalVisible } = useContext(Context);
    const { alertMessage, setAlertMessage } = useContext(Context);
    const { alertTitle, setAlertTitle } = useContext(Context);
    const { loading, setLoading } = useContext(Context);
    const { token } = useContext(Context);
    const { idRutina } = useContext(Context);
    const { idEjercicios, setIdEjercicios } = useContext(Context);
    const { ejercicio, setEjercicio } = useContext(Context);
    const { email } = useContext(Context);

    useFocusEffect(() => {
        const backAction = () => {
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    });

    const data = [
        { key: '1', value: 'Pecho' },
        { key: '2', value: 'Espalda' },
        { key: '3', value: 'Biceps' },
        { key: '4', value: 'Triceps' },
        { key: '5', value: 'Pierna' },
    ];

    const nivel = [
        { key: '1', value: 'bajo' },
        { key: '2', value: 'medio' },
        { key: '3', value: 'alto' },
    ];

    const pickVideo = async () => {
        launchImageLibrary(
            {
                mediaType: 'video',
                quality: 1,
                videoStabilizationMode: 2,
            },
            (response) => {
                if (response.didCancel) {
                    return;
                }

                if (response.errorCode) {
                    console.error('Error al seleccionar el video:', response.errorCode);
                    return;
                }

                const videoUri = response.assets[0].uri;

                RNFS.stat(videoUri)
                    .then((statResult) => {
                        const fileSizeInMB = statResult.size / (1024 * 1024);
                        const maxSize = 40;

                        if (fileSizeInMB <= maxSize) {
                            setVideoFile(videoUri);
                        } else {
                            Alert.alert(
                                'Archivo demasiado grande',
                                `El video excede el tamaño máximo permitido de ${maxSize} MB.`
                            );
                        }
                    })
                    .catch((error) => {
                        console.log('Error al obtener el tamaño del archivo:', error);
                    });
            }
        );
    };

    const crearEjercicio = async () => {
        setLoading(true);
        if (nombre && grupoMuscular && dificultad && videoFile && descripcion) {
            const videoUrl = await uploadVideo(videoFile);

            if (videoUrl !== 'Failed to upload video') {

                const publicId = videoUrl.split('/').slice(-1)[0].split('.')[0]; // Extract the public ID

                const thumbnailUrl = `https://res.cloudinary.com/dhfvnvuox/video/upload/so_auto/${publicId}.jpg`; // Using AI to pick an interesting frame

                const json = {
                    nombreEjercicio: nombre,
                    grupoMuscular: grupoMuscular,
                    dificultad: dificultad,
                    video: videoUrl,
                    explicacion: descripcion,
                    idRutina: idRutina,
                    usuario: email,
                    vistaPrevia: thumbnailUrl,
                    token: token
                };

                const response = await postData(
                    'http://13.216.205.228:8080/optima/crearEjercicio',
                    json, setLoading
                );

                if (response.status === 201) {
                    //setIdEjercicios([...idEjercicios, response.data.message]);
                    setEjercicio(ejercicio ? false : true);
                    setAlertMessage('Ejercicio creado correctamente.');
                    setAlertTitle('Éxito');
                    setModalVisible(true);
                    limpiarCampos();
                    handleOnPress();
                } else {
                    setAlertMessage(response.message);
                    setAlertTitle('ERROR');
                    setModalVisible(true);
                }
            } else {
                setAlertMessage('Failed to upload video');
                setAlertTitle('ERROR');
                setModalVisible(true);
            }
        } else {
            setAlertMessage('Completa todos los campos');
            setAlertTitle('ERROR');
            setModalVisible(true);
        }
        setLoading(false);
    };

    const limpiarCampos = () => {
        setNombre('');
        setGrupoMuscular('');
        setDificultad('');
        setVideoFile('');
        setDescripcion('');
    };

    const handleOnPress = () => {
        props.navigation.goBack();
    };

    if (loading) {
        return (
            <Carga />
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.subContainer}>
                <Text style={styles.title}>Crear Ejercicio</Text>
            </View>
            <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Introduce el nombre"
                        placeholderTextColor="#9CA3AF"
                        value={nombre}
                        onChangeText={setNombre}
                    />
                </View>

                <SelectList
                    setSelected={(val) => setGrupoMuscular(val)}
                    data={data}
                    defaultOption="Biceps"
                    save="value"
                    boxStyles={styles.selectBox}
                    placeholder="Grupo Muscular"
                    inputStyles={styles.selectInput}
                    dropdownStyles={styles.dropdown}
                    dropdownTextStyles={styles.dropdownText}
                />

                <SelectList
                    setSelected={(val) => setDificultad(val)}
                    data={nivel}
                    save="value"
                    boxStyles={styles.selectBox}
                    placeholder="Dificultad"
                    inputStyles={styles.selectInput}
                    dropdownStyles={styles.dropdown}
                    dropdownTextStyles={styles.dropdownText}
                />

                <Button
                    mode="contained"
                    style={styles.imagePickerButton}
                    onPress={pickVideo}>
                    Seleccionar Video
                </Button>
                {videoFile && (
                    <Video
                        style={styles.video}
                        source={{ uri: videoFile }}
                        useNativeControls
                    // shouldPlay
                    />
                )}
                <TextInput
                    style={styles.input}
                    placeholder="Introduce una Descripcion"
                    placeholderTextColor="#9CA3AF"
                    value={descripcion}
                    onChangeText={setDescripcion}
                />
                <View style={styles.subContainer}>
                    <Pressable style={[styles.bottom, { marginRight: 5 }]} onPress={() => handleOnPress()}>
                        <MaterialIcons name="cancel" color="#fe876d" size={35} />
                        <Text style={styles.resetPasswordText}>Cancelar</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.bottom, { marginLeft: 5 }]}
                        onPress={() => crearEjercicio()}>
                        <Ionicons name="add-circle-outline" color="lightgreen" size={35} />
                        <Text style={styles.resetPasswordText}>Crear Ejercicio</Text>
                    </Pressable>
                </View>
            </View>       
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#1F2937',
    },
    subContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    formContainer: {
        paddingHorizontal: 16,
        width: '100%',
        maxWidth: 384,
        color: '#00008B',
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        marginBottom: 24,
        color: 'white',
    },
    imagePickerButton: {
        backgroundColor: '#374151',
        justifyContent: 'center',
        borderWidth: 2,
        borderRadius: 10,
        height: 70,
        marginBottom: 10,
        borderColor: '#607cff',
    },
    textLogin: {
        fontSize: 20,
        color: 'white',
    },
    inputContainer: {
        flexDirection: 'column',
        paddingBottom: 10,
    },
    input: {
        backgroundColor: '#374151',
        color: 'white',
        padding: 12,
        borderRadius: 8,
        borderColor: '#607cff',
        borderWidth: 1,
        marginBottom: 5,
        width: '100%',
    },
    resetPasswordText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
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
    selectBox: {
        backgroundColor: '#374151',
        color: 'white',
        borderRadius: 8,
        borderColor: '#607cff',
        borderWidth: 1,
        marginBottom: 10,
    },
    selectInput: {
        color: '#C6C6C6',
        fontSize: 16,
    },
    dropdown: {
        backgroundColor: '#1F2937',
        borderColor: '#607cff',
        borderWidth: 1,
        color: '#white',
    },
    dropdownText: {
        color: 'white',
        fontSize: 14,
    },
    video: {
        width: '100%',
        height: 220,
        marginBottom: 10,
    },
});

export default CrearEjercicio;