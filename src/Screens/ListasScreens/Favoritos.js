import { FlatList, View, Image, StyleSheet, Text } from 'react-native';
import Card from '../../Components/card/Card';
import HeaderRutina from '../../Components/headerRutina/HeaderRutina';
import getData from '../../Utils/services/getData';
import Context from '../../Utils/Context';
import { useState, useEffect, useContext, useCallback } from 'react';
import config from '../../config/config';
const Favoritos = (props) => {
    const [rutinas, setRutinas] = useState();
    const { token, setToken } = useContext(Context);
    const [contador, setContador] = useState();

    useEffect(() => {
        getRutinasFavoritas();
    }, [rutinas])

    const getRutinasFavoritas = async () => {
        try {
            // Obtener la respuesta inicial con los IDs de las rutinas favoritas
            const response = await getData(config.API_OPTIMA + 'tokenUsuario?token=' + token);
            const newArray = [];
            console.log(response);
            if (response.rutinasGuardadas != null && response.rutinasGuardadas.length > 0) {
                const rutinasPromises = response.rutinasGuardadas.map(async (element) => {
                    const rutinaResponse = await getData(config.API_OPTIMA + 'obtenerRutina?token=' + token + '&id=' + element);
                    newArray.push(rutinaResponse);
                });

                // Esperar que todas las promesas se resuelvan
                await Promise.all(rutinasPromises);
            }

            //console.log('Rutinas completas:', newArray);
            setRutinas(newArray);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
        console.log(rutinas.length);
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