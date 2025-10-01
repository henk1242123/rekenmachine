// 🎨 Parallax achtergrond
document.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  const bg = document.getElementById("parallax-bg");
  if (bg) bg.style.transform = `translate(${x}px, ${y}px)`;
});

// 🔥 Firebase import
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// 🔑 Zet hier je eigen Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCT0fcygfz-RkK15LkRzDtu6VerIEzI0fk",
  authDomain: "today-6828b.firebaseapp.com",
  projectId: "today-6828b",
  storageBucket: "today-6828b.firebasestorage.app",
  messagingSenderId: "107632990693",
  appId: "1:107632990693:web:e6aae5432e5d4ee655770c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const reviewList = document.getElementById("review-list");

// Reviews laden en tonen
export async function loadReviews() {
  if (!reviewList) return;
  reviewList.innerHTML = "<p>Laden...</p>";

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

// Review insturen
window.submitReview = async function () {
  const name = document.getElementById("name").value.trim();
  const text = document.getElementById("text").value.trim();
  const stars = parseInt(document.getElementById("stars").value);

  if (!name || !text) {
    alert("Vul alle velden in!");
    return;
  }

  await addDoc(collection(db, "reviews"), {
    name,
    text,
    stars,
    timestamp: Date.now()
  });

  // Automatisch bericht van Pixlguy
  await addDoc(collection(db, "reviews"), {
    name: "Pixlguy",
    text: "Love G ❤️",
    stars: 5,
    timestamp: Date.now()
  });

  document.getElementById("name").value = "";
  document.getElementById("text").value = "";
  document.getElementById("stars").value = "5";

  loadReviews();
};

// Start reviews laden bij openen
if (reviewList) loadReviews();
