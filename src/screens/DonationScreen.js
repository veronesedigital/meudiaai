import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TouchableOpacity, 
  ScrollView, Alert, Share 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';

const donationOptions = [
  {
    label: 'R$ 5,00',
    value: 5,
    pixPayload: '00020126360014BR.GOV.BCB.PIX0114+551699319627252040000530398654045.005802BR5916NIVALDO VERONESE6009SAO PAULO6226052220gUB1sPB9YGNSEW9BX7p96304D589',
  },
  {
    label: 'R$ 10,00',
    value: 10,
    pixPayload: '00020126360014BR.GOV.BCB.PIX0114+5516993196272520400005303986540510.005802BR5916NIVALDO VERONESE6009SAO PAULO622605223onrBnXQ4CLlOuxlM9Rpda6304E5F4',
  },
  {
    label: 'R$ 15,00',
    value: 15,
    pixPayload: '00020126360014BR.GOV.BCB.PIX0114+5516993196272520400005303986540515.005802BR5916NIVALDO VERONESE6009SAO PAULO622605224iyUr7CW6XU2DTxBrCAWwE63049A6C',
  },
];

export default function DonationScreen({ onGoHome }) {
  const [selectedAmount, setSelectedAmount] = useState(10);
  const [pixPayload, setPixPayload] = useState(null);

  const handleGenerateQR = () => {
    const selectedOption = donationOptions.find(option => option.value === selectedAmount);
    setPixPayload(selectedOption.pixPayload);
  };

  const copyToClipboard = async () => {
    if (pixPayload) {
      await Clipboard.setStringAsync(pixPayload);
      Alert.alert('Sucesso', 'Código PIX copiado para a área de transferência!');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Meu Dia AI</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.message}>
            Opa, sei que você está curtindo bastante o Meu Dia AI. {"\n\n"}
            Para podermos manter e continuar evoluindo, precisamos de sua doação. Escolha abaixo o valor a ser doado. 
            Será gerado um qrcode pix, que você pode copiar ou ler o qrcode, e fazer a transferência. 
            Se não puder doar neste momento, não tem problema, continue usando o Meu Dia AI, e doe quando puder.
            Se você já doou, muito obrigado, sua contribuição é muito importante para nós.
            Gratidão!!!
          </Text>

          <View style={styles.optionsContainer}>
            {donationOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  selectedAmount === option.value && styles.selectedOption
                ]}
                onPress={() => {
                  setSelectedAmount(option.value);
                  setPixPayload(null); // Reset payload if amount changes
                }}
              >
                <Text style={[
                  styles.optionText,
                  selectedAmount === option.value && styles.selectedOptionText
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {!pixPayload ? (
            <TouchableOpacity 
              style={styles.generateButton} 
              onPress={handleGenerateQR}
            >
              <Text style={styles.generateButtonText}>Gerar QR Code PIX</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.qrContainer}>
              <QRCode
                value={pixPayload}
                size={200}
                color="black"
                backgroundColor="white"
              />
              <Text style={styles.pixCodeLabel}>Código Pix Copia e Cola:</Text>
              <Text style={styles.pixCode} numberOfLines={2}>{pixPayload}</Text>
              
              <TouchableOpacity 
                style={styles.copyButton} 
                onPress={copyToClipboard}
              >
                <Text style={styles.copyButtonText}>Copiar Código PIX</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity 
            style={styles.backButton} 
            onPress={onGoHome}
          >
            <Text style={styles.backButtonText}>Voltar ao Início</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    padding: 20,
    backgroundColor: '#28A745', 
    alignItems: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    padding: 20,
  },
  message: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  optionButton: {
    flex: 1,
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#28A745',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#28A745',
  },
  optionText: {
    color: '#28A745',
    fontWeight: 'bold',
  },
  selectedOptionText: {
    color: '#fff',
  },
  generateButton: {
    backgroundColor: '#007AFF', // Use a different but complementary blue for the main action
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  qrContainer: {
    alignItems: 'center',
    marginVertical: 20,
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  pixCodeLabel: {
    marginTop: 20,
    fontSize: 14,
    color: '#666',
  },
  pixCode: {
    fontSize: 12,
    color: '#333',
    marginVertical: 10,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  copyButton: {
    backgroundColor: '#28A745',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  copyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 20,
    padding: 15,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#666',
    textDecorationLine: 'underline',
  },
});
