import { createStackNavigator } from '@react-navigation/stack';
import VerRutina from '../VerRutina';
import Buscar from './Buscar'
import VerEjercicio from '../VerEjercicio';
// import Ajustes from '../VerEjercicio';

const Stack = createStackNavigator();

const BuscarNavegacion = () => (
    <Stack.Navigator options="headerShown=false">
        <Stack.Screen name="Buscar" component={Buscar} options={{ headerShown: false }} />
        <Stack.Screen name="VerRutina" component={VerRutina} options={{ headerShown: false }} />
        <Stack.Screen name="VerEjercicio" component={VerEjercicio} options={{ headerShown: false }} />
        {/* <Stack.Screen name="Ajustes" component={Ajustes} options={{ headerShown: false }} /> */}
    </Stack.Navigator>
);
export default BuscarNavegacion;