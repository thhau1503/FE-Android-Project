import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image } from "react-native";
import axios from "axios";

const OtpVerificationScreen = ({ route, navigation }: any) => {
  // Nhận email từ màn hình đăng ký qua route.params
  const { email } = route.params;
  const [otp, setOtp] = useState("");

  const handleOtpVerification = async () => {
    try {
      // Gọi API để xác thực OTP
      const response = await axios.post(
        "https://be-android-project.onrender.com/api/auth/verify-otp", // Thay thế bằng API OTP thực tế của bạn
        { email, otp }
      );

      if (response.status === 200) {
        // Nếu OTP xác thực thành công
        Alert.alert("Success", "OTP verified successfully!");
        // Điều hướng về màn hình đăng nhập sau khi xác thực thành công
        navigation.navigate("login");
      } else {
        // Nếu OTP không hợp lệ
        Alert.alert("Failed", "Invalid OTP, please try again.");
      }
    } catch (error) {
      // Xử lý lỗi từ yêu cầu OTP
      Alert.alert("Error", "An error occurred during OTP verification.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Hình ảnh ở giữa màn hình sử dụng URL từ Google */}
      <Image
        source={{
          uri: 'https://th.bing.com/th/id/OIP.0RVowCUd7UR4wQ3MKxZmnAHaE8?w=272&h=180&c=7&r=0&o=5&dpr=1.1&pid=1.7', 
        }}
        style={styles.image}
      />

      <Text style={styles.title}>OTP Verification</Text>
      <Text style={styles.subtitle}>Enter the OTP sent to your mobile number</Text>
      
      <TextInput
        placeholder="Enter OTP"
        style={styles.input}
        keyboardType="numeric"
        onChangeText={setOtp}
        value={otp}
      />

      <TouchableOpacity style={styles.button} onPress={handleOtpVerification}>
        <Text style={styles.buttonText}>VERIFY</Text>
      </TouchableOpacity>

      <Text style={styles.resendText}>Didn't receive OTP?</Text>
      <TouchableOpacity onPress={() => Alert.alert('Resend OTP')}>
        <Text style={styles.resendButton}>RESEND OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20, // Cách tiêu đề khoảng 20px
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#777',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    width: '80%',
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    width: '80%',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resendText: {
    color: '#777',
    fontSize: 14,
  },
  resendButton: {
    color: '#007bff',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
  },
});

export default OtpVerificationScreen;
