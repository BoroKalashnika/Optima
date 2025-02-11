import { Text, StyleSheet, View, Image, Pressable } from 'react-native';
import React, { useContext } from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import Context from '../../Utils/Context';
import deleteData from '../../Utils/services/deleteData';

const CardEjercicio = (props) => {
    const { idEjercicios, setIdEjercicios } = useContext(Context);
    const { token } = useContext(Context);
    const { nombre, descripcion, imagen, idEjercicio, borrarEnabled } = props;

    const borrarEjercicio = async () => {
        try {
            const response = await deleteData(`http://13.216.205.228:8080/optima/eliminarEjercicio?token=${token}&id=${idEjercicio}`);

            if (response) {
                const updatedEjercicios = idEjercicios.filter((ejercicioId) => ejercicioId !== idEjercicio);
                setIdEjercicios(updatedEjercicios);
                console.log('Exercise deleted:', idEjercicio); 
            }
        } catch (error) {
            console.log('Error deleting exercise:', error);
        }
    }

    return (
        <Pressable onPress={props.onEjercicio}>
            <View style={styles.container}>
                <View style={styles.containerDescripcion}>
                    <Text style={styles.title}>nombre</Text>
                    <Text style={styles.text}>descripcion</Text>
                </View>
                <Image source={require('../../Assets/img/logo.png')} style={styles.image} />

                {borrarEnabled && (
                    <Icon name="delete" size={25} color="red" onPress={borrarEjercicio} />
                )}
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#003247',
        borderColor: '#607cff',
        borderWidth: 2,
        borderRadius: 10,
        paddingRight: 5,
        marginBottom: 10, // Espacio entre las cards
    },
    containerDescripcion: {
        flex: 2,
        padding: 20,
    },
    title: {
        fontSize: 37,
        color: 'white',
    },
    text: {
        fontSize: 20,
        color: 'white',
    },
    image: {
        width: '40%',
        height: '90%',
        marginTop: 10,
        paddingRight: 10,
    },
});

export default CardEjercicio;