const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJkb0BkZ3N3LmhzLmtyIiwiaWF0IjoxNzU0MTczMTc4LCJleHAiOjE3NTQyMDkxNzgsInN1YiI6IjEiLCJwdXJwb3NlIjoiYWNjZXNzIn0.ZeA87shDp7zMQnK68pPbrlJ_bPpks1oW1TKsJxGIOfk';

// AI 미션 목록 불러와서 화면에 표시하는 함수
function loadAIMissions() {
  console.log('AI 미션 로딩 시작...');
  
  fetch('http://10.10.6.55:8080/missions/ai', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    console.log('미션 로드 응답 상태:', response.status);
    if (!response.ok) {
      throw new Error(`서버 응답 오류: ${response.status} ${response.statusText}`);
    }
    return response.json();
  })
  .then(json => {
    console.log('받은 미션 데이터:', json);
    const missions = json.data;
    if (!Array.isArray(missions)) {
      throw new Error('미션 데이터가 배열이 아님');
    }
    
    const optionElements = document.querySelectorAll('.option');
    console.log('찾은 옵션 요소 수:', optionElements.length);
    
    missions.forEach((mission, i) => {
      const option = optionElements[i];
      if (option) {
        option.textContent = mission.content || mission.text || JSON.stringify(mission);
        // 버튼에 클릭 이벤트 연결 (미션 선택 시 저장)
        const button = option.closest('.mission')?.querySelector('button');
        if (button) {
          button.onclick = () => handleClick(button);
          console.log(`미션 ${i + 1} 버튼 이벤트 연결 완료`);
        }
      }
    });
  })
  .catch(err => {
    console.error('미션 불러오기 실패:', err);
    alert('미션을 불러오는데 실패했습니다: ' + err.message);
  });
}

// 선택한 미션 서버에 저장하는 함수
function handleClick(button) {
  console.log('미션 저장 시작...');
  
  const missionDiv = button.closest(".mission");
  const span = missionDiv.querySelector("span.option");
  const text = span.textContent;
  
  console.log('저장할 미션 텍스트:', text);
  
  // 전송할 데이터 확인 (서버 API 형식에 맞게 수정)
  const payload = {
    content: text,
    level: 1,
    isPrivate: false,
    aiGenerated: true
  };
  console.log('전송할 데이터:', payload);

  fetch('http://10.10.6.55:8080/missions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  .then(response => {
    console.log('미션 저장 응답 상태:', response.status);
    console.log('응답 헤더:', Object.fromEntries(response.headers.entries()));
    
    // 응답 본문을 텍스트로 먼저 읽어서 확인
    return response.text().then(text => {
      console.log('응답 본문 (텍스트):', text);
      
      if (!response.ok) {
        throw new Error(`서버 응답 오류: ${response.status} ${response.statusText}\n응답: ${text}`);
      }
      
      // JSON 파싱 시도
      try {
        return JSON.parse(text);
      } catch (e) {
        console.warn('JSON 파싱 실패, 텍스트 응답 반환:', e);
        return { message: text };
      }
    });
  })
  .then(data => {
    console.log('미션 저장 성공:', data);
    alert('미션이 성공적으로 저장되었습니다!');
    window.location.href = "main.html";
  })
  .catch(error => {
    console.error('미션 저장 중 오류 발생:', error);
    alert('미션 저장에 실패했습니다: ' + error.message);
  });
}

// JWT 토큰 유효성 검사 함수
function checkTokenValidity() {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    console.log('토큰 만료 시간:', new Date(payload.exp * 1000));
    console.log('현재 시간:', new Date(currentTime * 1000));
    
    if (payload.exp < currentTime) {
      console.error('토큰이 만료되었습니다!');
      alert('인증 토큰이 만료되었습니다. 다시 로그인해주세요.');
      return false;
    }
    return true;
  } catch (e) {
    console.error('토큰 검증 실패:', e);
    return false;
  }
}

// 페이지 로드 시 실행
window.addEventListener('DOMContentLoaded', () => {
  console.log('페이지 로드 완료');
  
  // 토큰 유효성 검사
  if (!checkTokenValidity()) {
    return;
  }
  
  // AI 미션 목록 불러오기 실행
  loadAIMissions();
});