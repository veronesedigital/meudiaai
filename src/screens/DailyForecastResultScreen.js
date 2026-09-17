import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Markdown from 'react-native-markdown-display';

export default function DailyForecastResultScreen({
  forecastContent,
  onGoBack,
  onUseAnotherAccount,
  showBackButton = true,
  userName = 'Usuário',
  forecastDate = new Date(),
}) {
  const rawContent = forecastContent || 'Sem previsão disponível.';
  const content = rawContent
    .split(/\r?\n\s*\r?\n/)
    .filter((paragraph) => !paragraph.trimStart().startsWith('Previsão para'))
    .join('\n\n');

  const formatDate = (date) => {
    const value = date instanceof Date ? date : new Date(date);
    if (Number.isNaN(value.getTime())) {
      return '—';
    }

    const day = String(value.getDate()).padStart(2, '0');
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const year = value.getFullYear();

    return `${day}/${month}/${year}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meu dia AI</Text>
        <Text style={styles.headerSubtitle}>Previsão para {userName} em {formatDate(forecastDate)}</Text>
      </View>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        <Markdown style={markdownStyles}>{content}</Markdown>
      </ScrollView>

      <View style={styles.footer}>
        {showBackButton && (
          <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.secondaryButton, showBackButton && styles.secondaryButtonWithMargin]}
          onPress={onUseAnotherAccount}
        >
          <Text style={styles.secondaryButtonText}>Logar com outro email</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#7b61ff',
    alignItems: 'center',
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    marginTop: 8,
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 30,
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  backButton: {
    backgroundColor: '#7b61ff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#f2f2f2',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  secondaryButtonWithMargin: {
    marginTop: 0,
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});

const markdownStyles = {
  body: { color: '#333', fontSize: 16, lineHeight: 26 },
  heading1: { fontSize: 24, fontWeight: 'bold', color: '#222', marginBottom: 12 },
  heading2: { fontSize: 20, fontWeight: 'bold', color: '#222', marginTop: 18, marginBottom: 8 },
  paragraph: { marginBottom: 10, color: '#444' },
  strong: { color: '#111' },
  list_item: { marginVertical: 6 },
  bullet_list: { marginBottom: 10 },
  ordered_list: { marginBottom: 10 },
};
