import { Modal, Text, View, Button, StyleSheet } from 'react-native';

const MensajeAlert = (props) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.visible}
            onRequestClose={props.cerrarModal}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Resultado</Text>
                    <Text style={styles.modalMessage}>{props.mensaje}</Text>
                    <Button title="Cerrar" onPress={props.cerrarModal} color="#607cff" />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
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
});

export default MensajeAlert;