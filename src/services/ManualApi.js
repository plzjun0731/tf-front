const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

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
        console.log(formData);
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

        const manual = result.manual || {};
        
        return {
            manualScript: manual.manualScript || '',
            manualChecklist: manual.manualCheckList || '',
            manualEtc: manual.manualEtc || '',
            ...manual
        };
        
    } catch (error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error("네트워크 연결을 확인해주세요");
        }
        throw error;
    }
}