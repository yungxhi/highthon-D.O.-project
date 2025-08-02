const doneMission = localStorage.getItem("reviewTarget");

console.log(doneMission);

const missionName = document.getElementById("missionName");
missionName.textContent = doneMission;

