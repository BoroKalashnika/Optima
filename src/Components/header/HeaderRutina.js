import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { IconButton } from 'react-native-paper';

const HeaderRutina = (props) => {
    const [validadorPlay, setValidadorlay] = useState(false);
    const icono = validadorPlay ? "heart" : "heart-outline";

    const PressHeart = () => {
        setValidadorlay(!validadorPlay);
    };

    return (
        <View style={estilos.containerRow}>
            <Text style={estilos.title}>{props.nombre}</Text>
            <IconButton icon={icono} color="red" size={50} onPress={() => PressHeart()} />
        </View>
    );
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
    containerHR: {
        flexDirection: 'column',
    },
    title: {
        fontSize: 30,
        color: 'white',
    },
    textEjercicio: {
        fontSize: 25,
        color: 'white',
        padding: 4,
        marginTop: 10,
    },
});
export default HeaderRutina;