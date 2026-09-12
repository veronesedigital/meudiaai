import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './src/screens/LoginScreen';
import DailyProfileScreen from './src/screens/DailyProfileScreen';
import DailyForecastResultScreen from './src/screens/DailyForecastResultScreen';
import DonationScreen from './src/screens/DonationScreen';
import { generateDailyForecast } from './src/services/aiServiceMeuDia';

const DONATION_WINDOW_START_DAY = 7;
const DONATION_WINDOW_END_DAY = 10;
const DONATION_ACCESS_KEY = 'donationAccessDate';

const getDateKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const normalizeUser = (userData) => {
  const user = userData?.user || userData || {};
  return {
    ...userData,
    ...user,
    email: (user.email || userData?.email || '').trim().toLowerCase(),
    name: user.name || user.displayName || userData?.name || 'Usuário',
  };
};

const getForecastKey = (email) => `forecast_${(email || '').trim().toLowerCase()}`;

const getTodayForecast = async (email) => {
  if (!email) return null;

  try {
    const value = await AsyncStorage.getItem(getForecastKey(email));
    if (!value) return null;

    const parsed = JSON.parse(value);
    if (!parsed || parsed.date !== getDateKey()) {
      return null;
    }

    return parsed;
  } catch (error) {
    console.error('Error reading local forecast:', error);
    return null;
  }
};

const saveTodayForecast = async (email, content) => {
  if (!email) return;

  const payload = JSON.stringify({
    date: getDateKey(),
    email: email.trim().toLowerCase(),
    content,
  });

  await AsyncStorage.setItem(getForecastKey(email), payload);
};

const isWithinDonationWindow = (date = new Date()) => {
  const day = date.getDate();
  return day >= DONATION_WINDOW_START_DAY && day <= DONATION_WINDOW_END_DAY;
};

const canShowDonationToday = async () => {
  const todayKey = getDateKey();

  if (!isWithinDonationWindow(new Date())) {
    return false;
  }

  const lastDonationAccessDate = await AsyncStorage.getItem(DONATION_ACCESS_KEY);

  if (lastDonationAccessDate === todayKey) {
    return false;
  }

  await AsyncStorage.setItem(DONATION_ACCESS_KEY, todayKey);
  return true;
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [userInfo, setUserInfo] = useState(null);
  const [forecastContent, setForecastContent] = useState('');
  const [showBackButton, setShowBackButton] = useState(true);

  const handleLoginSuccess = async (userData) => {
    const normalizedUser = normalizeUser(userData);
    setUserInfo(normalizedUser);

    const savedForecast = await getTodayForecast(normalizedUser.email);
    if (savedForecast?.content) {
      setForecastContent(savedForecast.content);
      setShowBackButton(false);
      setCurrentScreen('forecast');
      return;
    }

    setForecastContent('');
    setShowBackButton(true);
    setCurrentScreen('profile');
  };

  const handleGenerateForecast = async ({ nome, dataNascimento, estadoCivil, orientacaoSexual }) => {
    const email = userInfo?.email;

    const existingForecast = await getTodayForecast(email);
    if (existingForecast?.content) {
      setForecastContent(existingForecast.content);
      setShowBackButton(false);
      setCurrentScreen('forecast');
      return;
    }

    try {
      const result = await generateDailyForecast({
        nome,
        dataNascimento,
        estadoCivil,
        orientacaoSexual,
      });

      if (!result) {
        throw new Error('Sem retorno da API');
      }

      await saveTodayForecast(email, result);
      setForecastContent(result);
      setShowBackButton(true);
      setCurrentScreen('forecast');
    } catch (error) {
      console.error('Forecast generation error:', error);
      setForecastContent('');
      setShowBackButton(true);
      setCurrentScreen('profile');
      throw new Error('Não foi possível retornar a previsão neste momento. Tente novamente');
    }
  };

  const handleGoBack = async () => {
    const email = userInfo?.email;
    const savedForecast = await getTodayForecast(email);

    if (savedForecast?.content) {
      setForecastContent(savedForecast.content);
      setShowBackButton(false);
      setCurrentScreen('forecast');
      return;
    }

    setForecastContent('');
    setShowBackButton(true);
    setCurrentScreen('profile');
  };

  const handleGoHome = async () => {
    try {
      const shouldShowDonation = await canShowDonationToday();

      if (shouldShowDonation) {
        setCurrentScreen('donation');
        return;
      }

      const savedForecast = await getTodayForecast(userInfo?.email);
      if (savedForecast?.content) {
        setForecastContent(savedForecast.content);
        setShowBackButton(false);
        setCurrentScreen('forecast');
        return;
      }

      setCurrentScreen('profile');
    } catch (e) {
      console.error('Error managing donation access:', e);
      setCurrentScreen('profile');
    }
  };

  const renderScreen = () => {
    if (currentScreen === 'login') {
      return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
    }

    if (currentScreen === 'profile') {
      return <DailyProfileScreen user={userInfo} onGenerateForecast={handleGenerateForecast} />;
    }

    if (currentScreen === 'forecast') {
      return (
        <DailyForecastResultScreen
          forecastContent={forecastContent}
          onGoBack={handleGoBack}
          showBackButton={showBackButton}
        />
      );
    }

    if (currentScreen === 'donation') {
      return <DonationScreen onGoHome={() => setCurrentScreen('profile')} />;
    }

    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" translucent={true} backgroundColor="transparent" />
      {renderScreen()}
    </SafeAreaProvider>
  );
}
