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

        const partnerList = result.partnerList || [];
        console.log('📋 partnerList 배열:', partnerList);

        return Array.isArray(partnerList) ? partnerList.map((item, idx) => {
            console.log(`partner ${idx + 1} 데이터:`, item);
            console.log('- updateTime:', item.updateTime);
            const mappedData = {
                id: item.partnerId,
                affiliateName: item.partnerName,
                unit: item.partnerUnit,
                manager: item.partnerManager,
                notice1: item.noticeDate1,
                notice2: item.noticeDate2,
                notice3: item.noticeDate3,
                goalPerformance: item.targetValue,
                lastUpdated: item.lastUpdated,
                notice1Img: item.noticeImg1 ? { url: item.noticeImg1 } : null,
                notice2Img: item.noticeImg2 ? { url: item.noticeImg2 } : null,
                notice3Img: item.noticeImg3 ? { url: item.noticeImg3 } : null,
            };
            return mappedData;
        }) : [];

    } catch (error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error("네트워크 연결을 확인해주세요");
        }
        throw error;
    }
}

export async function insertPartnerInfo(formData) {
    const response = await fetch(`${API_BASE_URL}/api/insertPartner`, {
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

export async function updatePartnerInfo(partnerData, images = {}) {
    try {
        const formData = new FormData();

        const partnerDTO = {
            partnerId: partnerData.partnerId,
            partnerName: partnerData.partnerName || '',
            partnerUnit: partnerData.partnerUnit || '',
            partnerManager: partnerData.partnerManager || '',
            noticeDate1: partnerData.noticeDate1 || '',
            noticeDate2: partnerData.noticeDate2 || '',
            noticeDate3: partnerData.noticeDate3 || '',
            targetValue: partnerData.targetValue || '',
        };

        // JSON을 Blob으로 변환해서 추가
        formData.append('partnerDTO', new Blob([JSON.stringify(partnerDTO)], {
            type: 'application/json'
        }));

        ['noticeImg1', 'noticeImg2', 'noticeImg3'].forEach(imgField => {
            if (images.hasOwnProperty(imgField)) { 
                if (images[imgField] === null) {
                    formData.append(imgField, new Blob([], { type: 'application/octet-stream' })); 
                } else if (images[imgField] instanceof File) {
                    // 새 파일이 있는 경우
                    formData.append(imgField, images[imgField]);
                }
            }
        });

        console.log('FormData 내용 확인:');
        for (let pair of formData.entries()) {
            console.log(pair[0]+ ', ' + pair[1]); 
        }

        const response = await fetch(`${API_BASE_URL}/api/updatePartner`, {
            method: "POST",
            credentials: "include",
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP ${response.status}: 업데이트 실패`);
        }

        return await response.json();
    } catch (error) {
        console.error('업데이트 API 에러:', error);
        throw error;
    }
}

// export async function updateMonthlyPerformance(partnerId, year, month, field, value) {
//     const response = await fetch(`${API_BASE_URL}/api/updatePartner`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({
//             partnerId,
//             year,
//             month,
//             field,
//             value: parseInt(value) || 0
//         }),
//     });

//     if (!response.ok) throw new Error("월별 실적 업데이트 실패");
//     return await response.json();
// }

export async function deletePartnerInfo(partnerId) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/deletePartner`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json"},
            credentials: "include",
            body: JSON.stringify({ partnerId: partnerId })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP ${response.status}: 삭제 실패`);
        }

        return await response.json();
    } catch (error) {
        console.error('삭제 API 에러:', error);
        throw error;
    }    
}