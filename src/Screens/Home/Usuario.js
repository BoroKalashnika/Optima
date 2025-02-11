import { useContext, useEffect } from 'react';
import Context from '../../Utils/Context';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Card from '../../Components/card/Card';
import HeaderRutina from '../../Components/headerRutina/HeaderRutina';
import getData from '../../Utils/services/getData';
import frasesMotivadoras from '../../Assets/frasesMotivadoras.json';

const Usuario = (props) => {
    const { token, setToken } = useContext(Context);
    const { email, setEmail } = useContext(Context);

    useEffect(() => {
        if (!email) {
            getData('http://13.216.205.228:8080/optima/tokenUsuario?token=' + token).then((response) => {
                setEmail(response.correo)
            });
        }
    }, []);

    function getRandom() {
        let i = 0;
        frasesMotivadoras.frases.forEach(element => {
            i++;
        });
        const random = Math.floor(Math.random() * i);
        return random;
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <HeaderRutina tipo={'user'} />
            <Image source={require('../../Assets/img/perfil.png')} style={styles.profileImage} />
            <Text style={styles.name}>Nombre de Usuario</Text>
            <Text style={styles.frase}>{frasesMotivadoras.frases[getRandom()]}</Text>
            <View style={styles.containerCard}>
                <Card />
            </View>
            <View style={styles.calculadoraContainer}>
                <TouchableOpacity style={styles.calcRow} onPress={() => props.navigation.navigate('CalcularIMC')}>
                    <Text style={styles.calcTitle}>IMC</Text>
                    <Image source={require('../../Assets/img/calculadoraIMC.png')} style={styles.image} />
                </TouchableOpacity>
                <View style={styles.listContainer}>
                    <ScrollView nestedScrollEnabled={true}>
                        {/* MAP PARA RECORRER LISTA DE HISTORICO DEL BACK */}
                        <View style={styles.listItem}>
                            <Text style={styles.listItemText}>Registro 1</Text>
                        </View>
                        <View style={styles.listItem}>
                            <Text style={styles.listItemText}>Registro 2</Text>
                        </View>
                        <View style={styles.listItem}>
                            <Text style={styles.listItemText}>Registro 3</Text>
                        </View>
                        <View style={styles.listItem}>
                            <Text style={styles.listItemText}>Registro 3</Text>
                        </View>
                        <View style={styles.listItem}>
                            <Text style={styles.listItemText}>Registro 3</Text>
                        </View>
                        <View style={styles.listItem}>
                            <Text style={styles.listItemText}>Registro 3</Text>
                        </View>
                        <View style={styles.listItem}>
                            <Text style={styles.listItemText}>Registro 3</Text>
                        </View>
                        <View style={styles.listItem}>
                            <Text style={styles.listItemText}>Registro 3</Text>
                        </View>
                        <View style={styles.listItem}>
                            <Text style={styles.listItemText}>Registro 3</Text>
                        </View>
                    </ScrollView>
                </View>
                <TouchableOpacity style={styles.calcRow} onPress={() => props.navigation.navigate('CalcularMacros')}>
                    <Text style={styles.calcTitle}>Macros</Text>
                    <Image source={require('../../Assets/img/calculadoraMacros.png')} style={styles.image} />
                </TouchableOpacity>
                <View style={styles.listContainer}>
                    <ScrollView nestedScrollEnabled={true}>
                        {/* MAP PARA RECORRER LISTA DE HISTORICO DEL BACK */}
                        <View style={styles.listItem}>
                            <Text style={styles.listItemText}>Registro 1</Text>
                        </View>
                        <View style={styles.listItem}>
                            <Text style={styles.listItemText}>Registro 2</Text>
                        </View>
                        <View style={styles.listItem}>
                            <Text style={styles.listItemText}>Registro 3</Text>
                        </View>
                        <View style={styles.listItem}>
                            <Text style={styles.listItemText}>Registro 3</Text>
                        </View>
                        <View style={styles.listItem}>
                            <Text style={styles.listItemText}>Registro 3</Text>
                        </View>
                        <View style={styles.listItem}>
                            <Text style={styles.listItemText}>Registro 3</Text>
                        </View>
                        <View style={styles.listItem}>
                            <Text style={styles.listItemText}>Registro 3</Text>
                        </View>
                        <View style={styles.listItem}>
                            <Text style={styles.listItemText}>Registro 3</Text>
                        </View>
                        <View style={styles.listItem}>
                            <Text style={styles.listItemText}>Registro 3</Text>
                        </View>
                    </ScrollView>
                </View>
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
        width: 185,
        height: 185,
        borderRadius: 50,
        marginTop: 10,
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
    calculadoraContainer: {
        width: '105%',
        marginTop: 20,
    },
    calcRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '90%',
        padding: 10,
        backgroundColor: '#2D3748',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        alignSelf: 'center',
    },
    calcTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#bbdefb',
        marginRight: 10,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 10,
    },
    listContainer: {
        width: '90%',
        maxHeight: 180,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor: '#607cff',
        marginBottom: 10,
        alignSelf: 'center',
    },
    listItem: {
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#ffffff55',
    },
    listItemText: {
        color: '#fff',
        fontSize: 16,
    },
    frase: {
        marginTop: 30,
        fontSize: 22,
        fontWeight: '500',
        fontStyle: 'italic',
        color: 'white',
        textAlign: 'center',
    }
});

export default Usuario;