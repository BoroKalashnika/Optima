import { useContext, useEffect, useState, useCallback } from 'react';
import Context from '../../Utils/Context';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Pressable, BackHandler, Dimensions } from 'react-native';
import Card from '../../Components/card/Card';
import HeaderRutina from '../../Components/headerRutina/HeaderRutina';
import getData from '../../Utils/services/getData';
import frasesMotivadoras from '../../Assets/frasesMotivadoras.json';
import { useFocusEffect } from '@react-navigation/native';
import { PieChart } from 'react-native-chart-kit';
import config from '../../config/config';

const Usuario = (props) => {
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
    const [vistaPrevia, setVistaPrevia] = useState(null);
    const [foto, setFoto] = useState();
    const screenWidth = Dimensions.get('window').width;

    useFocusEffect(() => {
        const backAction = () => {
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    });

    useFocusEffect(
        useCallback(() => {
            getData(config.API_OPTIMA + 'tokenUsuario?token=' + token).then((response) => {
                setIdRutinaActiva(response.rutinaActiva);
                setNombre(response.nombre);
                setHistorialIMC(response.historialImc);
                if (response.macros) {
                    setMacros(response.macros.split('|'));
                } else {
                    setMacros([]);
                }
                if (response.fotoPerfil != "") {
                    setFoto(response.fotoPerfil);
                    setVistaPrevia(true);
                }
            });
        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            getData(config.API_OPTIMA + 'tokenUsuario?token=' + token).then((response) => {
                setIdRutinaActiva(response.rutinaActiva);
                setNombre(response.nombre);
                setHistorialIMC(response.historialImc);
                if (response.macros) {
                    setMacros(response.macros.split('|'));
                } else {
                    setMacros([]);
                }
                if (response.fotoPerfil != "") {
                    setFoto(response.fotoPerfil);
                    setVistaPrevia(true);
                }
            });
        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            getData(config.API_OPTIMA + 'obtenerRutina?token=' + token + '&id=' + idRutinaActiva).then((response) => {
                setEstrellas(response.valoracion);
            })
        }, [])
    );

    useEffect(() => {
        if (!email) {
            getData(config.API_OPTIMA + 'tokenUsuario?token=' + token).then((response) => {
                setEmail(response.correo)
            });
        }
    }, []);

    useEffect(() => {
        getData(config.API_OPTIMA + 'obtenerRutina?token=' + token + '&id=' + idRutinaActiva).then((response) => {
            setAmbito(response.ambito);
            setDificultad(response.dificultad);
            setImagen(response.vistaPrevia);
            setTitulo(response.nombreRutina);
            setEstrellas(response.valoracion);
            setMusculo(response.grupoMuscular);
        })
    }, [idRutinaActiva]);

    const getRandom = () => {
        return Math.floor(Math.random() * frasesMotivadoras.frases.length);
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <HeaderRutina tipo={'user'} onAjustes={() => props.navigation.navigate("Ajustes")} />
            {vistaPrevia ? <Image source={{ uri: foto }} style={styles.profileImage} /> :
                <Image source={require('../../Assets/img/perfil.png')} style={styles.profileImage} />
            }
            <Text style={styles.name}>{nombre}</Text>
            <Text style={styles.frase}>{frasesMotivadoras.frases[getRandom()]}</Text>
            <View style={styles.containerCard}>
                {!idRutinaActiva ?
                    <View style={{ marginTop: 35, marginBottom: 15, alignItems: "center" }}>
                        <Text style={{ color: 'white', fontSize: 18, textAlign: 'center' }}>You don't have any active routines yet.{"\n"}FIND IT!</Text>
                        <Pressable style={styles.bottom} onPress={() => props.navigation.navigate("Buscar")}>
                            <Text style={styles.textLogin}>Find Routine</Text>
                        </Pressable>
                    </View> :
                    <Card
                        dificultad={dificultad}
                        ambito={ambito}
                        imagen={imagen}
                        musculo={musculo}
                        estrellas={estrellas}
                        titulo={titulo}
                        onRutina={() => {
                            props.navigation.navigate('VerRutina');
                            setIdRutina(idRutinaActiva);
                        }} />}

            </View>
            <View style={styles.calculadoraContainer}>
                <TouchableOpacity style={styles.calcRow} onPress={() => props.navigation.navigate('CalcularIMC')}>
                    <Text style={styles.calcTitle}>BMI</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={require('../../Assets/img/click.png')} style={styles.imageClick} />
                        <Image source={require('../../Assets/img/calculadoraIMC.png')} style={styles.image} />
                    </View>
                </TouchableOpacity>
                <View style={styles.listContainer}>
                    <ScrollView nestedScrollEnabled={true}>
                        {historialIMC && historialIMC.length > 0 ? (historialIMC.slice().reverse().map((element, index) => {
                            const resultSeparado = element.split('-');
                            return (
                                <View key={index.toString()} style={styles.listItem}>
                                    <Text style={styles.listItemText}>{resultSeparado[0]}</Text>
                                    <Text style={styles.listItemText}>{resultSeparado[1]}</Text>
                                </View>
                            );
                        })
                        ) : (<View style={styles.listItem}>
                            <Text style={styles.listItemText}>You have not made any calculations</Text>
                        </View>
                        )}
                    </ScrollView>
                </View>
                <TouchableOpacity style={styles.calcRow} onPress={() => props.navigation.navigate('CalcularMacros')}>
                    <Text style={styles.calcTitle}>Macros</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={require('../../Assets/img/click.png')} style={styles.imageClick} />
                        <Image source={require('../../Assets/img/calculadoraMacros.png')} style={styles.image} />
                    </View>
                </TouchableOpacity>
                <View style={styles.listContainerMacro}>
                    {macros && macros.length > 0 ? (
                        <View style={styles.listItem}>
                            <View>
                                <Text style={styles.result}>Total Calories............................{macros[0]} kcal</Text>
                                <Text style={styles.result}>Carbohydrates...........................{macros[1]} g</Text>
                                <Text style={styles.result}>Proteins.....................................{macros[2]} g</Text>
                                <Text style={styles.result}>Fats............................................{macros[3]} g</Text>
                            </View>
                            <PieChart
                                data={[
                                    {
                                        name: 'Carbs',
                                        population: parseFloat(macros[1]),
                                        color: '#FF6347',
                                        legendFontColor: '#7F7F7F',
                                        legendFontSize: 12
                                    },
                                    {
                                        name: 'Proteins',
                                        population: parseFloat(macros[2]),
                                        color: '#4CAF50',
                                        legendFontColor: '#7F7F7F',
                                        legendFontSize: 12
                                    },
                                    {
                                        name: 'Fats',
                                        population: parseFloat(macros[3]),
                                        color: '#FFD700',
                                        legendFontColor: '#7F7F7F',
                                        legendFontSize: 12
                                    }
                                ]}
                                width={screenWidth - 80}
                                height={80}
                                chartConfig={{
                                    backgroundColor: '#ffffff',
                                    backgroundGradientFrom: '#ffffff',
                                    backgroundGradientTo: '#ffffff',
                                    decimalPlaces: 0,
                                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                }}
                                accessor="population"
                                style={{
                                    borderRadius: 16,
                                    marginTop: 2.5,
                                }}
                            />
                        </View>
                    ) : (
                        <View style={styles.listItem}>
                            <Text style={styles.listItemText}>You have not made any calculations</Text>
                        </View>
                    )}
                </View>
            </View>
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
        borderRadius: 100,
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

export default Usuario;