import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAaGjvxdIMYiTpErLpcc9Nvy2tbyMoVs5U",
  authDomain: "barbearia-7e483.firebaseapp.com",
  projectId: "barbearia-7e483",
  storageBucket: "barbearia-7e483.firebasestorage.app",
  messagingSenderId: "1077845315933",
  appId: "1:1077845315933:web:d5d5e926f1080a137d98b4",
  measurementId: "G-5G9ZDBZYNV"
};

const app = initializeApp(firebaseConfig);

export default app