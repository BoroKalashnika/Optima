import { createStackNavigator } from '@react-navigation/stack';
import { BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Usuario from './Usuario';
import CalcularIMC from "./CalcularIMC";
import CalcularMacros from "./CalcularMacros"
import BuscarNavegacion from "../ListasScreens/BuscarNavegacion";
import VerRutina from '../VerRutina';
import VerEjercicio from '../VerEjercicio';
// import Ajustes from '../VerEjercicio';

const Stack = createStackNavigator();

const Home = () => {
    return (
        <Stack.Navigator options="headerShown=false">
            <Stack.Screen name="Usuario" component={Usuario} options={{ headerShown: false }} />
            <Stack.Screen name="CalcularIMC" component={CalcularIMC} options={{ headerShown: false }} />
            <Stack.Screen name="CalcularMacros" component={CalcularMacros} options={{ headerShown: false }} />
            <Stack.Screen name="BuscarNavegacion" component={BuscarNavegacion} options={{ headerShown: false }} />
            <Stack.Screen name="VerRutina" component={VerRutina} options={{ headerShown: false }} />
            <Stack.Screen name="VerEjercicio" component={VerEjercicio} options={{ headerShown: false }} />
            {/* <Stack.Screen name="Ajustes" component={Ajustes} options={{ headerShown: false }} /> */}
        </Stack.Navigator>);
};

export default Home;