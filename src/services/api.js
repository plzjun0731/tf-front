const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

export async function loginUser({ memberId, memberPw }) {
    const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId, memberPw }),
    });
    return await response.json();
}