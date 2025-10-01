// 🎨 Parallax achtergrond effect
document.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  const bg = document.getElementById("parallax-bg");
  if (bg) bg.style.transform = `translate(${x}px, ${y}px)`;
});

// 🔥 Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// 🔑 Jouw Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAgbwBPhNQ_7LLzMv6v8y8DG9hK6kY2fOA",
  authDomain: "todaywebsite.firebaseapp.com",
  projectId: "todaywebsite",
  storageBucket: "todaywebsite.firebasestorage.app",
  messagingSenderId: "763086093521",
  appId: "1:763086093521:web:5733aa6417544cedc299f0",
  measurementId: "G-ZWZ8MEPHF8"
};

// 🔥 Firebase initialiseren
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const reviewList = document.getElementById("review-list");

// 📥 Reviews ophalen
async function loadReviews() {
  if (!reviewList) return;
  reviewList.innerHTML = "<p>Reviews laden...</p>";

  const q = query(collection(db, "reviews"), orderBy("timestamp", "desc"));
  const snapshot = await getDocs(q);

  reviewList.innerHTML = "";
  snapshot.forEach((doc) => {
    const r = doc.data();
    reviewList.innerHTML += `
      <div class="review">
        <strong>${r.name}</strong>
        <div class="stars">${"⭐".repeat(r.stars)}</div>
        <p>${r.text}</p>
      </div>
    `;
  });
}

// 📤 Review toevoegen
window.submitReview = async function () {
  const name = document.getElementById("name").value.trim();
  const text = document.getElementById("text").value.trim();
  const stars = parseInt(document.getElementById("stars").value);

  if (!name || !text) {
    alert("Vul alle velden in!");
    return;
  }

  // Opslaan in Firestore
  await addDoc(collection(db, "reviews"), {
    name,
    text,
    stars,
    timestamp: Date.now()
  });

  // Automatisch antwoord van Pixlguy
  await addDoc(collection(db, "reviews"), {
    name: "Pixlguy",
    text: "Love G ❤️",
    stars: 5,
    timestamp: Date.now()
  });

  // Reset form
  document.getElementById("name").value = "";
  document.getElementById("text").value = "";
  document.getElementById("stars").value = "5";

  // Herladen
  loadReviews();
};

// 🚀 Laad reviews bij start
if (reviewList) loadReviews();
