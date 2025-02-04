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
const Login = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <View style={styles.container}>
            <View style={styles.subContainer}>
                <Image source={require('../Assets/img/logo.png')} style={styles.image} />
            </View>
            <View style={styles.formContainer}>
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
                </View>

                <View style={styles.optionsContainer}>
                    <Pressable>
                        <Text style={styles.resetPasswordText}>He olvidado la contraseña</Text>
                    </Pressable>
                </View>
            <View style={styles.containerBotones}>
                <View style={styles.subContainer}>
                    <Pressable style={styles.bottom}>
                        <Text style={styles.textLogin}>LOGIN</Text>
                    </Pressable>
                </View>
                <View style={styles.subContainer}>
                    <Pressable style={styles.bottom}>
                        <Text style={styles.textLogin}>REGISTRO</Text>
                    </Pressable>
                </View>
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
        gap: 16, // gap-4
    },
    input: {
        backgroundColor: '#374151', // bg-gray-800
        color: '#F9FAFB', // text-gray-50
        padding: 12, // p-3
        borderRadius: 8, // rounded-lg
        borderColor: "#607cff",
        borderWidth: 1
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 32, // my-8
    },
    resetPasswordText: {
        color: '#F9FAFB', // text-gray-50
        fontWeight: 'bold',
    },
    image: {
        width: 260,
        height: 260,
    },
    bottom: {
        backgroundColor: '#607cff',
        justifyContent: 'center',
        borderWidth: 2,
        borderRadius: 10,
        borderColor: 'black',
        height: 55,
        width: 200,
        alignItems: 'center',
    },
    containerBotones:{
        marginTop:55,
    }
});

export default Login;