const doneMission = localStorage.getItem("reviewTarget");

console.log(doneMission);

const missionName = document.getElementById("missionName");
missionName.textContent = doneMission;

let selectedDifficulty = '';

document.querySelectorAll('.difficulty').forEach(btn => {
  btn.addEventListener('click', () => {
    // 선택된 값 저장
    selectedDifficulty = btn.dataset.value;

    // 시각적 강조
    document.querySelectorAll('.difficulty').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  });
});

document.getElementById('done').addEventListener('click', async () => {
  const impression = document.getElementById('impression').value.trim();
  const reaction = document.getElementById('reaction').value.trim();
  const missionId = localStorage.getItem("selectedMissionId");
  const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJkb0BkZ3N3LmhzLmtyIiwiaWF0IjoxNzU0MTY3MjQ3LCJleHAiOjE3NTQyMDMyNDcsInN1YiI6IjEiLCJwdXJwb3NlIjoiYWNjZXNzIn0.fEqZzwgrtT8woiki9WWEnXKv5rAMQ-PiwmkHTzhgG6c'; // 실제 토큰으로 교체

  if (!selectedDifficulty || !impression || !reaction) {
    alert("모든 항목을 입력해주세요.");
    return;
  }

  if (!missionId) {
    alert("missionId가 없습니다.");
    return;
  }

  try {
    const response = await fetch(`http://10.10.6.55:8080/missions/${missionId}/opinions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        difficulty: selectedDifficulty,
        impression: impression,
        reaction: reaction
      })
    });

    if (response.ok) {
      alert('소감이 성공적으로 제출되었습니다.');
    } else {
      const errorData = await response.json();
      console.error('서버 응답 오류:', errorData);
      alert(`제출 실패: ${errorData.message || response.status}`);
    }
  } catch (error) {
    console.error('요청 실패:', error);
    alert('요청 중 오류가 발생했습니다.');
  }
});
