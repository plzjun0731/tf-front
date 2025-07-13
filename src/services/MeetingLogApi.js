const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export async function getMeetingLogList(){
    try{
        const response = await fetch(`${API_BASE_URL}/api/MeetingLogList`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });

        if(!response.ok){
            let errorMessage = "불러오기 실패";
            try{
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.error || errorMessage;
            }catch{
                errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            }

            const error = new Error(errorMessage);
            error.status = response.status;
            throw error;
        }

        const result = await response.json();
        console.log('불러오기 응답:', result);

        if (!Array.isArray(result)) {
            throw new Error("서버 응답이 올바르지 않습니다.");
        }

        return result.map(item => ({
            id: item.id,
            subject: item.minutesTitle,
            date: item.minutesDate
        }));

    } catch(error){
        if(error.name === 'TypeError' && error.message.includes('fetch')){
            throw new Error("네트워크 연결을 확인해주세요");
        }
        throw error;
    }
}

export async function writeMeetingLog(formData) {
    try {
        console.log('매뉴얼 저장 요청:', formData);
        const response = await fetch(`${API_BASE_URL}/api/writeMinutes`, {
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

export async function getMeetingLogDetail(minutesId){
    try{
        const response = await fetch(`${API_BASE_URL}/api/showMeetingLogDetail?id=${minutesId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });

        if(!response.ok){
            let errorMessage = "불러오기 실패";
            try{
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.error || errorMessage;
            }catch{
                errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            }

            const error = new Error(errorMessage);
            error.status = response.status;
            throw error;
        }

        const result = await response.json();
        console.log('불러오기 응답:', result);

        if (!Array.isArray(result)) {
            throw new Error("서버 응답이 올바르지 않습니다.");
        }

        return {
            id: result.id,
            subject: result.minutesTitle,
            location: result.minutesPlace,
            date: result.minutesDate,
            author: result.minutesWriter,
            participants: result.minutesJoiner,
            absentees: result.minutesAbsentee,
            content: result.minutesContent,
            conclusion: result.minutesResult,
            nextStep: result.Next,
            followUp: result.boardFollowUp ? result.boardFollowUp : [ // 배열명 확인
                {
                    job: result.followupWork,
                    assignee: result.followupPerformer,
                    dueDate: result.followupDeadline
                }
            ].filter(item => item.job)
        };

    } catch(error){
        if(error.name === 'TypeError' && error.message.includes('fetch')){
            throw new Error("네트워크 연결을 확인해주세요");
        }
        throw error;
    }
}
