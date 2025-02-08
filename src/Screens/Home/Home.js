import { createStackNavigator } from '@react-navigation/stack';
import { BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Usuario from './Usuario';
import CalcularIMC from "./CalcularIMC";
import CalcularMacros from "./CalcularMacros"
// import Ajustes from '../VerEjercicio';

const Stack = createStackNavigator();

const Home = () => {
    useFocusEffect(() => {
        const backAction = () => {
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    });
    return (
        <Stack.Navigator options="headerShown=false">
            <Stack.Screen name="Usuario" component={Usuario} options={{ headerShown: false }} />
            <Stack.Screen name="CalcularIMC" component={CalcularIMC} options={{ headerShown: false }} />
            <Stack.Screen name="CalcularMacros" component={CalcularMacros} options={{ headerShown: false }} />
            {/* <Stack.Screen name="Ajustes" component={Ajustes} options={{ headerShown: false }} /> */}
        </Stack.Navigator>);
};

export default Home;