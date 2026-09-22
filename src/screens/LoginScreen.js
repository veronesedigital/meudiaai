import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';

export default function LoginScreen({ onLoginSuccess }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '857099851799-apis4443ol9gr7nh5peq3kggkgdm6mi0.apps.googleusercontent.com',
    });
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      
      const ambiente = process.env.EXPO_PUBLIC_AMBIENTE;

      if (ambiente === 'desenvolvimento') {
        // Simulação rápida de login para desenvolvimento
        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess({ user: { name: 'Usuário Teste' } });
          }
        }, 500);
      } else {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        await GoogleSignin.signOut();
        const userInfo = await GoogleSignin.signIn();
        
        // --- NOVO: Autenticar no Firebase com a credencial do Google ---
        const credential = GoogleAuthProvider.credential(userInfo.data.idToken);
        const userCredential = await signInWithCredential(auth, credential);

        // Login com sucesso no Firebase, avança para a próxima tela
        if (onLoginSuccess) {
          onLoginSuccess(userCredential);
        }
      }

    } catch (error) {
      console.error('Erro no login com Google/Firebase:', error);
      setLoading(false);
      Alert.alert('Erro no Login', 'Não foi possível concluir o login com o Google. Tente novamente.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/meu-dia-ai.jpeg')}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View style={styles.loginContainer}>
        <Text style={styles.title}>Meu Dia AI</Text>
        <Text style={styles.subtitle}>Sou uma AI especialista em astrologia psicológica e humanista, e vou dar dicas incríveis para você planejar o seu dia</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#7b61ff" />
        ) : (
          <TouchableOpacity style={styles.googleButton} onPress={signInWithGoogle}>
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/300/300221.png' }}
              style={styles.googleIcon}
            />
            <Text style={styles.googleButtonText}>Entrar com o Google</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    flex: 1.5,
    width: '100%',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
    backgroundColor: '#e1e4e8',
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  loginContainer: {
    flex: 1,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ddd',
    width: '100%',
    justifyContent: 'center',
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});