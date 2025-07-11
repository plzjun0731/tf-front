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

export async function getUserAccount() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/members`, {
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
        console.log('불러오기 응답:', result);
            
        if (!result || typeof result !== 'object') {
            throw new Error("서버 응답이 올바르지 않습니다");
        }
            
        return Array.isArray(result) ? result.map(item => ({
            userId: item.memberId,
            email: item.memberEmail,
            tel: item.memberPhone,
            userRole: item.memberRole,
        })) : [];
    } catch (error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error("네트워크 연결을 확인해주세요");
        }
        throw error;
    }
}

export async function boardManual(formData) {
    try {
        console.log('매뉴얼 저장 요청:', formData);
        const response = await fetch(`${API_BASE_URL}/api/writeManual`, {
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
        console.log('저장 응답:', result);

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
        console.log('불러오기 응답:', result);
        
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


export async function getNoticeList() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/noticeList`, {
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
        console.log('불러오기 응답:', result);
        
        if (!result || typeof result !== 'object') {
            throw new Error("서버 응답이 올바르지 않습니다");
        }
        
        return Array.isArray(result) ? result.map(item => ({
            title: item.noticeTitle,
            date: item.noticeDate,
            author: item.memberId
        })) : [];
        
    } catch (error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error("네트워크 연결을 확인해주세요");
        }
        throw error;
    }
}

export async function writeNotice() {
    try {
        console.log('공지사항 저장 요청:', notice);
        const response = await fetch(`${API_BASE_URL}/api/writeNotice`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(notice),
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
        console.log('저장 응답:', result);

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

