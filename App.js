import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert, Clipboard, } from 'react-native';

export default function App() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isRussianToMansi, setIsRussianToMansi] = useState(true);

  const API_URL = 'http://91.198.71.199:7012/translator';

  const translateText = async (text) => {
    const sourceLanguage = isRussianToMansi ? 'rus_Cyrl' : 'mancy_Cyrl';
    const targetLanguage = isRussianToMansi ? 'mancy_Cyrl' : 'rus_Cyrl';

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          sourceLanguage: sourceLanguage,
          targetLanguage: targetLanguage,
        }),
      });

      const result = await response.json();
      if (result && result.translatedText) {
        setTranslatedText(result.translatedText);
      } else {
        setTranslatedText('Ошибка перевода');
      }
    } catch (error) {
      setTranslatedText('Ошибка подключения к API');
    }
  };

  const toggleDirection = () => {
    setIsRussianToMansi(!isRussianToMansi);
    const temp = inputText;
    setInputText(translatedText);
    setTranslatedText(temp);
  };

  const copyToClipboard = () => {
    Clipboard.setString(translatedText);
    Alert.alert('Скопировано.');
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (inputText.trim()) {
        translateText(inputText);
      } else {
        setTranslatedText('');
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [inputText, isRussianToMansi]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Переводчик</Text>

      <View style={styles.translationBox}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isRussianToMansi ? 'Русский' : 'Мансийский'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder={
              isRussianToMansi
                ? 'Введите текст'
                : 'Введите текст'
            }
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
        </View>

        <TouchableOpacity style={styles.switchButton} onPress={toggleDirection}>
          <Text style={styles.switchText}>⇅</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isRussianToMansi ? 'Мансийский' : 'Русский'}
          </Text>
          <TouchableOpacity
            style={styles.outputContainer}
            onPress={copyToClipboard}
          >
            <Text style={styles.output}>
              {translatedText || 'Здесь будет перевод...'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  translationBox: {
    width: 350,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    elevation: 5,
    padding: 15,
    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 20px 100px',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
    padding: 10,
    textAlignVertical: 'top',
  },
  switchButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'rgb(162 194 230)',
    borderRadius: 8,
    marginBottom: 20,
  },
  switchText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  outputContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#f9f9f9',
    height: 100,
  },
  output: {
    fontSize: 16,
    color: '#555',
  },
});
