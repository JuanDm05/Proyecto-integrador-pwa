export const environment = {
  production: true,
  
  firebaseConfig: {
    apiKey: "AIzaSyD7Nyn83lzXCb3ISWZ4TjT2yd15SkIylEY",
    authDomain: "chatbot-app10a.firebaseapp.com",
    projectId: "chatbot-app10a",
    storageBucket: "chatbot-app10a.firebasestorage.app",
    messagingSenderId: "960881026186",
    appId: "1:960881026186:web:11aa629feb93acd5117973"
  },
  
  //  CORRECTO: Lee de variable de entorno de Vercel
  geminiApiKey: process.env['GEMINI_API_KEY'] || ''
};
