function handleClick(button) {
    const missionDiv = button.closest(".mission"); // 버튼이 속한 mission div 찾기
    const span = missionDiv.querySelector("span"); // 그 안에 있는 span 찾기
    const text = span.textContent;
  
    localStorage.setItem("selectedMission", text);
  
    window.location.href = "main.html";
  }
  