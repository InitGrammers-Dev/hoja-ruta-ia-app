import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Alert,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { generateRoadmap } from '@/src/api';

export default function HomeScreen() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const theme = useColorScheme();
  const isDark = theme === 'dark';

  const onGenerate = async () => {
    if (topic.trim().length < 3) {
      Alert.alert('Error', 'Escribe un tema de al menos 3 caracteres');
      return;
    }
    try {
      setLoading(true);
      const roadmap = await generateRoadmap(topic.trim());
      setLoading(false);
      setTopic('');
      router.push({
        pathname: '/roadmap',
        params: { roadmap: JSON.stringify(roadmap) },
      });
    } catch (err: any) {
      setLoading(false);
      Alert.alert('Error', err.message || 'Error al generar roadmap');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f2f2f2' }]}>
      <Image
        source={require('@/assets/images/idea.svg')}
        style={styles.image}
        contentFit="contain"
      />

      <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
        Generador de Hojas de Ruta con IA
      </Text>
      <Text style={[styles.subtitle, { color: isDark ? '#aaa' : '#444' }]}>
        Escribe un tema de tecnología y genera una hoja de ruta personalizada para aprender paso a paso.
      </Text>

      <TextInput
        style={[
          styles.input,
          {
            color: isDark ? '#fff' : '#000',
            borderColor: isDark ? '#555' : '#ccc',
            backgroundColor: isDark ? '#222' : '#fff',
          },
        ]}
        placeholder="Ej: React, Machine Learning"
        value={topic}
        onChangeText={setTopic}
        editable={!loading}
        placeholderTextColor={isDark ? '#aaa' : '#666'}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <TouchableOpacity
          onPress={onGenerate}
          style={styles.button}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Generar roadmap</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
    fontSize: 16,
    width: '100%',
  },
  button: {
    width: '100%',
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
