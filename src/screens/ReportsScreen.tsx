import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
// For storing the user's token (you might need to install this)
// import AsyncStorage from '@react-native-async-storage/async-storage';

// --- TYPE DEFINITIONS ---
type IssueCategory = 'Road' | 'Waste' | 'Lighting' | 'Water' | 'Other'; // Matched to backend enum
type Message = {
  id: string;
  sender: 'bot' | 'user' | 'input';
  type: 'text' | 'media' | 'category' | 'location' | 'title' | 'description' | 'submit';
  content: any;
};

// --- SVG ICON COMPONENTS (unchanged) ---
const BackIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M15 18l-6-6 6-6" />
  </Svg>
);
const CameraIcon = () => (
  <Svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <Circle cx="12" cy="13" r="4" />
  </Svg>
);
const SendIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
  </Svg>
);

// --- THE MAIN REPORT SCREEN COMPONENT ---
export default function ReportScreen({ navigation }: any) { // Added navigation for going back
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const categories: IssueCategory[] = ['Road', 'Waste', 'Lighting', 'Water', 'Other'];
  const reportData = useRef({ title: '', description: '', category: null, photo: null, location: 'FC Road, Shivajinagar, Pune' }).current;

  const botFlow: { type: Message["type"]; text: string }[] = [
    { type: 'media', text: "Let's report a new issue! First, please add a photo or video." },
    { type: 'category', text: 'Got it! Now, what category does this fall under?' },
    { type: 'title', text: "Perfect. What's a short title for this issue?" },
    { type: 'description', text: 'Thanks. Could you add a brief description?' },
    { type: 'location', text: "Almost done! I've detected your location." },
    { type: 'submit', text: 'All set! Review the details and submit your report.' },
  ];

  useEffect(() => {
    setMessages([{ id: 'start', sender: 'bot', type: 'text', content: "Hi there! 👋" }]);
    setTimeout(() => addBotMessage(0), 1000);
  }, []);

  const addBotMessage = (stepIndex: number) => {
    const step = botFlow[stepIndex];
    const newMessage: Message = { id: `bot-${stepIndex}`, sender: 'bot', type: 'text', content: step.text };
    setMessages(prev => [...prev, newMessage]);
    setTimeout(() => addInputMessage(step.type, stepIndex), 1000);
  };

  const addInputMessage = (type: Message["type"], stepIndex: number) => {
    if (type === 'submit') {
      const finalReport: Message = { id: 'final-report', sender: 'input', type: 'submit', content: { ...reportData } };
      setMessages(prev => [...prev, finalReport]);
      return;
    }
    const newInputMessage: Message = { id: `input-${stepIndex}`, sender: 'input', type, content: null };
    setMessages(prev => [...prev, newInputMessage]);
  };

  const handleUserInput = (type: Message["type"], value: any) => {
    const userMessage: Message = { id: `user-${currentStep}`, sender: 'user', type, content: value };
    setMessages(prev => prev.filter(m => m.sender !== 'input').concat(userMessage));

    switch (type) {
      case 'media': reportData.photo = value; break;
      case 'category': reportData.category = value; break;
      case 'title': reportData.title = value; break;
      case 'description': reportData.description = value; break;
    }

    const nextStep = currentStep + 1;
    if (nextStep < botFlow.length) {
      setCurrentStep(nextStep);
      setTimeout(() => addBotMessage(nextStep), 1000);
    }
    setInputValue('');
  };

  // --- NEW: API SUBMISSION LOGIC ---
  const handleSubmitReport = async () => {
    // In a real app, you would get this token from AsyncStorage after the user logs in
    const userToken = "PASTE_YOUR_LOGIN_TOKEN_HERE_FOR_TESTING"; 
    
    if (!userToken) {
        Alert.alert("Authentication Error", "You must be logged in to report an issue.");
        return;
    }

    const finalData = {
        title: reportData.title,
        description: reportData.description,
        category: reportData.category,
        photo: reportData.photo,
        // In a real app, you'd get location from GPS
        // For now, we are sending a hardcoded value
    };

    try {
        const res = await fetch("http://10.0.2.2:5000/api/v1/issues", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userToken}` // This is how we prove we're logged in
            },
            body: JSON.stringify(finalData),
        });

        const data = await res.json();

        if (res.ok) {
            Alert.alert("Report Submitted!", "Thanks for making your city better.");
            navigation.goBack(); // Go back to the previous screen
        } else {
            Alert.alert("Submission Failed", data.msg || "An error occurred.");
        }
    } catch (error) {
        console.error("Submit error:", error);
        Alert.alert("Connection Error", "Could not connect to the server.");
    }
  };

  const renderMessageContent = (message: Message) => {
    switch (message.type) {
      case 'media':
        return message.sender === 'input' ? (
          <TouchableOpacity
            style={styles.mediaInput}
            onPress={() => handleUserInput('media', 'https://placehold.co/600x400/e2e8f0/64748b?text=Issue+Image')}
          >
            <CameraIcon />
            <Text style={styles.mediaInputText}>Tap to add photo/video</Text>
          </TouchableOpacity>
        ) : (
          <Image source={{ uri: message.content }} style={styles.mediaMessage} />
        );
      case 'category':
        return message.sender === 'input' ? (
          <View style={styles.categoryContainer}>
            {categories.map(cat => (
              <TouchableOpacity key={cat} style={styles.categoryChip} onPress={() => handleUserInput('category', cat)}>
                <Text style={styles.categoryText}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <Text style={styles.userMessageText}>{message.content}</Text>
        );
      case 'location':
        return <Text style={styles.botMessageText}>📍 {reportData.location}</Text>;
      case 'submit':
        return (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Final Report Summary</Text>
            <Image source={{ uri: message.content.photo }} style={styles.summaryImage} />
            <Text style={styles.summaryRow}><Text style={styles.summaryLabel}>Title: </Text>{message.content.title}</Text>
            <Text style={styles.summaryRow}><Text style={styles.summaryLabel}>Category: </Text>{message.content.category}</Text>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmitReport} // --- MODIFIED: Calls the new API function ---
            >
              <Text style={styles.submitButtonText}>Confirm & Submit</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return (
          <Text style={message.sender === 'bot' ? styles.botMessageText : styles.userMessageText}>
            {message.content}
          </Text>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><BackIcon /></TouchableOpacity>
        <Text style={styles.headerTitle}>New Report</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          contentContainerStyle={styles.chatContainer}
        >
          {messages.map(msg => (
            <View
              key={msg.id}
              style={[styles.messageRow, { justifyContent: msg.sender === 'bot' ? 'flex-start' : 'flex-end' }]}
            >
              {msg.sender !== 'input' && (
                <View style={[styles.messageBubble, styles[`${msg.sender}Bubble`]]}>
                  {renderMessageContent(msg)}
                </View>
              )}
              {msg.sender === 'input' && renderMessageContent(msg)}
            </View>
          ))}
        </ScrollView>

        {currentStep === 2 || currentStep === 3 ? (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={inputValue}
              onChangeText={setInputValue}
              placeholder={currentStep === 2 ? "Type a title..." : "Type a description..."}
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={() => handleUserInput(currentStep === 2 ? 'title' : 'description', inputValue)}
            >
              <SendIcon />
            </TouchableOpacity>
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// --- STYLESHEET (unchanged) ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E5E7EB' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#D1D5DB' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1F2937' },
  chatContainer: { padding: 10, flexGrow: 1 },
  messageRow: { flexDirection: 'row', marginVertical: 5 },
  messageBubble: { borderRadius: 18, padding: 12, maxWidth: '80%' },
  botBubble: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 4 },
  userBubble: { backgroundColor: '#007AFF', borderTopRightRadius: 4 },
  botMessageText: { fontSize: 16, color: '#1F2937' },
  userMessageText: { fontSize: 16, color: '#FFFFFF' },
  inputContainer: { flexDirection: 'row', padding: 10, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#D1D5DB' },
  textInput: { flex: 1, height: 40, backgroundColor: '#F3F4F6', borderRadius: 20, paddingHorizontal: 15 },
  sendButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  mediaInput: { padding: 20, backgroundColor: '#FFFFFF', borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#D1D5DB' },
  mediaInputText: { color: '#007AFF', marginTop: 8 },
  mediaMessage: { width: 200, height: 150, borderRadius: 12 },
  categoryContainer: { padding: 10, backgroundColor: '#FFFFFF', borderRadius: 12, width: '100%', borderWidth: 1, borderColor: '#D1D5DB' },
  categoryChip: { padding: 12, borderRadius: 8, backgroundColor: '#F3F4F6', marginVertical: 4 },
  categoryText: { textAlign: 'center', color: '#374151' },
  summaryCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 15, width: '100%' },
  summaryTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  summaryImage: { width: '100%', height: 150, borderRadius: 8, marginBottom: 10 },
  summaryLabel: { fontWeight: 'bold' },
  summaryRow: { fontSize: 16, marginBottom: 5 },
  submitButton: { backgroundColor: '#10B981', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  submitButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
});
