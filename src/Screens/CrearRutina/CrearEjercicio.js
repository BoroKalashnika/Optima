import { useState, useContext } from 'react';
import {
    View,
    Text,
    Pressable,
    TextInput,
    Alert,
    StyleSheet,
} from 'react-native';
import Video from 'react-native-video';
import { Button } from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import { SelectList } from 'react-native-dropdown-select-list';
import uploadVideo from '../../Utils/services/uploadVideo';
import postData from '../../Utils/services/postData';
import Context from '../../Utils/Context';
import Carga from '../../Components/carga/Carga';

const CrearEjercicio = (props) => {
    const [nombre, setNombre] = useState('');
    const [grupoMuscular, setGrupoMuscular] = useState('');
    const [dificultad, setDificultad] = useState('');
    const [videoFile, setVideoFile] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const { loading, setLoading } = useContext(Context);

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
                        const maxSize = 51;

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
        if (nombre && grupoMuscular && dificultad && videoFile && descripcion) {
            setLoading(true);

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
                    idRutina: '',
                    usuario: '',
                    vistaPrevia: thumbnailUrl,
                };

                const response = await postData(
                    'http://13.216.205.228:8080/optima/crearEjercicio',
                    json, setLoading
                );

                if (response.status === 201) {
                    Alert.alert('RUTINA CREADA', response.message);
                } else {
                    Alert.alert('ERROR', response.message);
                }
            } else {
                Alert.alert('ERROR', 'Failed to upload video');
                setLoading(false);
            }
        } else {
            Alert.alert('ERROR', 'Completa todos los campos');
        }
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
        <View style={styles.container}>
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
                    <Pressable style={styles.bottom} onPress={handleOnPress}>
                        <Text style={styles.resetPasswordText}>Cancelar</Text>
                    </Pressable>
                    <Pressable
                        style={styles.bottom}
                        onPress={crearEjercicio}>
                        <Text style={styles.textLogin}>Crear Ejercicio</Text>
                    </Pressable>
                </View>
            </View>
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
        fontSize: 17,
    },
    bottom: {
        backgroundColor: '#607cff',
        justifyContent: 'center',
        borderWidth: 2,
        borderRadius: 10,
        borderColor: 'black',
        height: 55,
        width: 140,
        alignItems: 'center',
        marginTop: 5,
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