import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RadioButton from '../components/RadioButton';
import { obterPosicoesAstrologicas } from '../services/astronomyServiceMeuDia';

const estadoCivilOptions = [
  { label: 'Solteiro', value: 'solteiro(a)' },
  { label: 'Casado', value: 'casado(a)' },
  { label: 'Namorando', value: 'namorando' },
  { label: 'Outros', value: 'outros' },
];

const generoOptions = [
  { label: 'Feminino', value: 'feminino' },
  { label: 'Masculino', value: 'masculino' },
  { label: 'Não-binário', value: 'não-binário' },
  { label: 'Outro', value: 'outro' },
  { label: 'Prefiro não responder', value: 'prefiro não responder' },
];

const isValidBirthDate = (value) => {
  if (!value || !/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return false;

  const [dayStr, monthStr, yearStr] = value.split('/');
  const day = Number(dayStr);
  const month = Number(monthStr);
  const year = Number(yearStr);

  if (!Number.isInteger(day) || !Number.isInteger(month) || !Number.isInteger(year)) return false;
  if (year < 1900 || year > new Date().getFullYear()) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;

  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year
    && date.getMonth() === month - 1
    && date.getDate() === day;
};

export default function DailyProfileScreen({ onGenerateForecast, user }) {
  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [estadoCivil, setEstadoCivil] = useState(null);
  const [genero, setGenero] = useState(null);
  const [outroGenero, setOutroGenero] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const posicoes = useMemo(() => obterPosicoesAstrologicas(), []);

  const formatDate = (text) => {
    const digits = text.replace(/\D/g, '').slice(0, 8);
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
  };

  const labelName = useMemo(() => {
    return user?.name || user?.displayName || 'Usuário';
  }, [user]);

  const handleSubmit = async () => {
    if (!nome.trim()) {
      Alert.alert('Atenção', 'Informe o seu nome.');
      return;
    }

    if (!isValidBirthDate(dataNascimento)) {
      Alert.alert('Atenção', 'Informe a data de nascimento em dd/mm/aaaa.');
      return;
    }

    if (!estadoCivil) {
      Alert.alert('Atenção', 'Selecione o seu estado civil.');
      return;
    }

    if (!genero) {
      Alert.alert('Atenção', 'Selecione o seu gênero.');
      return;
    }

    setIsLoading(true);

    try {
      if (onGenerateForecast) {
        await onGenerateForecast({
          nome: nome.trim(),
          dataNascimento,
          estadoCivil,
          genero: genero === 'outro' && outroGenero.trim() ? outroGenero.trim() : genero,
          posicoes,
        });
      }
    } catch (error) {
      Alert.alert('Não foi possível retornar a previsão neste momento. Tente novamente');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Meu dia AI</Text>
          <Text style={styles.headerSubtitle}>Me conte um pouco sobre você</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Nome *</Text>
            <TextInput
              style={styles.input}
              value={nome}
              onChangeText={setNome}
              placeholder="Digite o seu nome"
              autoCapitalize="words"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Data nascimento *</Text>
            <TextInput
              style={styles.input}
              value={dataNascimento}
              onChangeText={(text) => setDataNascimento(formatDate(text))}
              placeholder="dd/mm/aaaa"
              keyboardType="numeric"
              maxLength={10}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Estado civil *</Text>
            <RadioButton
              options={estadoCivilOptions}
              selectedOption={estadoCivil}
              onSelect={setEstadoCivil}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Gênero *</Text>
            <RadioButton
              options={generoOptions}
              selectedOption={genero}
              onSelect={setGenero}
            />
            {genero === 'outro' && (
              <TextInput
                style={styles.input}
                value={outroGenero}
                onChangeText={setOutroGenero}
                placeholder="Campo de texto opcional"
              />
            )}
          </View>

          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text style={styles.submitButtonText}>{isLoading ? 'Gerando...' : 'Meu Dia'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 20,
    backgroundColor: '#7b61ff',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    marginTop: 8,
    fontSize: 18,
    color: '#f3ecff',
    lineHeight: 26,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  greetingCard: {
    backgroundColor: '#f4f0ff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3d2d73',
  },
  fieldGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    marginTop: 18,
    backgroundColor: '#7b61ff',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
