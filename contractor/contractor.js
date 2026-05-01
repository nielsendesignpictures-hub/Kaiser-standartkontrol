const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyWds-PHayXHll-vvpUwgs2vCU6KqFkgd9Sceg63fB1xM1_o7ZRH3jZrA778ZsxRaOMfw/exec";

async function loadFaults() {

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
        <input type="date" onchange="setPlanned('${fault.id}', this.value)">
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

  el.classList.add("done");
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

  loadFaults();
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("da-DK") + ", " +
         d.toLocaleTimeString("da-DK", {hour:"2-digit", minute:"2-digit"});
}

loadFaults();

// 🔥 Auto refresh hver 15 sek
setInterval(loadFaults, 15000);
