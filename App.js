import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  Clipboard,
} from 'react-native';

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

  const handleKeyPress = (key) => {
    setInputText((prevText) => prevText + key);
  };

  const copyToClipboard = () => {
    Clipboard.setString(translatedText);
    Alert.alert('Скопировано', 'Текст перевода скопирован в буфер обмена.');
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

  const mansiKeys = [
    'а', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о',
    'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ъ', 'ы', 'ь', 'э',
    'ю', 'я', 'ӈ', 'ӑ', 'ӗ', 'ӱ', 'ҥ', 'ӟ',
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Переводчик</Text>

      {/* Блок перевода */}
      <View style={styles.translationBox}>
        {/* Верхняя часть: Поле ввода и язык */}
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

        {/* Средняя часть: Кнопка смены языка */}
        <TouchableOpacity style={styles.switchButton} onPress={toggleDirection}>
          <Text style={styles.switchText}>⇅</Text>
        </TouchableOpacity>

        {/* Нижняя часть: Результат перевода */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isRussianToMansi ? 'Мансийский' : 'Русский'}
          </Text>
          <View style={styles.outputContainer}>
            {/* Кнопка копирования текста */}
            <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
              <Text style={styles.copyText}>📋</Text>
            </TouchableOpacity>
            <Text style={styles.output}>
              {translatedText || 'Здесь будет перевод...'}
            </Text>
          </View>
        </View>
      </View>

      {/* Мансийская клавиатура */}
      {!isRussianToMansi && (
        <ScrollView
          style={styles.keyboard}
          contentContainerStyle={styles.keyboardContainer}
        >
          {mansiKeys.map((key) => (
            <TouchableOpacity
              key={key}
              style={styles.key}
              onPress={() => handleKeyPress(key)}
            >
              <Text style={styles.keyText}>{key}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
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
    width: '90%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
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
    position: 'relative',
  },
  copyButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 5,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  copyText: {
    fontSize: 14,
    color: '#333',
  },
  output: {
    fontSize: 16,
    color: '#555',
  },
  keyboard: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#eee',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  keyboardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  key: {
    width: '10%',
    padding: 10,
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  keyText: {
    fontSize: 18,
    color: '#333',
  },
});
