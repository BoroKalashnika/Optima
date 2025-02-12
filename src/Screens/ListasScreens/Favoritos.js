import { FlatList, View, Image, StyleSheet, Text } from 'react-native';
import Card from '../../Components/card/Card';
import HeaderRutina from '../../Components/headerRutina/HeaderRutina';
import getData from '../../Utils/services/getData';
import Context from '../../Utils/Context';
import { useFocusEffect } from '@react-navigation/native';
import { useState, useContext, useCallback } from 'react';
import config from '../../config/config';

const Favoritos = (props) => {
    const [rutinas, setRutinas] = useState();
    const { token, setToken } = useContext(Context);
    const { idRutina, setIdRutina } = useContext(Context);

    useFocusEffect(
        useCallback(() => {
            getRutinasFavoritas();
        }, [])
    );

    const getRutinasFavoritas = async () => {
        try {
            const response = await getData(config.API_OPTIMA + 'tokenUsuario?token=' + token);
            const newArray = [];
            let llamadasRutina = response.rutinasGuardadas.map((element) => getData(config.API_OPTIMA + 'obtenerRutina?token=' + token + '&id=' + element));
            Promise.all(llamadasRutina).then((element) => {
                element.map((rutina) => {
                    newArray.push(rutina);
                })
                setRutinas(newArray);
            })
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <View style={styles.container}>
            <HeaderRutina tipo={'ajustes'} titulo={'Tus Favoritos'} />
            {/* onPress={()=> props.navigation.navigate('Ajustes')} */}
            <View style={{ flex: 7, marginBottom: 20, width: '85%' }}>
                <Text style={styles.textRutinas}> ───── Rutinas ─────</Text>
                <FlatList
                    data={rutinas}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <Card
                            dificultad={item.dificultad}
                            ambito={item.ambito}
                            imagen={item.vistaPrevia}
                            musculo={item.grupoMuscular}
                            estrellas={item.valoracion}
                            titulo={item.nombreRutina}
                            onRutina={() => {
                                props.navigation.navigate('VerRutina');
                                setIdRutina(item.id);
                            }}
                        />
                    )}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1F2937', // bg-gray-950
        alignItems: "center"
    },
    containerRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 30,
        width: '100%',
    },
    image: {
        width: 100,
        height: 100,
    },
    title: {
        fontSize: 30,
        textAlign: 'center',
        color: 'white',
    },
    textRutinas: {
        fontSize: 25,
        width: "100%",
        color: 'white',
        padding: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        textAlign: "center"
    },
});

export default Favoritos;