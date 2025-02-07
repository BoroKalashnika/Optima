import { Text, Pressable, StyleSheet, View, Image } from 'react-native';
import { useState } from 'react';
import Icon from 'react-native-vector-icons/AntDesign';

const Card = (props) => {
    const [color, setColor] = useState('red');
    const [dificultad, setDificultad] = useState();
    const [ambito, setAmbito] = useState('casa');
    const [musculo, setMusculo] = useState('biceps');
    const { Titulo, Descripcion, NomCreador, Dificultad } = props;

    const chancheColor = () => {
        if (dificultad === 'alta') setColor('red');
        if (dificultad === 'media') setColor('yellow');
        if (dificultad === 'baja') setColor('green');
    };

    return (
        <Pressable onPress={props.onRutina}>
            <View style={styles.container}>
                <Image source={require('../Assets/logo.png')} style={styles.image} />
                <View style={styles.subContainer}>
                    <View style={styles.containerDescripcion}>
                        <Text style={styles.title}>Titulo</Text>
                    </View>
                    <View style={styles.containerRow}>
                        <Image
                            source={require('../Assets/casa.png')}
                            style={styles.icono}
                        />
                        <Image
                            source={require('../Assets/biceps.png')}
                            style={styles.icono}
                        />
                        <Icon name="dashboard" size={40} color={color} />
                    </View>
                    <View style={styles.containerRow}>
                        <Icon name="star" size={25} color="yellow" />
                        <Icon name="star" size={25} color="yellow" />
                        <Icon name="star" size={25} color="yellow" />
                        <Icon name="staro" size={25} color="yellow" />
                        <Icon name="staro" size={25} color="yellow" />
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
        width: 170,
        height: 170,
    },
    icono: {
        width: 40,
        height: 40,
    },
});

export default Card;