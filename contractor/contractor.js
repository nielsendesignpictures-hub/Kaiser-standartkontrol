const SCRIPT_URL = "https://docs.google.com/spreadsheets/d/1qWbTEeSjL8DWLSlmaDVRP79WR8Eq4N1aQH8KdkHydPE/edit?gid=2091906444#gid=2091906444";

const userName = localStorage.getItem("contractorName");

if (!userName) {
  const name = prompt("Indtast dit navn:");
  localStorage.setItem("contractorName", name);
  location.reload();
}

document.getElementById("userName").innerText = userName;

async function loadTasks() {

  const res = await fetch(`${SCRIPT_URL}?action=getFaultsIssues&mode=json`);
  const data = await res.json();

  if (!data.ok) {
    alert("Fejl ved hentning");
    return;
  }

  const container = document.getElementById("taskList");
  container.innerHTML = "";

  const openTasks = data.faults.filter(t => t.status !== "Closed");

  openTasks.forEach(task => {

    const div = document.createElement("div");
    div.className = "task-card";

    const severityClass =
      task.severity === "High" ? "high" :
      task.severity === "Medium" ? "medium" : "low";

    div.innerHTML = `
      <h3>${task.location}</h3>
      <div class="badge ${severityClass}">${task.severity}</div>
      <p><strong>Område:</strong> ${task.area}</p>
      <p>${task.description}</p>
      <p><strong>Status:</strong> ${task.status}</p>
      <button onclick="takeTask('${task.id}')">Tag opgave</button>
    `;

    container.appendChild(div);
  });
}

async function takeTask(id) {

  await fetch(SCRIPT_URL, {
    method: "POST",
    body: new URLSearchParams({
      action: "updateFaultIssue",
      id: id,
      assignedTo: userName,
      status: "Planlagt"
    })
  });

  loadTasks();
}

function logout() {
  localStorage.removeItem("contractorName");
  location.reload();
}

loadTasks();
