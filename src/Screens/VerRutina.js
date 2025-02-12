import { useState, useEffect, useContext, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image
} from 'react-native';
import CardEjercicio from '../Components/cardEjercicio/CardEjercicio';
import Icon from 'react-native-vector-icons/AntDesign';
import HeaderRutina from '../Components/headerRutina/HeaderRutina';
import getData from '../Utils/services/getData';
import Context from '../Utils/Context';
import { useFocusEffect } from '@react-navigation/native';
import postData from '../Utils/services/postData';
import deleteData from '../Utils/services/deleteData';
import config from '../config/config';
import Carga from '../Components/carga/Carga';

const VerRutina = (props) => {
    const [nombre, setNombre] = useState();
    const { token, setToken } = useContext(Context);
    const { idRutina, setIdRutina } = useContext(Context);
    const [creador, setCreador] = useState();
    const [ejercicios, setEjercicios] = useState([]);
    const [color, setColor] = useState('red');
    const [ambitoImg, setAmbitoImg] = useState('');
    const [musculoImg, setMusculoImg] = useState('');
    const [favorito, setFavorito] = useState();
    const [activo, setActivo] = useState();
    const [estaGuardada, setEstaGuardada] = useState(false);
    const [estaActiva, setEstaActiva] = useState(false);
    const { loading, setLoading } = useContext(Context);
    const { modalVisible, setModalVisible } = useContext(Context);
    const { alertMessage, setAlertMessage } = useContext(Context);
    const { alertTitle, setAlertTitle } = useContext(Context);
    const { idEjercicio, setIdEjercicio } = useContext(Context);

    useFocusEffect(
        useCallback(() => {
            loadRutina();
            loadEjercicios();
        }, [])
    );

    useEffect(() => {
        if (favorito === true) {
            añadirFavoritos();
        } else if (favorito === false) {
            eliminarFavoritos();
        }
    }, [favorito]);

    useEffect(() => {
        if (activo === true) {
            añadirActivo();
        }
    }, [activo]);

    const getFavorito = ({ estado }) => {
        setFavorito(estado);
        setEstaGuardada(estado);
    };

    const getActivo = ({ estado }) => {
        setEstaActiva(estado);
        setActivo(estado);
    };

    const [stars, setStars] = useState([
        { id: 1, icon: 'staro' },
        { id: 2, icon: 'staro' },
        { id: 3, icon: 'staro' },
        { id: 4, icon: 'staro' },
        { id: 5, icon: 'staro' },
    ]);

    const añadirActivo = async () => {
        setLoading(true);
        const json = {
            id: idRutina,
            token: token
        }
        const response = await postData(
            config.API_OPTIMA + 'rutinaActiva',
            json, setLoading
        );
        if (!response.status === 202) {
            setAlertMessage(response.message);
            setAlertTitle('ERROR');
            setModalVisible(true);
        }
        setLoading(false);
    }

    const añadirFavoritos = async () => {
        setLoading(true);
        const json = {
            id: idRutina,
            token: token
        };

        const response = await postData(
            config.API_OPTIMA + 'favoritoRutina',
            json, setLoading
        );
        if (!response.status === 202) {
            setAlertMessage(response.message);
            setAlertTitle('ERROR');
            setModalVisible(true);
        }
        setLoading(false);

    }

    const eliminarFavoritos = async () => {
        setLoading(true);
        const response = await deleteData(
            config.API_OPTIMA + 'deleteFavoritoRutina?token=' + token + '&id=' + idRutina, setLoading
        );
        if (!response.status === 200) {
            setAlertMessage(response.message);
            setAlertTitle('ERROR');
            setModalVisible(true);
        }
        setLoading(false);
    }


    const PresStar = (indice) => {
        const newArray = [...stars];
        newArray.push(
            stars.map((value, index) => {
                if (value.id <= indice) {
                    stars[index].icon = 'star';
                } else if (value.id > indice) {
                    stars[index].icon = 'staro';
                }
            })
        );
        setStars(newArray);
    };

    const loadRutina = async () => {
        try {
            getData(config.API_OPTIMA + 'tokenUsuario?token=' + token).then((element) => {
                const guardada = element.rutinasGuardadas.includes(idRutina);
                setEstaGuardada(guardada);
                const activo = element.rutinaActiva === idRutina;
                setEstaActiva(activo);
            })
            getData(
                config.API_OPTIMA + 'obtenerRutina?id=' + idRutina + '&token=' + token
            ).then((response) => {
                setNombre(response.nombreRutina);
                setCreador(response.creador);
                chancheAmbito(response.ambito);
                chancheColor(response.dificultad);
                chancheMusculo(response.grupoMuscular);
            });
        } catch (error) {
            console.error('Error fetching rutina:', error);
        }
    };

    const loadEjercicios = async () => {
        try {
            getData(
                config.API_OPTIMA + 'obtenerEjercicios?token=' + token + '&idRutina=' + idRutina
            ).then((response) => {
                const newArray = [];
                response.ejercicios.map((ejercicio) => {
                    newArray.push(ejercicio);
                });
                setEjercicios(newArray);
            });
        } catch (error) {
            console.error('Error fetching ejercicios:', error);
        }
    };

    const chancheColor = (dificultad) => {
        if (dificultad === 'Experto') setColor('red');
        if (dificultad === 'Intermedio') setColor('yellow');
        if (dificultad === 'Principiante') setColor('green');
    };

    const chancheMusculo = (musculo) => {
        if (musculo === 'Biceps') setMusculoImg(require('../Assets/img/biceps.png'));
        if (musculo === 'Pecho') setMusculoImg(require('../Assets/img/pecho.png'));
        if (musculo === 'Triceps') setMusculoImg(require('../Assets/img/triceps.png'));
        if (musculo === 'Pierna') setMusculoImg(require('../Assets/img/pierna.png'));
        if (musculo === 'Espalda') setMusculoImg(require('../Assets/img/espalda.png'));
    };

    const chancheAmbito = (ambito) => {
        if (ambito === 'Casa') setAmbitoImg(require('../Assets/img/casa.png'));
        if (ambito === 'Gimnasio') setAmbitoImg(require('../Assets/img/pesa.png'));
        if (ambito === 'Calistenia') setAmbitoImg(require('../Assets/img/calistenia.png'));
    };


    if (loading) {
        return (
            <Carga />
        );
    }
    return (
        <View style={styles.container}>
            <HeaderRutina nombre={nombre} tipo={'rutina'} activo={getActivo} favorito={getFavorito} guardada={estaGuardada} activada={estaActiva} />

            <View style={styles.containerRow}>
                <Text style={styles.title}>{creador}</Text>
                <Image source={require('../Assets/img/perfil.png')} style={styles.profileImage} />
            </View>
            <View style={styles.containerDatos}>
                <View style={styles.subContainer}>
                    <Text style={styles.textLogin}>Ambito</Text>
                    <Text style={styles.textLogin}>|</Text>
                    <Text style={styles.textLogin}>Musculo</Text>
                    <Text style={styles.textLogin}>|</Text>
                    <Text style={styles.textLogin}>Dificultad</Text>
                </View>
                <View style={styles.subContainer}>
                    <Image source={ambitoImg} style={styles.icono} />
                    <Image source={musculoImg} style={styles.icono} />
                    <Icon name="dashboard" size={35} color={color} />
                </View>
            </View>
            <View style={{ flex: 7 }}>
                <Text style={styles.textEjercicio}>───── Ejercicios ─────</Text>
                <FlatList
                    data={ejercicios}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <CardEjercicio
                            nombre={item.nombreEjercicio}
                            descripcion={item.explicacion}
                            imagen={item.vistaPrevia}
                            onEjercicio={() => {
                                props.navigation.navigate('VerEjercicio');
                                setIdEjercicio(item.id);
                            }}
                        />
                    )}
                />
            </View>
            <View style={styles.containerRow}>
                <Text style={styles.textLogin}>Valorar</Text>
                <View style={styles.containerStars}>
                    {stars.map((value) => (
                        <Icon
                            name={value.icon}
                            size={25}
                            color="yellow"
                            onPress={() => PresStar(value.id)}
                        />
                    ))}
                </View>
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
    containerDatos: {
        flexDirection: 'column',
        borderWidth: 2,
        borderRadius: 10,
        borderColor: '#607cff',
        marginTop: 15,
        backgroundColor: '#003247',
        padding: 5
    },
    containerRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#003247',
        padding: 2,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: '#607cff',
        marginTop: 15,
    },
    subContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    icono: {
        width: 38,
        height: 38,
    },
    containerStars: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    textLogin: {
        fontSize: 20,
        color: 'white',
        padding: 10,
    },
    title: {
        fontSize: 30,
        color: 'white',
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 50,
    },
    textEjercicio: {
        fontSize: 25,
        color: 'white',
        padding: 4,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default VerRutina;