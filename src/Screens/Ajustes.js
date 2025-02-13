import { useContext, useEffect, useState, useCallback } from 'react';
import Context from '../Utils/Context';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Pressable, BackHandler, Dimensions } from 'react-native';
import Card from '../Components/card/Card';
import HeaderRutina from '../Components/headerRutina/HeaderRutina';
import getData from '../Utils/services/getData';
import frasesMotivadoras from '../Assets/frasesMotivadoras.json';
import { useFocusEffect } from '@react-navigation/native';
import { PieChart } from 'react-native-chart-kit';
import config from '../config/config';

const Ajustes = (props) => {
    const { token, setToken } = useContext(Context);
    const { email, setEmail } = useContext(Context);
    const { idRutina, setIdRutina } = useContext(Context);
    const [nombre, setNombre] = useState();
    const [historialIMC, setHistorialIMC] = useState([]);
    const [macros, setMacros] = useState([]);
    const [idRutinaActiva, setIdRutinaActiva] = useState();
    const [dificultad, setDificultad] = useState();
    const [ambito, setAmbito] = useState();
    const [imagen, setImagen] = useState();
    const [musculo, setMusculo] = useState();
    const [estrellas, setEstrellas] = useState();
    const [titulo, setTitulo] = useState();


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <HeaderRutina tipo={'user'} />
            <Image source={require('../Assets/img/perfil.png')} style={styles.profileImage} />
            <Text style={styles.name}>nombre</Text>
        </ScrollView >
        
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#1F2937',
    },
    topImage: {
        width: 80,
        height: 80,
        position: 'absolute',
        top: 10,
        left: 10,
    },
    profileImage: {
        width: 185,
        height: 185,
        borderRadius: 50,
        marginTop: 10,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#bbdefb',
    },
    containerCard: {
        width: '95%',
        marginTop: 15,
    },
    calculadoraContainer: {
        width: '105%',
        marginTop: 20,
    },
    bottom: {
        backgroundColor: '#607cff',
        justifyContent: 'center',
        borderWidth: 2,
        borderRadius: 10,
        borderColor: 'black',
        height: 55,
        width: 160,
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 10

    },
    textLogin: {
        fontSize: 20,
        color: 'white',
    },
    calcRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '90%',
        padding: 10,
        backgroundColor: '#2D3748',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        alignSelf: 'center',
    },
    calcTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#bbdefb',
        marginRight: 10,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 10,
    },
    imageClick: {
        width: 42,
        height: 42,
        borderRadius: 10,
        transform: [{ scaleX: -1 }]
    },
    listContainer: {
        width: '90%',
        maxHeight: 180,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor: '#607cff',
        marginBottom: 30,
        alignSelf: 'center',
    },
    listContainerMacro: {
        width: '90%',
        maxHeight: 180,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor: '#607cff',
        alignSelf: 'center',
    },
    listItem: {
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#ffffff55',
        alignItems: 'center',
    },
    listItemText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center'
    },
    frase: {
        marginTop: 30,
        fontSize: 22,
        fontWeight: '500',
        fontStyle: 'italic',
        color: 'white',
        textAlign: 'center',
    },
    result: {
        fontSize: 15,
        color: 'white',
        fontWeight: '500',
    },
});

export default Ajustes;