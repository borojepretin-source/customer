const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, deleteDoc, doc, setDoc } = require('firebase/firestore');

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

const templates = [
  {
    id: "template_1",
    name: "Photo Booth 1",
    image_url: "/templates/TEMPLATE PHOTOBOOTH 1.png",
    thumbnail: "/templates/TEMPLATE PHOTOBOOTH 1.png",
    templateImage: "/templates/TEMPLATE PHOTOBOOTH 1.png",
    orientation: "portrait",
    print_size: "4R",
    category: "General",
    photo_count: 3,
    active: true,
    canvas_width: 600,
    canvas_height: 1800,
    order: 1
  },
  {
    id: "template_2",
    name: "Photo Booth 2",
    image_url: "/templates/TEMPLATE PHOTOBOOTH 2.png",
    thumbnail: "/templates/TEMPLATE PHOTOBOOTH 2.png",
    templateImage: "/templates/TEMPLATE PHOTOBOOTH 2.png",
    orientation: "portrait",
    print_size: "4R",
    category: "General",
    photo_count: 3,
    active: true,
    canvas_width: 600,
    canvas_height: 1800,
    order: 2
  }
];

const layouts = {
  template_1: {
    slots: [
      { slotNumber: 1, x: 0, y: 75, width: 600, height: 469, rotation: 0, fit: "cover", radius: 0, opacity: 1 },
      { slotNumber: 2, x: 0, y: 616, width: 600, height: 419, rotation: 0, fit: "cover", radius: 0, opacity: 1 },
      { slotNumber: 3, x: 0, y: 1101, width: 600, height: 477, rotation: 0, fit: "cover", radius: 0, opacity: 1 }
    ]
  },
  template_2: {
    slots: [
      { slotNumber: 1, x: 95, y: 121, width: 422, height: 460, rotation: 0, fit: "cover", radius: 0, opacity: 1 },
      { slotNumber: 2, x: 95, y: 653, width: 422, height: 427, rotation: 0, fit: "cover", radius: 0, opacity: 1 },
      { slotNumber: 3, x: 85, y: 1138, width: 433, height: 485, rotation: 0, fit: "cover", radius: 0, opacity: 1 }
    ]
  }
};

async function runSeed() {
  console.log('Clearing old templates...');
  const templatesRef = collection(db, 'templates');
  const snapshot = await getDocs(templatesRef);
  
  for (const document of snapshot.docs) {
    await deleteDoc(doc(db, 'templates', document.id));
    console.log(`Deleted old template: ${document.id}`);
  }
  
  console.log('Seeding new templates...');
  for (const t of templates) {
    const templateDocRef = doc(db, 'templates', t.id);
    await setDoc(templateDocRef, t);
    console.log(`Created template: ${t.id}`);
    
    const layoutRef = doc(db, 'templates', t.id, 'layouts', 'active');
    await setDoc(layoutRef, layouts[t.id]);
    console.log(`Created layout for: ${t.id}`);
  }
  
  console.log('Successfully completed template reset!');
  process.exit(0);
}

runSeed().catch(console.error);
