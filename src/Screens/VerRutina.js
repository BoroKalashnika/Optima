import { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
} from 'react-native';
import CardEjercicio from '../Components/cardEjercicio/CardEjercicio';
import Icon from 'react-native-vector-icons/AntDesign';
import HeaderRutina from '../Components/headerRutina/HeaderRutina';
import getData from '../Utils/services/getData';

const VerRutina = (props) => {
    const [nombre, setNombre] = useState();
    const [ambito, setAmbito] = useState();
    const [dificultad, setDificultad] = useState();
    const data = [
        {
            id: '1',
            nombre: 'Ejercicio 1',
            descripcion: 'Descripción del ejercicio 1',
            imagen: require('../Assets/img/logo.png'),
        },
        {
            id: '2',
            nombre: 'Ejercicio 2',
            descripcion: 'Descripción del ejercicio 2',
            imagen: require('../Assets/img/logo.png'),
        },
        {
            id: '3',
            nombre: 'Ejercicio 3',
            descripcion: 'Descripción del ejercicio 3',
            imagen: require('../Assets/img/logo.png'),
        },
        {
            id: '4',
            nombre: 'Ejercicio 4',
            descripcion: 'Descripción del ejercicio 4',
            imagen: require('../Assets/img/logo.png'),
        },
        {
            id: '5',
            nombre: 'Ejercicio 5',
            descripcion: 'Descripción del ejercicio 5',
            imagen: require('../Assets/img/logo.png'),
        },
        {
            id: '6',
            nombre: 'Ejercicio 5',
            descripcion: 'Descripción del ejercicio 5',
            imagen: require('../Assets/img/logo.png'),
        },
        {
            id: '7',
            nombre: 'Ejercicio 5',
            descripcion: 'Descripción del ejercicio 5',
            imagen: require('../Assets/img/logo.png'),
        },
    ];
    const [validadorPlay, setValidadorlay] = useState(false);

    useEffect(() => {
        loadRutina();
    }, []);

    const icono = validadorPlay ? 'heart' : 'hearto';
    const [stars, setStars] = useState([
        { id: 1, icon: 'staro' },
        { id: 2, icon: 'staro' },
        { id: 3, icon: 'staro' },
        { id: 4, icon: 'staro' },
        { id: 5, icon: 'staro' },
    ]);

    const PressHeart = () => {
        setValidadorlay(!validadorPlay);
    };

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
            getData(
                'http://13.216.205.228:8080/optima/obtenerRutina?id=67a356eccc178b5685343843&token=1'
            ).then((response) => {
                setAmbito(response.ambito);
                setDificultad(response.dificultad);
                setNombre(response.nombreRutina);
            });
        } catch (error) {
            console.error('Error fetching Pokémon:', error);
        }
    };
    console.log(props.navigation)
    return (
        <View style={styles.container}>
            <HeaderRutina nombre={nombre} />
            <View style={styles.containerRow}>
                <Text style={styles.title}> Creador: </Text>
                <Icon name={icono} color="red" size={50} onPress={PressHeart} />
            </View>
            <View style={styles.containerDatos}>
                <View style={styles.subContainer}>
                    <Text style={styles.textLogin}>Ambito {ambito}</Text>
                    <Text style={styles.textLogin}>| {ambito}</Text>
                    <Text style={styles.textLogin}>Dificultad {dificultad}</Text>
                    <Text style={styles.textLogin}>| {ambito}</Text>
                    <Text style={styles.textLogin}>Musculo {dificultad}</Text>
                </View>
                <View style={styles.subContainer}>
                    <Text style={styles.textLogin}>Casa {dificultad}</Text>
                    <Text style={styles.textLogin}>| {ambito}</Text>

                    <Text style={styles.textLogin}>Alta {dificultad}</Text>
                    <Text style={styles.textLogin}>| {ambito}</Text>

                    <Text style={styles.textLogin}>Pecho {dificultad}</Text>
                </View>
            </View>
            <View style={{ flex: 7 }}>
                <Text style={styles.textEjercicio}>───── Ejercicios ─────</Text>
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <CardEjercicio
                            nombre={item.nombre}
                            descripcion={item.descripcion}
                            imagen={item.imagen}
                            onEjercicio={() => {
                                props.navigation.navigate('VerEjercicio');
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