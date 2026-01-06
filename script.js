const API_URL = "https://script.google.com/macros/s/AKfycbyCTZzalSveweIFwxRLW6Hztqxt1qYDRZ2-RDdX8Rc/dev";

const times = ["10:00", "11:00", "14:00", "15:00"];

const dateSel = document.getElementById("date");
const timeSel = document.getElementById("time");
const msg = document.getElementById("msg");

// Fill next 14 days
for (let i = 0; i < 14; i++) {
  const d = new Date();
  d.setDate(d.getDate() + i);
  dateSel.innerHTML += `<option>${d.toISOString().slice(0,10)}</option>`;
}

let bookedSlots = [];

// Load booked slots from Google Sheets
fetch(API_URL)
  .then(res => res.json())
  .then(data => {
    bookedSlots = data.slice(1).map(row => ({
      date: row[0],
      time: row[1]
    }));
    updateTimes();
  });

function updateTimes() {
  timeSel.innerHTML = "";
  times.forEach(t => {
    const taken = bookedSlots.some(
      s => s.date === dateSel.value && s.time === t
    );
    if (!taken) {
      timeSel.innerHTML += `<option>${t}</option>`;
    }
  });

  if (!timeSel.innerHTML) {
    timeSel.innerHTML = `<option>No slots available</option>`;
  }
}

dateSel.addEventListener("change", updateTimes);

function book() {
  if (!timeSel.value || timeSel.value === "No slots available") return;

  const data = {
    date: dateSel.value,
    time: timeSel.value,
    name: document.getElementById("name").value
  };

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(data)
  }).then(() => {
    msg.innerText = "Booked!";
    bookedSlots.push({ date: data.date, time: data.time });
    updateTimes();
  });
}
