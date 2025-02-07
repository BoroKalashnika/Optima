import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from './Utils/Context';
import Login from './Screens/LoginRegistro/Login';
import Registro from './Screens/LoginRegistro/Registro';
import HomeNavegacion from './Screens/Home/HomeNavegacion';
import StacksOlvidadoContraseña from './Screens/OlvidadoContraseña/StacksOlvidadoContraseña';

const Stack = createStackNavigator();

const App = () => {
  return (
    <Provider>
      <NavigationContainer>
        <Stack.Navigator options="false">
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Registro" component={Registro} options={{ headerShown: false }} />
          <Stack.Screen name="HomeNavegacion" component={HomeNavegacion} options={{ headerShown: false }} />
          <Stack.Screen name="StacksOlvidadoContraseña" component={StacksOlvidadoContraseña} options={{ headerShown: false }}/>
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;