import { FlatList, View, Image, StyleSheet, Text } from 'react-native';
import Card from '../../Components/card/Card';
import HeaderRutina from '../../Components/headerRutina/HeaderRutina';

const data = [
    {
        id: '1',
        nombre: 'Ejercicio 1',
        descripcion: 'Descripción del ejercicio 1',
        imagen: require('../../Assets/img/logo.png'),
    },
    {
        id: '2',
        nombre: 'Ejercicio 2',
        descripcion: 'Descripción del ejercicio 2',
        imagen: require('../../Assets/img/logo.png'),
    },
    {
        id: '3',
        nombre: 'Ejercicio 3',
        descripcion: 'Descripción del ejercicio 3',
        imagen: require('../../Assets/img/logo.png'),
    },
    {
        id: '4',
        nombre: 'Ejercicio 4',
        descripcion: 'Descripción del ejercicio 4',
        imagen: require('../../Assets/img/logo.png'),
    },
    {
        id: '5',
        nombre: 'Ejercicio 5',
        descripcion: 'Descripción del ejercicio 5',
        imagen: require('../../Assets/img/logo.png'),
    },
    {
        id: '6',
        nombre: 'Ejercicio 5',
        descripcion: 'Descripción del ejercicio 5',
        imagen: require('../../Assets/img/logo.png'),
    },
    {
        id: '7',
        nombre: 'Ejercicio 5',
        descripcion: 'Descripción del ejercicio 5',
        imagen: require('../../Assets/img/logo.png'),
    },
];
const Buscar = (props) => {
    return (
        <View style={styles.container}>
            <HeaderRutina tipo={'ajustes'} titulo={'Buscar Rutinas'}/>
                {/* onPress={()=> props.navigation.navigate('Ajustes')} */}
            
            <View style={{ flex: 7, marginBottom: 20, width: '85%' }}>
                <Text style={styles.textRutinas}> ───── Rutinas ─────</Text>
                {/* <FlatList
                    data={data}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <Card
                            nombre={item.nombre}
                            descripcion={item.descripcion}
                            imagen={item.imagen}
                            onRutina={() => {
                                props.navigation.navigate('VerRutina');
                            }}
                        />
                    )}
                /> */}
            </View>
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
        justifyContent:'space-around',
        alignItems: 'center',
        marginTop: 30,
        width: '100%',
    },
    image: {
        width: 100,
        height: 100,
    },
    title: {
        fontSize: 30,
        textAlign:'center',
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
});

export default Buscar;