// Parallax background effect
document.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  document.getElementById("parallax-bg").style.transform = `translate(${x}px, ${y}px)`;
});

// Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// 🔥 Vul hier je eigen Firebase config in
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const reviewList = document.getElementById("review-list");
if (reviewList) loadReviews();

async function loadReviews() {
  reviewList.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "reviews"));
  querySnapshot.forEach((doc) => {
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

window.submitReview = async function () {
  const name = document.getElementById("name").value;
  const text = document.getElementById("text").value;
  const stars = parseInt(document.getElementById("stars").value);

  if (!name || !text) {
    alert("Vul alle velden in!");
    return;
  }

  await addDoc(collection(db, "reviews"), { name, text, stars });

  // Auto reply van Pixlguy
  await addDoc(collection(db, "reviews"), {
    name: "Pixlguy",
    text: "Love G ❤️",
    stars: 5,
  });

  loadReviews();
};
