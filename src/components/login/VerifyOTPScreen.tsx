import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';

const VerifyOTPScreen = ({ route, navigation }) => {
  const { email } = route.params;  // Lấy email từ màn hình trước
  const [otp, setOTP] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleResetPassword = async () => {
    try {
      const response = await fetch('https://be-android-project.onrender.com/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Mật khẩu đã được đặt lại thành công');
        navigation.navigate('login');  // Chuyển hướng sang màn hình đăng nhập
      } else {
        Alert.alert('Lỗi', data.msg || 'OTP không hợp lệ.');
      }
      
    } catch (err) {
      console.error(err);
      Alert.alert('Lỗi', 'Đã có lỗi xảy ra.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Xác Nhận OTP</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập OTP"
        value={otp}
        onChangeText={setOTP}
      />
      <TextInput
        style={styles.input}
        placeholder="Nhập Mật Khẩu Mới"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Đặt Lại Mật Khẩu</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#1bcdff',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default VerifyOTPScreen;
