import React, { useState, useEffect } from "react";
import { boardManual, getBoardManual } from "../../services/api";
import "../styles/MenualPage.css";

function MenualPage() {
    const [formData, setFormData] = useState({
        script: '',
        checklist: '',
        etc: ''
    });

    useEffect(() => {
        const fetchManual = async () => {
            try {
                const result = await getBoardManual();
                setFormData({
                    script: result.manual_script || '',
                    checklist: result.manual_checklist || '',
                    etc: result.manual_etc || '',
                });
            } catch (error) {
                console.error('불러오기 실패:', error);
                setFormData({
                    script: '',
                    checklist: '',
                    etc: ''
                });
            }
        };
        fetchManual(); 
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const sendData = {
            manual_script: formData.script,
            manual_checklist: formData.checklist,
            manual_etc: formData.etc
        }

        try {
            const result = await boardManual(sendData);   
            console.log('저장 성공:', result);
            alert('저장되었습니다.')         
        } catch (error) {
            console.error('저장 실패:', error)
            alert('오류가 발생했습니다.')  
        } 
    };    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="menual-page-container">
            <form onSubmit={handleSubmit}>
                <div className="menual-header">
                    <h2>업무 매뉴얼</h2>
                    <button className="save-button" type="submit">저장</button>
                </div>
                <div className="form-container">
                    <div className="left-section">
                        <div className="form-group">
                            <label style={{fontWeight:"bold"}}>DB 상담 멘트</label>
                            <textarea
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
                                name="checklist"
                                value={formData.checklist}
                                onChange={handleChange}
                                placeholder="내용을 입력해주세요."
                            />
                        </div>
                        <div className="form-group">
                            <label style={{fontWeight:"bold"}}>특이사항</label>
                            <textarea
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
    )
}

export default MenualPage;