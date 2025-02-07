import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import Card from '../../Components/card/Card';

const Usuario = (props) => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image source={require('../../Assets/img/logo.png')} style={styles.topImage} />
            <Image source={require('../../Assets/img/perfil.png')} style={styles.profileImage} />
            <Text style={styles.name}>Nombre de Usuario</Text>
            <View style={styles.containerCard}>
                <Card />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#1F2937',
    },
    topImage: {
        width: 80,
        height: 80,
        position: 'absolute',
        top: 10,
        left: 10,
    },
    profileImage: {
        width: 175,
        height: 175,
        borderRadius: 50,
        marginTop: 60,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#bbdefb',
    },
    containerCard: {
        width: '90%',
        marginTop: 15,
    },
});

export default Usuario;