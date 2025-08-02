const selected = localStorage.getItem("selectedMission");

const doingDiv = document.getElementById('doingMissions');

const haveTo = document.createElement("div");
haveTo.classList.add('haveTo');

const p = document.createElement("p");
p.textContent = selected;

const doneButt = document.createElement("button");
doneButt.textContent = "소감 쓰기";

doneButt.addEventListener("click", function() {
    const parentDiv = this.closest(".haveTo");
    const missionText = parentDiv.querySelector("p").textContent;
    localStorage.setItem("reviewTarget", missionText);
    window.location.href = "thought.html"
})

haveTo.appendChild(p);
haveTo.appendChild(doneButt);
doingDiv.appendChild(haveTo);
