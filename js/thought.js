let selectedDifficulty = '';

const missionName = localStorage.getItem("reviewTarget");
document.getElementById("missionName").textContent = missionName;


  // 난이도 버튼 클릭 시 선택된 값 저장
  document.querySelectorAll('.difficulty').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedDifficulty = btn.dataset.value;

      // 시각적 선택 표시
      document.querySelectorAll('.difficulty').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });

  // 서버로 POST 요청
  async function postOpinion(missionId, token, difficulty, impression, reaction) {
    const url = `http://10.10.6.55:8080/missions/${missionId}/opinions`;

    const bodyData = {
      difficulty: difficulty,
      impression: impression,
      reaction: reaction
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyData)
      });

      if (!response.ok) {
        throw new Error(`서버 응답 오류: ${response.status}`);
      }

      const result = await response.json();
      console.log('응답 결과:', result);
      return result;
    } catch (error) {
      console.error('POST 요청 실패:', error);
      throw error;
    }
  }

  // 제출 버튼 클릭 시 처리
  document.getElementById("done").addEventListener("click", async () => {
    const impression = document.getElementById("impression").value;
    const reaction = document.getElementById("reaction").value;
    const missionId = localStorage.getItem('reviewTargetId');
    const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJkb0BkZ3N3LmhzLmtyIiwiaWF0IjoxNzU0MTczMTc4LCJleHAiOjE3NTQyMDkxNzgsInN1YiI6IjEiLCJwdXJwb3NlIjoiYWNjZXNzIn0.ZeA87shDp7zMQnK68pPbrlJ_bPpks1oW1TKsJxGIOfk';

    console.log('hi');
    fetch(`http://10.10.6.55:8080/missions/${missionId}`, {
      method: "PATCH",
      headers: {
        "Authorization": token
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`서버 응답 오류: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("미션 완료 처리됨:", data);
      })
      .catch(error => {
        console.error("PATCH 요청 실패:", error);
      });

    if (!selectedDifficulty || !impression || !reaction) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    try {
      await postOpinion(missionId, token, selectedDifficulty, impression, reaction);
      alert("소감이 성공적으로 저장되었습니다!");
      window.location.href = 'main.html'; 
    } catch (error) {
      alert("소감 저장에 실패했습니다. 다시 시도해주세요.");
    }

  });