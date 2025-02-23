import { Text, Pressable, StyleSheet, View, Image, Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/AntDesign';

const { width } = Dimensions.get('window');
const iconSize = width * 0.1; // Tamaño de iconos dinámico
const starSize = width * 0.06;

const Card = (props) => {
    const [color, setColor] = useState('red');
    const [ambitoImg, setAmbitoImg] = useState(null);
    const [musculoImg, setMusculoImg] = useState(null);
    const { ambito, musculo, dificultad, imagen, titulo, estrellas } = props;
    const [stars, setStars] = useState([
        { id: 1, icon: 'staro' },
        { id: 2, icon: 'staro' },
        { id: 3, icon: 'staro' },
        { id: 4, icon: 'staro' },
        { id: 5, icon: 'staro' },
    ]);
    
    useEffect(() => {
        setColor(dificultad === 'Experto' ? 'red' : dificultad === 'Intermedio' ? 'yellow' : 'green');

        const musculoImages = {
            Biceps: require('../../Assets/img/biceps.png'),
            Pecho: require('../../Assets/img/pecho.png'),
            Triceps: require('../../Assets/img/triceps.png'),
            Pierna: require('../../Assets/img/pierna.png'),
            Espalda: require('../../Assets/img/espalda.png'),
        };
        setMusculoImg(musculoImages[musculo]);

        const ambitoImages = {
            Casa: require('../../Assets/img/casa.png'),
            Gimnasio: require('../../Assets/img/pesa.png'),
            Calistenia: require('../../Assets/img/calistenia.png'),
        };
        setAmbitoImg(ambitoImages[ambito]);

        setStars(stars.map(value => ({ ...value, icon: value.id <= estrellas ? 'star' : 'staro' })));
    }, [ambito, musculo, dificultad, estrellas]);

    return (
        <Pressable onPress={props.onRutina}>
            <View style={styles.container}>
                <Image source={{ uri: imagen }} style={styles.image} resizeMode="cover" />
                <View style={styles.subContainer}>
                    <View style={styles.containerDescripcion}>
                        <Text style={styles.title}>{titulo}</Text>
                    </View>
                    <View style={styles.containerRow}>
                        <Image source={ambitoImg} style={styles.icono} resizeMode="contain" />
                        <View style={styles.spacer} />
                        <Image source={musculoImg} style={styles.icono} resizeMode="contain" />
                        <View style={styles.spacer} />
                        <Icon name="dashboard" size={iconSize} color={color} />
                    </View>
                    <View style={styles.containerStars}>
                        {stars.map((value) => (
                            <Icon key={value.id} name={value.icon} size={starSize} color="yellow" />
                        ))}
                    </View>
                </View>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#003247',
        width: '100%',
        borderColor: '#607cff',
        borderRadius: 10,
        borderWidth: 2,
        marginTop: 10,
        alignItems: 'center',
        padding: 10
    },
    containerRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '90%',
    },
    containerStars: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
    },
    containerDescripcion: {
        flex: 1,
        alignItems: 'center',
    },
    subContainer: {
        flex: 2,
        alignItems: 'center'
    },
    title: {
        fontSize: width * 0.1, // Título ajustable al ancho de pantalla
        color: 'white',
    },
    image: {
        width: width * 0.35, // Imagen proporcional
        height: width * 0.35,
        borderRadius: 10,
    },
    icono: {
        width: width * 0.12, // Iconos ajustables
        height: undefined,
        aspectRatio: 1,
    },
    spacer: {
        width: 15,
    }
});

export default Card;