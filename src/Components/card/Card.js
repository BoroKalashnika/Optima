import { Text, Pressable, StyleSheet, View, Image } from 'react-native';
import { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/AntDesign';

const Card = (props) => {
    const [color, setColor] = useState('red');
    const [ambitoImg, setAmbitoImg] = useState('Casa');
    const [musculoImg, setMusculoImg] = useState('Biceps');
    const { ambito, musculo, dificultad, imagen,titulo,estrellas } = props;
    const [stars, setStars] = useState([
        { id: 1, icon: 'staro' },
        { id: 2, icon: 'staro' },
        { id: 3, icon: 'staro' },
        { id: 4, icon: 'staro' },
        { id: 5, icon: 'staro' },
    ]);
    const chancheColor = () => {
        if (dificultad === 'Experto') setColor('red');
        if (dificultad === 'Intermedio') setColor('yellow');
        if (dificultad === 'Principiante') setColor('green');
    };
    const chancheMusculo = () => {
        if (musculo === 'Biceps') setMusculoImg(require('../../Assets/img/biceps.png'));
        if (musculo === 'Pecho') setMusculoImg(require('../../Assets/img/pecho.png'));
        if (musculo === 'Triceps') setMusculoImg(require('../../Assets/img/triceps.png'));
        if (musculo === 'Pierna') setMusculoImg(require('../../Assets/img/pierna.png'));
        if (musculo === 'Espalda') setMusculoImg(require('../../Assets/img/espalda.png'));

    };
    const chancheAmbito = () => {
        if (ambito === 'Casa') setAmbitoImg(require('../../Assets/img/casa.png'));
        if (ambito === 'Gimnasio') setAmbitoImg(require('../../Assets/img/pesa.png'));
        if (ambito === 'Calistenia') setAmbitoImg(require('../../Assets/img/calistenia.png'));
    };
    const getStars = (indice) => {
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
    useEffect(() => {
        chancheAmbito();
        chancheColor();
        chancheMusculo();
        getStars(estrellas)
    }, [])

    return (
        <Pressable onPress={props.onRutina}>
            <View style={styles.container}>
                    <Image source={{ uri: imagen }} style={styles.image} />
                <View style={styles.subContainer}>
                    <View style={styles.containerDescripcion}>
                        <Text style={styles.title}>{titulo}</Text>
                    </View>
                    <View style={styles.containerRow}>
                        <Image
                            source={ambitoImg}
                            style={styles.icono}
                        />
                        <Image
                            source={musculoImg}
                            style={styles.icono}
                        />
                        <Icon name="dashboard" size={40} color={color} />
                    </View>
                    <View style={styles.containerRow}>
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
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#003247', // bg-gray-950
        width: '100%',
        borderColor: '#607cff',
        borderRadius: 10,
        borderWidth: 2,
        marginTop: 10,
        alignItems: 'center',
        padding: 10
    },
    containerRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    containerDescripcion: {
        flex: 1,
        alignItems: 'center',
    },
    subContainer: {
        flex: 2,
        marginLeft:10
    },
    title: {
        fontSize: 37,
        color: 'white',
    },
    text: {
        fontSize: 18,
        color: 'white',
    },
    image: {
        width: 130,
        height: 130,
        
    },
    icono: {
        width: 40,
        height: 40,
    },
});

export default Card;