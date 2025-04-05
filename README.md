# EduBot - Aplikasi Chatbot Pendidikan

Aplikasi chatbot pendidikan dengan fitur login/signup terintegrasi MongoDB Atlas.

## Setup Awal

### Instalasi Dependensi

1. Instal dependensi frontend:
   ```
   npm install
   ```

2. Instal dependensi backend:
   ```
   cd backend
   npm install
   ```

### Konfigurasi MongoDB Atlas

1. Buka file `backend/.env.local`
2. Ganti `masukkan_password_mongodb_anda_disini` dengan password MongoDB Atlas Anda
3. Pastikan connection string di `backend/.env` sudah benar

## Menjalankan Aplikasi

### Cara Mudah (Rekomendasi)

Klik file `start-app.bat` untuk menjalankan frontend dan backend secara otomatis.

### Cara Manual

1. Jalankan backend:
   ```
   cd backend
   npm run dev
   ```

2. Jalankan frontend di terminal terpisah:
   ```
   npm start
   ```

## Fitur Aplikasi

- Login dengan email dan password
- Signup untuk pengguna baru
- Autentikasi menggunakan JWT
- Toggle mode gelap/terang
- Chatbot dengan kategori MTK dan IPA
- Logout

## Troubleshooting

### Error Koneksi MongoDB

Jika terjadi error koneksi ke MongoDB:
1. Pastikan password yang dimasukkan di `.env.local` sudah benar
2. Pastikan IP address Anda sudah diizinkan di MongoDB Atlas (Network Access)
3. Periksa koneksi internet Anda

### Error "Can't resolve 'axios'"

Jalankan perintah:
```
npm install axios
```

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## API Integration

This project includes integration with an external AI API for generating responses. The API is located at:
https://kwir03xxq01508-8000.proxy.runpod.net/generate/

### Setting Up the API Connection

1. Make sure the backend is properly configured:
   - The backend proxy is already set up in `backend/controllers/generateController.js`
   - The endpoint is exposed at `/api/generate`

2. To use the API in the frontend:
   - A new component `GeneratePrompt` has been created
   - The API service is available at `src/api/generate.js`
   - You can use the `generateResponse()` function to interact with the API

### Running the Application with API Support

1. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Start the backend:
   ```bash
   cd backend
   npm run dev
   ```

3. In a separate terminal, start the frontend:
   ```bash
   npm start
   ```

4. Access the application at `http://localhost:3000`

### API Usage

The API accepts a POST request with a JSON body containing:
- `prompt`: The text prompt to send to the AI model
- `parameters`: Optional parameters for the generation

Example:
```javascript
const response = await generateResponse("Tell me about AI", {
  max_length: 100,
  temperature: 0.7
});
```

## Menguji Integrasi API dalam Chat

ChatPage telah diintegrasikan dengan API eksternal untuk menghasilkan respons AI yang lebih pintar. Berikut cara pengujiannya:

1. Pastikan backend berjalan:
   ```bash
   cd backend
   npm install  # jika belum menginstall dependencies
   npm run dev
   ```

2. Jalankan frontend:
   ```bash
   npm start
   ```

3. Buka aplikasi di browser dan login
   - Anda akan melihat antarmuka chat yang sama seperti sebelumnya
   - Ketika Anda mengirim pesan, sistem akan mengirimkannya ke API eksternal
   - Tampilan "Generating response..." akan muncul saat menunggu respons dari API

4. Jika terjadi masalah koneksi:
   - Periksa log backend untuk melihat detail error
   - Pastikan URL API `https://kwir03xxq01508-8000.proxy.runpod.net/generate/` dapat diakses
   - Pastikan format data yang dikirim ke API dan dikembalikan dari API sudah sesuai

Integrasi ini tidak mengubah tampilan ChatPage dan tetap mempertahankan UX yang sama, namun sekarang menggunakan API eksternal untuk menghasilkan respons.

## Panduan Troubleshooting API

Jika mengalami masalah saat menghubungkan ke API, ikuti langkah-langkah berikut:

### 1. Periksa Status API

Akses URL berikut di browser untuk memastikan API berfungsi:
```
https://kwir03xxq01508-8000.proxy.runpod.net/docs
```

Jika Swagger UI muncul, API aktif. Anda bisa mencoba endpoint `/generate` langsung dari sana.

### 2. Cek Log Backend

Jalankan backend dengan lebih banyak informasi debugging:
```bash
cd backend
NODE_ENV=development DEBUG=app:* npm run dev
```

### 3. Uji API Dengan Curl

Buka terminal dan coba panggil API langsung:
```bash
curl -X POST https://kwir03xxq01508-8000.proxy.runpod.net/generate/ \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"prompt":"apa itu matematika", "max_length":100, "temperature":0.7, "top_p":0.9}'
```

### 4. Periksa Format Request

Pastikan format request yang dikirim sesuai dengan yang diharapkan API:
```json
{
  "prompt": "apa itu matematika",
  "max_length": 100,
  "temperature": 0.7,
  "top_p": 0.9
}
```

### 5. Restart Frontend dan Backend

Pastikan untuk me-restart kedua server setelah melakukan perubahan kode:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm start
```

### 6. Pengaturan Proxy untuk Mengatasi CORS

Jika masalah CORS tetap muncul, tambahkan proxy di package.json frontend:
```json
{
  "name": "front-end",
  "version": "0.1.0",
  "private": true,
  "proxy": "http://localhost:5000",
  "dependencies": {
    // ...
  }
}
```

## Cara Mengatasi Masalah "Could not proxy request"

Jika Anda mendapatkan error "Could not proxy request" atau "ECONNREFUSED", ini berarti frontend tidak bisa menghubungi backend pada `http://localhost:5000`. Ikuti langkah berikut:

### 1. Jalankan backend dengan script khusus

Untuk memastikan backend berjalan dengan benar:
```bash
cd backend
start-server.bat
```
Atau jalankan manual:
```bash
cd backend
npm run dev
```

### 2. Periksa jika port 5000 sudah digunakan

Periksa apakah port 5000 sudah digunakan oleh aplikasi lain:
```bash
# Windows
netstat -ano | findstr :5000

# Linux/Mac
lsof -i :5000
```

Jika port sudah digunakan, ubah port di file `.env`:
```
PORT=5001
```
Kemudian perbarui proxy di `package.json`:
```json
"proxy": "http://localhost:5001"
```

### 3. Koneksi Langsung ke API

Jika backend tetap bermasalah, aplikasi akan otomatis mencoba terhubung langsung ke API eksternal:
```
https://kwir03xxq01508-8000.proxy.runpod.net/generate/
```

### 4. Periksa Firewall

Pastikan firewall tidak memblokir koneksi ke port 5000 atau ke API eksternal.
