import React, { useState } from 'react';
import {
    View,
    Text,
    Pressable,
    TextInput,
    Alert,
    StyleSheet,
    Image,
} from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
const Registro = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repetriContra, setRepetirContras] = useState('');
    const [usuario, setUsuario] = useState('');
    const [peso, setPeso] = useState('');
    const [altura, setAltura] = useState('');
    const data = [
        { key: '1', value: 'principiante' },
        { key: '2', value: 'intermedio' },
        { key: '3', value: 'profesionl' },
    ];
    const { opcion, setOpcion } = useState();

    return (
        <View style={styles.container}>
            <View style={styles.subContainer}>
                <Image source={require('../Assets/img/logo.png')} style={styles.image} />
            </View>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Registro</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Introduce el Email"
                        placeholderTextColor="#9CA3AF"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Introduce la contraseña"
                        placeholderTextColor="#9CA3AF"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Repetir Contraseña"
                        placeholderTextColor="#9CA3AF"
                        value={repetriContra}
                        onChangeText={setRepetirContras}
                        secureTextEntry
                    />
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="Nombre Usuario"
                    placeholderTextColor="#9CA3AF"
                    value={usuario}
                    onChangeText={setUsuario}
                    secureTextEntry
                />
                <View style={styles.containerDatos}>
                    <TextInput
                        style={[styles.input, { width: '49%' }]}
                        placeholder="Altura"
                        placeholderTextColor="#9CA3AF"
                        value={altura}
                        onChangeText={setAltura}
                        secureTextEntry
                    />

                    <TextInput
                        style={[styles.input, { width: '49%' }]}
                        placeholder="Peso"
                        placeholderTextColor="#9CA3AF"
                        value={peso}
                        onChangeText={setPeso}
                        secureTextEntry
                    />
                </View>
                <SelectList
                    setSelected={(val) => setOpcion(val)}
                    data={data}
                    save="value"
                    boxStyles={styles.selectBox}
                    inputStyles={styles.selectInput}
                    dropdownStyles={styles.dropdown}
                    dropdownTextStyles={styles.dropdownText}
                />
                <View style={styles.subContainer}>
                    <Pressable style={styles.bottom}>
                        <Text style={styles.textLogin}>Registrarse</Text>
                    </Pressable>
                    <Pressable>
                        <Text style={styles.resetPasswordText}>Ya tengo cuenta</Text>
                    </Pressable>
                    <Pressable style={styles.bottom}>
                        <Text style={styles.textLogin}>Login</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1F2937', // bg-gray-950
    },
    subContainer: {
        alignItems: 'center',
        marginBottom: 15,
    },
    formContainer: {
        paddingHorizontal: 16, // px-4
        width: '100%',
        maxWidth: 384, // max-w-sm
        color: '#00008B',
    },
    containerDatos: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 48, // text-5xl
        fontWeight: 'bold',
        marginBottom: 24, // mb-6
        color: 'white', // text-gray-50
    },
    textLogin: {
        fontSize: 20,
        color: 'white',
    },
    inputContainer: {
        flexDirection: 'column',
        paddingBottom: 10,
    },
    input: {
        backgroundColor: '#374151', // bg-gray-800
        color: 'white', // text-gray-50
        padding: 12, // p-3
        borderRadius: 8, // rounded-lg
        borderColor: '#607cff',
        borderWidth: 1,
        marginBottom: 10,
        width: '100%',
    },
    resetPasswordText: {
        color: 'white', // text-gray-50
        fontWeight: 'bold',
        fontSize: 17
    },
    image: {
        width: 200,
        height: 200,
    },
    bottom: {
        backgroundColor: '#607cff',
        justifyContent: 'center',
        borderWidth: 2,
        borderRadius: 10,
        borderColor: 'black',
        height: 55,
        width: 160,
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 10
    },
    selectBox: {
        backgroundColor: '#374151', // Gris oscuro
        color: '#F9FAFB', // Texto blanco
        padding: 12,
        borderRadius: 8,
        borderColor: '#607cff',
        borderWidth: 1,
        marginBottom: 10,
        width: '100%',
    },
    selectInput: {
        color: '#C6C6C6', // Texto blanco
        fontSize: 16,
    },
    dropdown: {
        backgroundColor: '#1F2937', // Fondo gris oscuro
        borderColor: '#607cff',
        borderWidth: 1,
        color: '#white', // Texto blanco
    },
    dropdownText: {
        color: '#C6C6C6', // Texto blanco
        fontSize: 14,
    },
});

export default Registro;