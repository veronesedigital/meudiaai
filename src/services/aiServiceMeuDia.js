import { httpsCallable } from 'firebase/functions';
import { functions } from './firebaseConfig';

export const generateDailyForecast = async (userData) => {
  try {
    const generateForecastFn = httpsCallable(functions, 'generateDailyForecast', { timeout: 300000 });
    const response = await generateForecastFn({ userData });
    return response.data.result;
  } catch (error) {
    if (error.code) {
      throw new Error(`Falha no servidor da IA: ${error.code} - ${error.message}`);
    }

    if (error.message?.includes('network')) {
      throw new Error('Erro de rede: O aplicativo está sem internet ou bloqueando a conexão.');
    }

    throw new Error('Erro interno: ' + error.message);
  }
};
