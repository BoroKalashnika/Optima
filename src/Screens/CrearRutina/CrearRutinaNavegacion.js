import { createStackNavigator } from '@react-navigation/stack';
import RutinasCreadas from './RutinasCreadas';
import VerRutina from '../VerRutina';
import VerEjercicio from '../VerEjercicio';
// import Ajustes from '../VerEjercicio';
import CrearEjercicio from "./CrearEjercicio"
import CrearRutina from "./CrearRutina"
const Stack = createStackNavigator();

const CrearRutinaNavegacion = () => (
    <Stack.Navigator options="false">
        <Stack.Screen name="RutinasCreadas" component={RutinasCreadas} options={{ headerShown: false }} />
        <Stack.Screen name="CrearRutina" component={CrearRutina} options={{ headerShown: false }} />
        <Stack.Screen name="CrearEjercicio" component={CrearEjercicio} options={{ headerShown: false }} />
        <Stack.Screen name="VerRutina" component={VerRutina} options={{ headerShown: false }} />
        <Stack.Screen name="VerEjercicio" component={VerEjercicio} options={{ headerShown: false }} />
        {/* <Stack.Screen name="Ajustes" component={Ajustes} options={{ headerShown: false }} /> */}
    </Stack.Navigator>
);
export default CrearRutinaNavegacion;