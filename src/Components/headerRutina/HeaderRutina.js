import { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
} from 'react-native';

import Icon from 'react-native-vector-icons/AntDesign';
const HeaderRutina = (props) => {
    const [validarHeart, setValidarHeart] = useState();
    const [validadorClip, setValidadorClip] = useState(false);
    const [iconoHeart, setIconoHeart] = useState('hearto');

    useEffect(() => {
        setValidarHeart(props.guardada);
    }, [props.guardada])

    useEffect(() => {
        if (validarHeart) {
            setIconoHeart('heart');
        } else {
            setIconoHeart('hearto');
        }
    }, [validarHeart]);

    const PressHeart = () => {
        const newHeartState = !validarHeart;
        setValidarHeart(newHeartState);
        setIconoHeart(newHeartState ? 'heart' : 'hearto');
        if (props.favorito) {
            props.favorito({ estado: newHeartState });
        }
    };

    const iconoClip = validadorClip ? 'yellow' : '#607cff';

    if (props.tipo === 'rutina') {
        return (
            <View style={estilos.containerRow}>
                <View style={estilos.containerTitulo}>
                    <Text style={estilos.nombre}>{props.nombre}</Text>
                </View>
                <View style={estilos.containerIconos}>
                    <Icon name="pushpin" color={iconoClip} size={45} onPress={() => PressClip()} />
                    <Icon name={iconoHeart} color="red" size={45} onPress={() => PressHeart()} />
                </View>
            </View>
        );
    }

    if (props.tipo === 'ajustes') {
        return (
            <View style={estilos.containerRowAjustes}>
                <Image source={require('../../Assets/img/logo.png')} style={estilos.image} />
                <Text style={estilos.title}>{props.titulo}</Text>
                <Icon name="setting" size={50} color="#607cff" style={{ marginRight: 10 }} onPress={props.pasarPagina} />
            </View>
        );
    }

    if (props.tipo === 'user') {
        return (
            <View style={estilos.containerRowUser}>
                <Image source={require('../../Assets/img/logo.png')} style={estilos.image} />
                <Icon name="setting" size={45} color="#607cff" style={{ marginRight: 10 }} />
            </View>
        );
    }
};

const estilos = StyleSheet.create({
    containerRow: {
        flex: 1,
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 5,
        backgroundColor: '#1F2937',
        marginTop: 15,

    },
    containerRowAjustes: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 30,
        width: '100%',
    },
    containerRowUser: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1F2937',
    },
    containerIconos: {
        flex: 3,
        flexDirection: 'row',
        marginRight: 5,
        marginBottom: 5,
        justifyContent: "flex-end",
        height: 70,
    },
    containerTitulo: {
        flex: 1
    },
    nombre: {
        fontSize: 30,
        color: 'white',
    },
    textEjercicio: {
        fontSize: 25,
        color: 'white',
        padding: 4,
        marginTop: 10,
    },
    image: {
        width: 80,
        height: 80,
    },
    title: {
        fontSize: 30,
        textAlign: 'center',
        color: 'white',
    },
});

export default HeaderRutina;