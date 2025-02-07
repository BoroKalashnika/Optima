import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Home from './Home';
import Buscar from './Buscar';
import CrearRutinaNavegacion from '../CrearRutina/CrearRutinaNavegacion';
import FavoritosNavegacion from '../Favoritos/FavoritosNavegacion';

const Tab = createBottomTabNavigator();

const HomeNavegacion = (props) => {
    return (
        <Tab.Navigator screenOptions={{
            tabBarStyle: {
                backgroundColor: '#101037',
                borderTopWidth: 0,
            },
            tabBarActiveTintColor: '#607cff',
            tabBarInactiveTintColor: '#cdcdcd',
        }}>
            <Tab.Screen
                name="Home" component={Home} options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
                    ), headerShown: false
                }}
            />
            <Tab.Screen
                name="Buscar" component={Buscar} options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="search" size={size} color={color} />
                    ),
                    headerShown: false
                }}
            />
            <Tab.Screen
                name="Crear" component={CrearRutinaNavegacion} options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="add" size={size} color={color} />
                    ),
                    headerShown: false
                }}

            />
            <Tab.Screen
                name="Favoritos" component={FavoritosNavegacion} options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="heart" size={size} color={color} />
                    ),
                    headerShown: false
                }}
            />
        </Tab.Navigator>
    );
}

export default HomeNavegacion;