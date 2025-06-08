import { Text, StyleSheet, View, Image, Pressable, Alert } from 'react-native';
import { useContext } from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import Context from '../../Utils/Context';
import deleteData from '../../Utils/services/deleteData';
import Carga from '../../Components/carga/Carga';
import config from '../../config/config';

const CardEjercicio = (props) => {
    const { token } = useContext(Context);
    const { nombre, descripcion, imagen, idEjercicio, borrarEnabled, onDelete } = props;
    const { loading, setLoading } = useContext(Context);

    const borrarEjercicio = async () => {
        setLoading(true);
        const response = await deleteData(config.API_OPTIMA + 'eliminarEjercicio?token=' + token + '&id=' + idEjercicio, setLoading);
        if (response.status === 200) {
            onDelete();
        } else {
            Alert.alert("Error", response.message);
        }
        setLoading(false);
    }

    if (loading) {
        return (
            <Carga />
        );
    }
    return (
        <Pressable onPress={props.onEjercicio}>
            <View style={styles.container}>
                <View style={styles.containerDescripcion}>
                    <Text style={styles.title}>{nombre}</Text>
                    <Text style={styles.text}>{descripcion}</Text>
                </View>
                <Image source={{ uri: imagen }} style={styles.image} />

                {borrarEnabled && (
                    <Icon name="delete" size={25} color="red" onPress={() => borrarEjercicio()} />
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
        marginBottom: 10,
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