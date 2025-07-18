import { FlatList, View, StyleSheet, Text, Pressable, Modal } from 'react-native';
import { Button, Divider } from 'react-native-paper';
import { useState, useContext, useCallback } from 'react';
import Card from '../../Components/card/Card';
import HeaderRutina from '../../Components/headerRutina/HeaderRutina';
import Icon from 'react-native-vector-icons/Ionicons';
import getData from '../../Utils/services/getData';
import Context from '../../Utils/Context';
import { useFocusEffect } from '@react-navigation/native';
import config from '../../config/config';

const Buscar = (props) => {
    const { token } = useContext(Context);
    const { modalVisible, setModalVisible } = useContext(Context);
    const { alertMessage } = useContext(Context);
    const { alertTitle } = useContext(Context);
    const { setIdRutina } = useContext(Context);
    const [rutinas, setRutinas] = useState([]);

    useFocusEffect(
        useCallback(() => {
            getRutinas();
        }, [])
    );

    const getRutinas = async () => {
        const usuario = await getData(config.API_OPTIMA + 'tokenUsuario?token=' + token);
        const response = await getData(config.API_OPTIMA + 'obtenerRutinasCreadas?token=' + token + "&idUsuario=" + usuario.id);
        setRutinas(response.rutinas.filter(rutina => rutina.nombreRutina !== config.CREA_RUTINA));
    }

    return (
        <View style={styles.container}>
            <HeaderRutina tipo={'ajustes'} titulo={'Created Routines'} onAjustes={() => props.navigation.navigate("Ajustes")} onHome={() => props.navigation.navigate("Home")} />
            <View style={{ flex: 7, marginBottom: 20, width: '85%' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                    <View style={{ flex: 1, height: 2, backgroundColor: 'white' }} />
                    <Text style={{ marginHorizontal: 10, fontSize: 25, color: 'white' }}>Routines</Text>
                    <View style={{ flex: 1, height: 2, backgroundColor: 'white' }} />
                </View>
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
            <Pressable style={styles.containerCrear} onPress={() => props.navigation.navigate('CrearRutina')}>
                <Icon name="add-circle-outline" color="#607cff" size={50} style={{ marginHorizontal: "7%" }} /><Text style={styles.text}>Create Routine</Text>
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
                            Close
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
        backgroundColor: '#1F2937',
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
});

export default Buscar;