import React, { useState, useEffect } from "react";
import "../styles/MenualPage.css";

function MenualPage() {
    const [formData, setFormData] = useState({
        script: '',
        checklist: '',
        etc: ''
    });

    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedData = localStorage.getItem('board_menual');
        if (savedData) {
            setFormData(JSON.parse(savedData));
        }
        setLoading(false);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            localStorage.setItem('board_menual', JSON.stringify(formData));
            setSaved(true);
            setTimeout(() => setSaved(false), 1500);
            
        } catch (error) {
            console.error('저장 중 오류:', error)
        } 
    };
    /*실제 코드*/
    /*useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/board_menual');
                if (response.ok) {
                    const data = await response.json()
                    setFormData(data);
                }
            } catch (error) {
                console.error('데이터 로드 실패:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/board_menual', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
            } else {
                console.error('저장 실패');
            }
        } catch (error) {
            console.error('저장 중 오류:', error)
        } 
    };*/
    
    if (loading) {
        return <div>로딩 중...</div>;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <>
            <div className="content-area">
                <form onSubmit={handleSubmit}>
                    <div className="mpbt">
                        {saved && <span style={{color: "white", fontSize: "15px"}}>저장되었습니다.</span>}
                        <button className="mpsave" type="submit">저장</button>
                    </div>
                    <div className="form-container">
                        <div className="left-section">
                            <div className="form-group">
                                <label style={{fontWeight:"bold"}}>DB 상담 멘트</label>
                                <textarea
                                    className="input"
                                    name="script"
                                    value={formData.script}
                                    onChange={handleChange}
                                    placeholder="내용을 입력해주세요."
                            />
                            </div>
                        </div>
                        <div className="right-section">
                            <div className="form-group">
                                <label style={{fontWeight:"bold"}}>※상담 시 체크사항</label>
                                <textarea
                                    className="input"
                                    name="checklist"
                                    value={formData.checklist}
                                    onChange={handleChange}
                                    placeholder="내용을 입력해주세요."
                                />
                            </div>
                            <div className="form-group">
                                <label style={{fontWeight:"bold"}}>특이사항</label>
                                <textarea
                                    className="input"
                                    name="etc"
                                    value={formData.etc}
                                    onChange={handleChange}
                                    placeholder="내용을 입력해주세요."
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default MenualPage;