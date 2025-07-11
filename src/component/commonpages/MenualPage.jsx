import React, { useState, useEffect, useRef } from "react";
import { boardManual, getBoardManual } from "../../services/api";
import "../styles/MenualPage.css";

function MenualPage() {
    const [formData, setFormData] = useState({
        script: '',
        checklist: '',
        etc: ''
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const isMounted = useRef(true);

    const fetchManual = async () => {
        if (!isMounted.current) return;
        
        try {
            const result = await getBoardManual();
            
            if (isMounted.current) {
                setFormData({
                    script: result.manual_script || '',
                    checklist: result.manual_checklist || '',
                    etc: result.manual_etc || '',
                });
            }
        } catch (error) {
            console.error('불러오기 실패:', error);
            if (isMounted.current) {
                setFormData({
                    script: '',
                    checklist: '',
                    etc: ''
                });
            }
        } finally {
            if (isMounted.current) {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchManual();
        
        return () => {
            isMounted.current = false;
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (saving || loading) return;

        const sendData = {
            manual_script: formData.script,
            manual_checklist: formData.checklist,
            manual_etc: formData.etc
        }

        try {
            setSaving(true);
            await boardManual(sendData);   
            console.log('저장 성공');
            alert('저장되었습니다.');
            
            await fetchManual();
            
        } catch (error) {
            console.error('저장 실패:', error);
            alert('저장에 실패했습니다.');  
        } finally {
            setSaving(false);
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
        // ver1
        // <div className="menual-page-container">
        //     <form onSubmit={handleSubmit}>
        //         <div className="menual-header">
        //             <h2>업무 매뉴얼</h2>
        //             <button className="save-button" type="submit">저장</button>
        //         </div>
        //         <div className="form-container">
        //             <div className="left-section">
        //                 <div className="form-group">
        //                     <label style={{fontWeight:"bold"}}>DB 상담 멘트</label>
        //                     <textarea
        //                         name="script"
        //                         value={formData.script}
        //                         onChange={handleChange}
        //                         placeholder="내용을 입력해주세요."
        //                     />
        //                 </div>
        //             </div>
        //             <div className="right-section">
        //                 <div className="form-group">
        //                     <label style={{fontWeight:"bold"}}>※상담 시 체크사항</label>
        //                     <textarea
        //                         name="checklist"
        //                         value={formData.checklist}
        //                         onChange={handleChange}
        //                         placeholder="내용을 입력해주세요."
        //                     />
        //                 </div>
        //                 <div className="form-group">
        //                     <label style={{fontWeight:"bold"}}>특이사항</label>
        //                     <textarea
        //                         name="etc"
        //                         value={formData.etc}
        //                         onChange={handleChange}
        //                         placeholder="내용을 입력해주세요."
        //                     />
        //                 </div>
        //             </div>
        //         </div>
        //     </form>
        // </div>

        // ver2
        <div className="menual-page-container">
            <form onSubmit={handleSubmit}>
                <div className="menual-header">
                    <h2>업무 매뉴얼</h2>
                    <button className="save-button" type="submit">저장</button>
                </div>
                    <div className="db-section">
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
                    <div className="checklist-section">
                        <div className="form-group">
                            <label style={{fontWeight:"bold"}}>※상담 시 체크사항</label>
                            <textarea
                                name="checklist"
                                value={formData.checklist}
                                onChange={handleChange}
                                placeholder="내용을 입력해주세요."
                            />
                        </div>
                    </div>
                    <div className="etc-section">
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
            </form>
        </div>
    )
}

export default MenualPage;