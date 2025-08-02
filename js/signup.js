document.addEventListener('DOMContentLoaded', function() {
    // 중복 확인 버튼 이벤트 리스너
    document.getElementById('duplicate-check-button').addEventListener('click', checkDuplicate);

    // 폼 제출 이벤트 리스너
    document.getElementById('signup-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        const submitButton = document.querySelector('.submit-btn');
        submitButton.disabled = true;

        try {
            await signup();
        } finally {
            submitButton.disabled = false;
        }
    });
});

// 아이디 중복 확인
async function checkDuplicate() {
    const username = document.getElementById('id').value;

    if (!username || !isValidUsername(username)) return;

    try {
        const response = await fetch("http://10.10.6.55:8080/users/check-duplicate", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ username })
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.data ? "사용 가능한 아이디입니다." : "이미 사용 중인 아이디입니다.");
        } else {
            alert(result.message || "중복 확인 중 오류가 발생했습니다.");
        }
    } catch (error) {
        console.error("통신 에러:", error);
        alert("서버 연결에 실패했습니다.");
    }
}

// 회원가입 처리
async function signup() {
    const username = document.getElementById('id').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    if (!isValidForm(username, password, passwordConfirm)) return;

    try {
        const response = await fetch("http://10.10.6.55:8080/users/signup", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();

        if (response.ok) {
            alert("회원가입에 성공했습니다.");
            window.location.href = 'LoginForm.html';
        } else {
            alert(result.message || "회원가입에 실패했습니다.");
        }
    } catch (error) {
        console.error("통신 에러:", error);
        alert("서버 연결에 실패했습니다.");
    }
}

// 유효성 검사 함수들
function isValidUsername(username) {
    const idRegex = /^[a-z0-9]{4,12}$/;
    if (!idRegex.test(username)) {
        alert("아이디는 4~12자의 영문 소문자와 숫자 조합이어야 합니다.");
        return false;
    }
    return true;
}

function isValidPassword(password) {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[\d!@#$%^&*()_+])[a-zA-Z\d!@#$%^&*()_+]{6,20}$/;
    if (!passwordRegex.test(password)) {
        alert("비밀번호는 6~20자이며, 영문 대/소문자, 숫자, 특수문자 중 2가지 이상을 포함해야 합니다.");
        return false;
    }
    return true;
}

function isValidForm(username, password, passwordConfirm) {
    if (!username || !password) {
        alert("아이디와 비밀번호를 입력해주세요.");
        return false;
    }

    if (!isValidUsername(username)) return false;
    if (!isValidPassword(password)) return false;

    if (password !== passwordConfirm) {
        alert("비밀번호가 일치하지 않습니다.");
        return false;
    }

    return true;
}