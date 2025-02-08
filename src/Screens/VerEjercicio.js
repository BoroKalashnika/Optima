import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

const VerEjercicio = (props) => {

    return (
        <View style={styles.container}>
            <View style={styles.containerRow}>
                <Text style={styles.title}> Nombre del Ejercicio</Text>
            </View>
            <View style={styles.containerVideo}></View>
            <View style={styles.containerDescripcion}></View>
            <View style={styles.containerRow}>
                <Text style={styles.textLogin}>Musculo: Pecho</Text>
                <Text style={styles.textLogin}>Densidad: Media</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: '#1F2937',
        padding: 10,
    },
    containerDescripcion: {
        flex: 2,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: '#607cff',
        marginTop: 10,
    },
    containerVideo: {
        flex: 4,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: '#607cff',
        marginTop: 10,
    },
    containerRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#003247',
        padding: 2,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: '#607cff',
        marginTop: 15,
    },
    textLogin: {
        fontSize: 20,
        color: 'white',
    },
    title: {
        fontSize: 30,
        color: 'white',
    },
});

export default VerEjercicio;