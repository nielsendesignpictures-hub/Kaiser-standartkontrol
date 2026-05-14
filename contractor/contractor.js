const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw8ztJIUOk-4GkhkTwHbpJiSOi7uJjPivpWc5skVr0KXJ1m-j3dcVNF3BSe3sbnWIds/exec";

let isEditing = false; // ✅ VIGTIG

async function loadFaults() {

  if (isEditing) return; // ✅ Stop hvis han skriver

  const res = await fetch(`${SCRIPT_URL}?action=getFaultsIssues&mode=json`);
  const data = await res.json();

  if (!data.ok) return;

  const list = document.getElementById("faultList");
  list.innerHTML = "";

  const faults = data.issues.filter(f => f.status !== "Closed");

  document.getElementById("openCount").innerText = faults.length;

  faults.forEach(fault => {

    const severityClass =
      fault.severity === "High" ? "high" :
      fault.severity === "Medium" ? "medium" : "low";

    const div = document.createElement("div");
    div.className = "fault-item";

    div.innerHTML = `
      <div class="fault-left">
        <div class="color-bar ${severityClass}"></div>
        <div class="fault-content">
          <h4>${fault.location} • ${fault.issueType}</h4>
          <p>${fault.description}</p>
          <div class="fault-date">${formatDate(fault.createdAt)}</div>
        </div>
      </div>

      <div class="actions">
        <input type="date"
          onfocus="startEditing()"
          onblur="stopEditing()"
          onchange="setPlanned('${fault.id}', this.value)">
        <div class="circle-btn" onclick="markDone('${fault.id}', this)"></div>
      </div>
    `;

    list.appendChild(div);
  });
}

async function markDone(id, el) {

  await fetch(SCRIPT_URL, {
    method: "POST",
    body: new URLSearchParams({
      action: "updateFaultIssue",
      id: id,
      status: "Closed"
    })
  });

  loadFaults();
}

async function setPlanned(id, date) {

  await fetch(SCRIPT_URL, {
    method: "POST",
    body: new URLSearchParams({
      action: "updateFaultIssue",
      id: id,
      plannedFixDate: date,
      status: "Planlagt"
    })
  });

  isEditing = false; // ✅ Reset editing efter gem
  loadFaults();
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("da-DK") + ", " +
         d.toLocaleTimeString("da-DK", {hour:"2-digit", minute:"2-digit"});
}

function startEditing() {
  isEditing = true;
}

function stopEditing() {
  isEditing = false;
}

// ✅ Første load
loadFaults();

// ✅ Smart auto refresh
setInterval(() => {
  if (!isEditing) {
    loadFaults();
  }
}, 15000);
