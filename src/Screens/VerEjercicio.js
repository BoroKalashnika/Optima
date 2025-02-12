import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import { useState, useEffect, useContext, useCallback } from 'react';
import getData from '../Utils/services/getData';
import Context from '../Utils/Context';
import config from '../config/config';
import Video from 'react-native-video';
const VerEjercicio = (props) => {
    const [nombre, setNombre] = useState();
    const { token, setToken } = useContext(Context);
    const { idRutina, setIdRutina } = useContext(Context);
    const { idEjercicio, setIdEjercicio } = useContext(Context);
    const [descripcion, setDescripcion] = useState();
    const [grupoMuscular, setGrupoMuscular] = useState();
    const [dificultad, setDificultad] = useState();
    const [video, setVideo] = useState();
    useEffect(()=>{
        getEjercicios();
    },[])

    const getEjercicios = async () => {
        try {
            getData(
                config.API_OPTIMA + 'obtenerEjercicio?token=' + token + '&id=' + idEjercicio
            ).then((response) => {
                console.log(response);
                setDescripcion(response.explicacion);
                setNombre(response.nombreEjercicio);
                setGrupoMuscular(response.grupoMuscular);
                setDificultad(response.dificultad);
                setVideo(response.video);
            });
        } catch (error) {
            console.error('Error fetching rutina:', error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.containerRow}>
                <Text style={styles.title}>{nombre}</Text>
            </View>
            <View style={styles.containerVideo}>
                    <Video
                        style={styles.video}
                        source={{ uri: video }}
                        useNativeControls
                    // shouldPlay
                    />
            </View>
            <View style={styles.containerDescripcion}>
                <Text style={styles.textLogin}>{descripcion}</Text>
            </View>
            <View style={styles.containerRow}>
                <Text style={styles.textLogin}>{grupoMuscular}</Text>
                <Text style={styles.textLogin}>{dificultad}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: '#1F2937',
        padding: 10,
    },
    containerDescripcion: {
        flex: 2,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: '#607cff',
        marginTop: 10,
        backgroundColor: '#003247',
        padding:20
    },
    containerVideo: {
        flex: 4,
        width:'100%',
        borderWidth: 2,
        borderRadius: 10,
        borderColor: '#607cff',
        marginTop: 10,
        padding:10,
        justifyContent:"center"
    },
    containerRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#003247',
        padding: 10,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: '#607cff',
        marginTop: 15,
    },
    textLogin: {
        fontSize: 30,
        color: 'white',
    },
    title: {
        fontSize: 40,
        color: 'white',
    },
    video: {
        width: '100%',
        height: "100%",
    },
});

export default VerEjercicio;