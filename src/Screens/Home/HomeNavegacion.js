import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Home from './Home';
import Buscar from './Buscar';
import CrearRutinaNavegacion from '../CrearRutina/CrearRutinaNavegacion';
import FavoritosNavegacion from '../Favoritos/FavoritosNavegacion';

const Tab = createBottomTabNavigator();

const HomeNavegacion = (props) => {
    return (
        <Tab.Navigator>
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
                name="CrearRutinaNavegacion" component={CrearRutinaNavegacion} options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="add" size={size} color={color} />
                    ),
                    headerShown: false
                }}

            />
            <Tab.Screen
                name="FavoritosNavegacion" component={FavoritosNavegacion} options={{
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