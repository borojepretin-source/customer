const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, deleteDoc, doc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyCHtWPY2FzbUF1hYNgzquSC0V37AGmkSIY",
  authDomain: "foto-booth-ac86e.firebaseapp.com",
  projectId: "foto-booth-ac86e",
  storageBucket: "foto-booth-ac86e.firebasestorage.app",
  messagingSenderId: "273309231710",
  appId: "1:273309231710:web:7a8b9c0d1e2f3a4b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function clearTemplates() {
  console.log('Fetching templates from Firestore...');
  const templatesRef = collection(db, 'templates');
  const snapshot = await getDocs(templatesRef);
  
  if (snapshot.empty) {
    console.log('No templates found in Firestore.');
    process.exit(0);
    return;
  }

  let count = 0;
  for (const document of snapshot.docs) {
    await deleteDoc(doc(db, 'templates', document.id));
    console.log(`Deleted template: ${document.id}`);
    count++;
  }
  
  console.log(`Successfully deleted ${count} templates from Firestore.`);
  process.exit(0);
}

clearTemplates().catch(console.error);
