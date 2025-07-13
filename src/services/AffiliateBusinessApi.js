const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

export async function getPartnerList() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/partnerList`, {
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

        return Array.isArray(result) ? result.map((item, idx) => ({
            id: item.partnerId,
            affiliateName: item.partnerName,
            unit: item.partnerUnit,
            manager: item.partnerManager,
            notice1: item.partnerNoticeDate1,
            notice2: item.partnerNoticeDate2,
            notice3: item.partnerNoticeDate3,
            goalPerformance: item.partnerTargetValue,
            lastUpdated: item.lastUpdated,
        })) : [];

    } catch (error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error("네트워크 연결을 확인해주세요");
        }
        throw error;
    }
}

export async function insertPartnerInfo(formData) {
    const response = await fetch(`${API_BASE_URL}/api/insertPartnerList`, {
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

export async function updatePartnerInfo(partnerId, field, value) {
    const response = await fetch(`${API_BASE_URL}/api/updatePartnerList/${partnerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ field, value }),
    });

    if (!response.ok) throw new Error("제휴처 정보 업데이트 실패");
    return await response.json();
}

export async function updateMonthlyPerformance(partnerId, year, month, field, value) {
    const response = await fetch(`${API_BASE_URL}/api/updatePartnerList`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
            partnerId,
            year,
            month,
            field,
            value: parseInt(value) || 0
        }),
    });

    if (!response.ok) throw new Error("월별 실적 업데이트 실패");
    return await response.json();
}