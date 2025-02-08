import { createStackNavigator } from '@react-navigation/stack';
import Favoritos from './Favoritos';
import VerRutina from '../VerRutina';
import VerEjercicio from '../VerEjercicio';
// import Ajustes from '../VerEjercicio';

const Stack = createStackNavigator();

const FavoritosNavegacion = () => (
    <Stack.Navigator options="false">
        <Stack.Screen name="Favoritos" component={Favoritos} options={{ headerShown: false }} />
        <Stack.Screen name="VerRutina" component={VerRutina} options={{ headerShown: false }} />
        <Stack.Screen name="VerEjercicio" component={VerEjercicio} options={{ headerShown: false }} />
        {/* <Stack.Screen name="Ajustes" component={Ajustes} options={{ headerShown: false }} /> */}
    </Stack.Navigator>
);
export default FavoritosNavegacion;