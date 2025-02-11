import { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';

import Icon from 'react-native-vector-icons/AntDesign';

const HeaderRutina = (props) => {
    const [validarHeart, setValidarHeart] = useState(false);
    const [validadorClip, setValidadorClip] = useState(false);
    const iconoHeart = validarHeart ? 'heart' : 'hearto';
    const iconoClip = validadorClip ? 'yellow' : '#607cff';

    
    const PressHeart = () => {
        setValidarHeart(!validarHeart);
    };

    const PressClip = () => {
        setValidadorClip(!validadorClip);
    };

    if (props.tipo === 'rutina') {
        return (
            <View style={estilos.containerRow}>
                <View style={estilos.containerTitulo}>
                    <Text style={estilos.nombre}>{props.nombre}</Text>
                </View>
                <View style={estilos.containerRow}>
                    <Icon name={iconoHeart} color="red" size={45} onPress={() => PressHeart()} />
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

}

const estilos = StyleSheet.create({
    containerRow: {
        flex: 1,
        height:60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 5,
        backgroundColor: '#1F2937',
        justifyContent: "flex-end",
        marginLeft: 10,
        marginTop:5
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
        marginLeft: 5,
        marginBottom: 5
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