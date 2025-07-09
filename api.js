// api.js
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

export async function loginUser({ memberId, memberPw }) {
    const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ memberId, memberPw }),
    });
    return await response.json();
}

export async function logoutUser() {
    const response = await fetch(`${API_BASE_URL}/api/logout`, {
        method: "POST",
        credentials: "include", 
    });

    if (!response.ok) {
        const error = new Error("로그아웃 실패");
        error.status = response.status; 
        throw error;
    }
}

export async function createUserAccount(formData) {
    const response = await fetch(`${API_BASE_URL}/api/signUp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
    });

    if (!response.ok) {
        const error = new Error("계정 등록 실패");
        error.status = response.status;
        throw error;
    }

    return await response.json();
}