import { createStackNavigator } from '@react-navigation/stack';
import RestablecerContra from './RestablecerContra';
import Correo from './Correo';
import Codigo from './Codigo';

const Stack = createStackNavigator();

const StacksOlvidadoContraseña = () => (
    <Stack.Navigator options="false">
      <Stack.Screen name="Correo" component={Correo} options={{ headerShown: false }}/>
      <Stack.Screen name="Codigo" component={Codigo} options={{ headerShown: false }}/>
      <Stack.Screen name="RestablecerContra" component={RestablecerContra} options={{ headerShown: false }}/>
    </Stack.Navigator>
);
export default StacksOlvidadoContraseña;