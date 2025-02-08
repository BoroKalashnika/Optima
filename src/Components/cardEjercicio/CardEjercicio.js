import { Text, StyleSheet, View, Image, Pressable } from 'react-native';

const CardEjercicio = (props) => {
    const { nombre, descripcion, imagen } = props;

    return (
        <Pressable onPress={props.onEjercicio}>
            <View style={styles.container}>
                <View style={styles.containerDescripcion}>
                    <Text style={styles.title}>nombre</Text>
                    <Text style={styles.text}>descripcion</Text>
                </View>
                <Image source={require('../../Assets/img/logo.png')} style={styles.image} />
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