import { createStackNavigator } from '@react-navigation/stack';
import Usuario from './Usuario';
import CalcularIMC from "./CalcularIMC";
import CalcularMacros from "./CalcularMacros"
// import Ajustes from '../VerEjercicio';

const Stack = createStackNavigator();

const Home = () => (
    <Stack.Navigator options="headerShown=false">
        <Stack.Screen name="Usuario" component={Usuario} options={{ headerShown: false }} />
        <Stack.Screen name="CalcularIMC" component={CalcularIMC} options={{ headerShown: false }} />
        <Stack.Screen name="CalcularMacros" component={CalcularMacros} options={{ headerShown: false }} />
        {/* <Stack.Screen name="Ajustes" component={Ajustes} options={{ headerShown: false }} /> */}
    </Stack.Navigator>
);

export default Home;