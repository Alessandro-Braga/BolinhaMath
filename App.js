import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import StoryModeScreen from './StoryModeScreen';
import StoryModeScreen2 from './StoryModeScreen2';
import StoryModeScreen3 from './StoryModeScreen3';
import ArcadeModeScreen from './ArcadeModeScreen';
import DailyModeScreen from './DailyModeScreen';

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>BolinhaMath 🔴</Text>
      <Text style={styles.subtitle}>Escolha o modo de jogo:</Text>

      <TouchableOpacity 
        style={[styles.button, styles.storyButton]} 
        onPress={() => navigation.navigate('StoryMode')}>
        <Text style={styles.buttonText}>📖 Modo História</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.arcadeButton]} 
        onPress={() => navigation.navigate('ArcadeMode')}>
        <Text style={styles.buttonText}>🕹️ Modo Arcade / Treino</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.dailyButton]} 
        onPress={() => navigation.navigate('DailyMode')}>
        <Text style={styles.buttonText}>📅 Desafio Diário</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="StoryMode" component={StoryModeScreen} options={{ headerShown: true, title: 'Fase 1' }} />
<Stack.Screen name="StoryMode2" component={StoryModeScreen2} options={{ headerShown: true, title: 'Fase 2' }} />
<Stack.Screen name="StoryMode3" component={StoryModeScreen3} options={{ headerShown: true, title: 'Fase 3' }} />
        <Stack.Screen name="ArcadeMode" component={ArcadeModeScreen} />
        <Stack.Screen name="DailyMode" component={DailyModeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e272e',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#d2dae2',
    marginBottom: 35,
    textAlign: 'center',
  },
  button: {
    width: '85%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  storyButton: {
    backgroundColor: '#ff4757',
  },
  arcadeButton: {
    backgroundColor: '#0052cc',
  },
  dailyButton: {
    backgroundColor: '#f1c40f',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});