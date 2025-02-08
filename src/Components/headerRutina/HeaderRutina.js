import { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';

import Icon from 'react-native-vector-icons/AntDesign';

const HeaderRutina = (props) => {
    const [validadorPlay, setValidadorlay] = useState(false);
    const icono = validadorPlay ? "heart" : "hearto";

    const PressHeart = () => {
        setValidadorlay(!validadorPlay);
    };

    if (props.tipo === 'rutina') {
        return (
            <View style={estilos.containerRow}>
                <Text style={estilos.nombre}>{props.nombre}</Text>
                <Icon name={icono} color="red" size={50} onPress={() => PressHeart()} />
            </View>
        );
    }

    if (props.tipo === 'ajustes') {
        return (
            <View style={estilos.containerRowAjustes}>
                <Image source={require('../../Assets/img/logo.png')} style={estilos.image} />
                <Text style={estilos.title}>{props.titulo}</Text>
                <Icon name="setting" size={50} color="#607cff" style={{ marginRight: 10 }} onPress={props.pasarPagina}/>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 25,
        backgroundColor: '#1F2937',
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