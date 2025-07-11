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

export async function boardManual(formData) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/wrtieManual`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            let errorMessage = "전송 실패";
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.error || errorMessage;
            } catch {
                errorMessage = `HTTP ${response.status}: ${response.statusText}`
            }

            const error = new Error(errorMessage);
            error.status = response.status;
            throw error;
        }

        const result = await response.json();

        if (!result || typeof result !== 'object') {
            throw new Error("서버 응답이 올바르지 않습니다.");
        }

        return result;
    } catch (error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error("네트워크 연결을 확인해주세요.")
        }
        throw error;
    }
}

export async function getBoardManual() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/showManual`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });

        if (!response.ok) {
            let errorMessage = "불러오기 실패";
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.error || errorMessage;
            } catch {
                errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            }
            
            const error = new Error(errorMessage);
            error.status = response.status;
            throw error;
        }

        const result = await response.json();
        
        if (!result || typeof result !== 'object') {
            throw new Error("서버 응답이 올바르지 않습니다");
        }
        
        return {
            manualScript: result.manual_script || '',
            manualChecklist: result.manual_checklist || '',
            manualEtc: result.manual_etc || '',
            ...result 
        };
        
    } catch (error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error("네트워크 연결을 확인해주세요");
        }
        throw error;
    }
}