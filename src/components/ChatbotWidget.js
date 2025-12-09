import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Modal, Platform, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../theme/colors';
import Constants from 'expo-constants';

const API_KEY = Constants.expoConfig?.extra?.GEMINI_API_KEY;

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: '👋 Hi! I\'m your CareerXplore AI assistant. Ask me anything about careers, internships, or how to use the app!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const prompt = `You are a helpful career guidance assistant for CareerXplore app. Answer this question concisely in 2-3 sentences:\n\n${input}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

      const data = await response.json();
      const botText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I couldn\'t process that.';
      
      setMessages(prev => [...prev, { role: 'bot', text: botText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Animated.View style={[styles.fabGlow, { transform: [{ scale: pulseAnim }] }]} />
      <TouchableOpacity style={styles.fab} onPress={() => setIsOpen(true)}>
        <MaterialIcons name="chat" size={24} color="#fff" />
      </TouchableOpacity>

      <Modal visible={isOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.chatContainer}>
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <View style={styles.aiIconContainer}>
                  <MaterialIcons name="auto-awesome" size={20} color="#9333EA" />
                </View>
                <Text style={styles.headerTitle}>AI Assistant</Text>
              </View>
              <TouchableOpacity onPress={() => setIsOpen(false)} style={styles.closeButton}>
                <MaterialIcons name="close" size={24} color={colors.textDark} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.messagesContainer}>
              {messages.map((msg, idx) => (
                <View key={idx} style={[styles.message, msg.role === 'user' ? styles.userMessage : styles.botMessage]}>
                  <Text style={[styles.messageText, msg.role === 'user' && styles.userMessageText]}>{msg.text}</Text>
                </View>
              ))}
              {loading && <Text style={styles.loadingText}>Typing...</Text>}
            </ScrollView>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Ask a question..."
                value={input}
                onChangeText={setInput}
                onSubmitEditing={sendMessage}
              />
              <TouchableOpacity style={styles.sendButton} onPress={sendMessage} disabled={loading}>
                <MaterialIcons name="send" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fabGlow: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#9333EA',
    opacity: 0.3,
    zIndex: 999,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#9333EA',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    zIndex: 1000,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  chatContainer: {
    backgroundColor: '#F5F3FF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#E9D5FF',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aiIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F3FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#9333EA',
  },
  closeButton: {
    padding: 4,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  message: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    maxWidth: '80%',
  },
  botMessage: {
    backgroundColor: colors.white,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  userMessage: {
    backgroundColor: '#9333EA',
    alignSelf: 'flex-end',
  },
  messageText: {
    fontSize: 14,
    color: colors.textDark,
  },
  userMessageText: {
    color: '#fff',
  },
  loadingText: {
    fontSize: 12,
    color: colors.textLight,
    fontStyle: 'italic',
    marginLeft: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.grayBorder,
    backgroundColor: colors.card,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#9333EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
