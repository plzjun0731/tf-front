const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export async function getMeetingLogList(){
    try{
        const response = await fetch('{API_BASE_URL}/api/meetingLogList', {
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

        if(!result || typeof result !== 'object'){
            throw new Error("서버 응답이 올바르지 않습니다");
        }

        return Array.isArray(result) ? result.map(item => ({

        })) : [];

        const error = new Error(errorMessage);
        error.status = response.status;
        throw error;

    } catch(error){
        if(error.name === 'TypeError' && error.message.includes('fetch')){
            throw new Error("네트워크 연결을 확인해주세요");
        }
        throw error;
    }
}