const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJkb0BkZ3N3LmhzLmtyIiwiaWF0IjoxNzU0MTY1MzczLCJleHAiOjE3NTQxNjg5NzMsInN1YiI6IjEiLCJwdXJwb3NlIjoiYWNjZXNzIn0.evoRixsmlbcKpf-xPdH_0442KZq8WifDdlE4Xdbm-Xc';

function loadMissions() {
  fetch('http://10.10.6.55:8080/missions', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('네트워크 응답 실패: ' + response.status);
    }
    return response.json();
  })
  .then(data => {
    const doingDiv = document.getElementById('doingMissions');
    doingDiv.innerHTML = '';

    if (!data.data || !Array.isArray(data.data)) {
      doingDiv.textContent = 'data 속성에 미션 배열이 없습니다.';
      return;
    }

    data.data.forEach(mission => {
      const haveTo = document.createElement('div');
      haveTo.classList.add('haveTo');

      const p = document.createElement('p');
      p.textContent = mission.content || JSON.stringify(mission);

      const doneButt = document.createElement('button');
      doneButt.textContent = '소감 쓰기';

      doneButt.addEventListener('click', function() {
        // 클릭한 버튼의 부모 div에서 미션 텍스트를 가져와서 localStorage에 저장 후 이동
        const parentDiv = this.closest('.haveTo');
        const missionText = parentDiv.querySelector('p').textContent;
        localStorage.setItem('reviewTarget', missionText);
        window.location.href = 'thought.html';
      });

      haveTo.appendChild(p);
      haveTo.appendChild(doneButt);
      doingDiv.appendChild(haveTo);
    });
  })
  .catch(error => {
    const doingDiv = document.getElementById('doingMissions');
    doingDiv.textContent = '미션을 불러오는 중 오류가 발생했습니다: ' + error;
    console.error(error);
  });
}

window.addEventListener('DOMContentLoaded', loadMissions);
