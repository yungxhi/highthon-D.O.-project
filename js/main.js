const selected = localStorage.getItem("selectedMission");

const doingDiv = document.getElementById('doingMissions');

const haveTo = document.createElement("div");
haveTo.classList.add('haveTo');

const p = document.createElement("p");
p.textContent = selected;

const doneButt = document.createElement("button");
doneButt.textContent = "소감 쓰기";

haveTo.appendChild(p);
haveTo.appendChild(doneButt);
doingDiv.appendChild(haveTo);
