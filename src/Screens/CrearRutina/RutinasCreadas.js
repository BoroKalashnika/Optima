import { FlatList, View, Image, StyleSheet, Text, Pressable, Modal } from 'react-native';
import { Button } from 'react-native-paper';
import { useState, useContext, useEffect } from 'react';
import Card from '../../Components/card/Card';
import HeaderRutina from '../../Components/headerRutina/HeaderRutina';
import Icon from 'react-native-vector-icons/Ionicons';
import getData from '../../Utils/services/getData';
import Context from '../../Utils/Context';


const Buscar = (props) => {
    const { token, setToken } = useContext(Context);
    const { modalVisible, setModalVisible } = useContext(Context);
    const { alertMessage, setAlertMessage } = useContext(Context);
    const { alertTitle, setAlertTitle } = useContext(Context);
    const [rutinas, setRutinas] = useState([]);
    const [paginasTotal, setPaginasTotal] = useState();
    const [paginActual, setPaginActual] = useState(1);
    const [indiceActual, setIndiceActual] = useState(1);
    const [indiceFinal, setIndiceFinal] = useState(2);


    useEffect(() => {
        getRutinas();
        
    }, [rutinas])

    const getRutinas = async () => {
        const usuario = await getData('http://13.216.205.228:8080/optima/tokenUsuario?token=' + token);
        getData('http://13.216.205.228:8080/optima/obtenerRutinasCreadas?token=' + token + "&idUsuario=" + usuario.id + "&index=" + indiceActual + "&offset=" + indiceFinal).then((element) => {
            console.log(element);
            setPaginasTotal(Math.ceil(element.count / 10));
            const newArray = [];
            element.rutinas.map((rutina) => {
                if (rutina.nombreRutina !== "$$crea$$") { newArray.push(rutina) }
            })
            setRutinas(newArray);
        });
    }

    const handleNext=()=>{
        setIndiceActual+=10;
        setIndiceFinal+=10;
    }
    const handlePrevious=()=>{
        setIndiceActual-=10;
        setIndiceFinal-=10;
    }

    return (
        <View style={styles.container}>
            <HeaderRutina tipo={'ajustes'} titulo={'Rutinas Creadas'} />
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
            <View style={styles.subContainer}>
                {paginActual > 1 && (
                    <Pressable style={[styles.bottom, { marginRight: 5 }]} onPress={() => handlePrevious()}>
                        <Text style={styles.resetPasswordText}>Atras</Text>
                    </Pressable>
                )}
                {paginActual < paginasTotal && (
                    <Pressable
                        style={[styles.bottom, { marginLeft: 5 }]}
                        onPress={() => handleNext()}>
                        <Text style={styles.resetPasswordText}>Siguiente</Text>
                    </Pressable>
                )}
            </View>
            <Pressable style={styles.containerCrear} onPress={() => props.navigation.navigate('CrearRutina')}>
                <Icon name="add-circle-outline" color="#607cff" size={50} style={{ marginHorizontal: "7%" }} /><Text style={styles.text}>Crear Rutina</Text>
            </Pressable>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>{alertTitle}</Text>
                        <Text style={styles.modalMessage}>{alertMessage}</Text>
                        <Button mode="contained" onPress={() => setModalVisible(false)} style={styles.modalButton}>
                            Cerrar
                        </Button>
                    </View>
                </View>
            </Modal>
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
    subContainer: {
        flexDirection: 'row',
        marginTop: 5,
        marginBottom: 10,
        padding: 5
    },
    containerCrear: {
        width: '90%',
        flexDirection: 'row',
        borderColor: '#607cff',
        borderRadius: 30,
        borderWidth: 2,
        marginBottom: 20,
        alignItems: "center",
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
    text: {
        fontSize: 30,
        color: 'white',
        textAlign: 'center'
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#0d47a1',
        marginBottom: 10,
    },

    modalMessage: {
        fontSize: 16,
        color: '#333333',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButton: {
        backgroundColor: '#607cff',
    },
    bottom: {
        backgroundColor: '#607cff',
        justifyContent: 'center',
        borderWidth: 2,
        borderRadius: 10,
        borderColor: 'black',
        height: 55,
        width: 'auto',
        alignItems: 'center',
        marginTop: 5,
        flexDirection: 'row',
        flex: 1
    },
});

export default Buscar;