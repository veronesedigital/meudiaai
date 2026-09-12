import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Markdown from 'react-native-markdown-display';

export default function DailyForecastResultScreen({ forecastContent, onGoBack, showBackButton = true }) {
  const content = forecastContent || 'Sem previsão disponível.';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meu dia AI</Text>
      </View>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        <Markdown style={markdownStyles}>{content}</Markdown>
      </ScrollView>

      {showBackButton && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      )}
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
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
