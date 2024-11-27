<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>README - Dự Án React Native</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 20px;
      background-color: #f4f4f4;
    }
    h1, h2, h3 {
      color: #333;
    }
    pre {
      background-color: #2d2d2d;
      color: white;
      padding: 10px;
      border-radius: 5px;
      overflow-x: auto;
    }
    code {
      color: #f39c12;
    }
    ul {
      list-style-type: square;
    }
    li {
      margin-bottom: 8px;
    }
    .content {
      background-color: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    .note {
      background-color: #fff3cd;
      border-left: 4px solid #ffeeba;
      padding: 10px;
      margin-top: 20px;
    }
  </style>
</head>
<body>

  <div class="content">
    <h1>Dự Án React Native (Expo)</h1>
    <p><strong>Mô Tả:</strong> Đây là một ứng dụng được phát triển bằng <strong>React Native</strong> với <strong>Expo</strong>. Dự án sử dụng một số thư viện phổ biến như <code>react-navigation</code>, <code>axios</code>, <code>react-native-maps</code>, và nhiều thư viện khác để xây dựng giao diện người dùng, quản lý trạng thái, và tương tác với các dịch vụ bên ngoài.</p>

    <h2>Các Thư Viện Được Sử Dụng</h2>
    <h3>Các Thư Viện Chính</h3>
    <ul>
      <li><strong>React Native</strong>: Framework phát triển ứng dụng di động.</li>
      <li><strong>Expo</strong>: Cung cấp một bộ công cụ phát triển và API cho các ứng dụng React Native.</li>
      <li><strong>React Navigation</strong>: Thư viện điều hướng cho React Native.</li>
      <li><strong>Axios</strong>: Thư viện HTTP Client để thực hiện các yêu cầu API.</li>
      <li><strong>React Native Maps</strong>: Thư viện để tích hợp bản đồ vào ứng dụng.</li>
      <li><strong>React Native Image Picker</strong>: Cho phép người dùng chọn ảnh từ thư viện hoặc chụp ảnh mới.</li>
      <li><strong>React Native Video</strong>: Cho phép phát video trong ứng dụng.</li>
    </ul>

    <h3>Các Thư Viện Khác</h3>
    <ul>
      <li><strong>Async Storage</strong>: Dùng để lưu trữ dữ liệu cục bộ.</li>
      <li><strong>Expo Location</strong>: Cung cấp API để truy xuất vị trí của người dùng.</li>
      <li><strong>Expo AV</strong>: Cung cấp API để phát âm thanh và video.</li>
      <li><strong>React Native Safe Area Context</strong>: Giúp bảo vệ nội dung khỏi bị cắt bớt trên các thiết bị có màn hình cong.</li>
    </ul>

    <h2>Cài Đặt</h2>
    <p>Để cài đặt các thư viện cần thiết, làm theo các bước sau:</p>
    
    <h3>1. Clone Dự Án:</h3>
    <pre><code>git clone https://github.com/your-username/fe.git
cd fe</code></pre>

    <h3>2. Cài Đặt Các Phụ Thuộc:</h3>
    <p>Sử dụng <strong>npm</strong> hoặc <strong>yarn</strong> để cài đặt các phụ thuộc từ <code>package.json</code>.</p>
    <h4>Nếu bạn dùng <strong>npm</strong>:</h4>
    <pre><code>npm install</code></pre>

    <h4>Nếu bạn dùng <strong>yarn</strong>:</h4>
    <pre><code>yarn install</code></pre>

    <p>Sau khi cài xong, các thư viện được liệt kê trong <code>dependencies</code> sẽ được tải và cài vào thư mục <code>node_modules</code>.</p>

    <h2>Chạy Dự Án</h2>
    <p>Sau khi cài đặt thành công, bạn có thể bắt đầu phát triển và chạy ứng dụng trên thiết bị giả lập hoặc thiết bị thật bằng cách sử dụng các lệnh sau:</p>
    
    <h3>Chạy trên Android:</h3>
    <pre><code>npm run android</code></pre>

    <h3>Chạy trên iOS:</h3>
    <pre><code>npm run ios</code></pre>

    <h3>Chạy trên Web:</h3>
    <pre><code>npm run web</code></pre>

    <h3>Chạy trên máy tính:</h3>
    <pre><code>npm start</code></pre>

    <h2>Thư Viện Được Sử Dụng</h2>
    
    <h3>1. <code>@react-navigation/native</code>, <code>@react-navigation/stack</code>, <code>@react-navigation/bottom-tabs</code></h3>
    <p>Thư viện điều hướng cho phép xây dựng các thanh điều hướng và các màn hình trong ứng dụng di động.</p>
    <pre><code>npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs</code></pre>

    <h3>2. <code>axios</code></h3>
    <p>Dùng để thực hiện các yêu cầu HTTP (GET, POST, PUT, DELETE).</p>
    <pre><code>npm install axios</code></pre>

    <h3>3. <code>react-native-maps</code></h3>
    <p>Tích hợp bản đồ Google Maps hoặc MapKit vào ứng dụng.</p>
    <pre><code>npm install react-native-maps</code></pre>

    <h3>4. <code>react-native-image-picker</code></h3>
    <p>Chọn ảnh từ thư viện hoặc chụp ảnh mới.</p>
    <pre><code>npm install react-native-image-picker</code></pre>

    <h3>5. <code>expo-location</code></h3>
    <p>Truy xuất vị trí hiện tại của người dùng.</p>
    <pre><code>expo install expo-location</code></pre>

    <h3>6. <code>expo-av</code></h3>
    <p>Phát âm thanh và video trong ứng dụng.</p>
    <pre><code>expo install expo-av</code></pre>

    <h3>7. <code>react-native-video</code></h3>
    <p>Phát video từ URL hoặc tệp trong ứng dụng.</p>
    <pre><code>npm install react-native-video</code></pre>

    <h3>8. <code>@react-native-async-storage/async-storage</code></h3>
    <p>Lưu trữ dữ liệu cục bộ cho ứng dụng (thay thế SharedPreferences hoặc AsyncStorage của React Native).</p>
    <pre><code>npm install @react-native-async-storage/async-storage</code></pre>

    <div class="note">
      <strong>Chú ý:</strong> Đảm bảo rằng bạn đã cài đặt đúng phiên bản của các công cụ phát triển như Node.js và Expo CLI trước khi bắt đầu.
    </div>
  </div>

</body>
</html>
