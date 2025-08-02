function handleClick(button) {
    const missionDiv = button.closest(".mission"); // 버튼이 속한 mission div 찾기
    const span = missionDiv.querySelector("span"); // 그 안에 있는 span 찾기
    const text = span.textContent;

    let missions = JSON.parse(localStorage.getItem("selectedMissions")) || [];
    if (!missions.includes(text)) {
        missions.push(text); // 배열에 새로운 미션 추가
    }
  
    localStorage.setItem("selectedMissions", JSON.stringify(missions));
  
    window.location.href = "main.html";
  }

  const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJkb0BkZ3N3LmhzLmtyIiwiaWF0IjoxNzU0MTYwODE2LCJleHAiOjE3NTQxNjQ0MTYsInN1YiI6IjEiLCJwdXJwb3NlIjoiYWNjZXNzIn0._NWZf9d81ZM7DQtQZKDl9Es3-8yu14FzLT-Eh43-dyw'; // ← Bearer 토큰을 여기에 입력하세요

  fetch('http://10.10.6.55:8080/missions/ai', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('서버 응답 오류: ' + response.status);
    }
    return response.json();
  })
  .then(json => {
    const missions = json.data; // ← 여기 주의

    if (!Array.isArray(missions)) {
      throw new Error('미션 데이터가 배열 형태가 아닙니다.');
    }

    const optionElements = document.querySelectorAll('.option');

    missions.forEach((mission, i) => {
      const option = optionElements[i];
      if (option) {
        option.textContent = mission.content || mission.text || JSON.stringify(mission);
      }
    });
  })
  .catch(error => {
    console.error('미션을 가져오는 중 오류 발생:', error.message);
  });


  