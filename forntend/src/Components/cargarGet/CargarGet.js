import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';

const Carga = () => {
    return (
        <View style={styles.containerCarga}>
            <ActivityIndicator animating={true} color={MD2Colors.blue700} size={50} />
            <Text style={styles.title}>Loading...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    containerCarga: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#1F2937',
    },
    title: {
        fontSize: 20,
        color:'white',
    }
});

export default Carga;