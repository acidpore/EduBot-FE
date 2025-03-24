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
