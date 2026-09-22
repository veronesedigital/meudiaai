import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';

// Configuração do projeto Firebase (participa-ai-83641)
// O appId web pode ser encontrado em: Firebase Console → Project Settings → Your apps → Web app
const firebaseConfig = {
  apiKey: 'AIzaSyDeHTM2pDEYs3wfY7xgXPhuiwPxbzjrarQ',
  authDomain: 'meu-dia-ai.firebaseapp.com',
  projectId: 'meu-dia-ai',
  storageBucket: 'meu-dia-ai.firebasestorage.app',
  messagingSenderId: '857099851799',
  appId: '1:857099851799:android:e1c5308c35ae8858702452',
};

// Evita inicializar o app mais de uma vez (hot reload)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const functions = getFunctions(app, 'southamerica-east1');
