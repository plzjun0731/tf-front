import React, { useState } from 'react';
import {useTeamData} from "./TeamDataContext";
import "../../styles/admin/TeamManage/DBManagement.css";

const DBManagement = () => {
    const { teamData, teamId, teamName, addDbEntry, updateDbEntry, deleteDbEntry } = useTeamData();
    const [formData, setFormData] = useState({
        applicant: '',
        partner: '',
        gender: '',
        contact: '',
        visitPlace: '',
        visitDate: '',
        visitCountin: '',
        manager: ''
    });
      
    const [editingId, setEditingId] = useState(null);
    const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });

    const showAlert = (message, type = 'success') => {
        setAlert({ show: true, message, type });
        setTimeout(() => {
            setAlert({ show: false, message: '', type: 'success' });
        }, 3000);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return `${date.getMonth() + 1}월 ${date.getDate()}일`;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.applicant || !formData.partner) {
            showAlert('신청일자와 제휴처는 필수 입력 항목입니다.', 'error');
            return;
        }

        const dbData = {
            ...formData,
            visitDate: formatDate(formData.visitDate)
        };

        if (editingId) {
            updateDbEntry(editingId, dbData);
            setEditingId(null);
            showAlert('DB 정보가 수정되었습니다.');
        } else {
            addDbEntry(dbData);
            showAlert('DB 정보가 추가되었습니다.');
        }

        resetForm();
    };

    const resetForm = () => {
        setFormData({
            applicant: '',
            partner: '',
            gender: '',
            contact: '',
            visitPlace: '',
            visitDate: '',
            visitCountin: '',
            manager: ''
        });
        setEditingId(null);
    };

    const handleEdit = (entry) => {
        setFormData({
            applicant: entry.applicant,
            partner: entry.partner,
            gender: entry.gender,
            contact: entry.contact,
            visitPlace: entry.visitPlace,
            visitDate: entry.visitDate,
            visitCountin: entry.visitCountin,
            manager: entry.manager
        });
        setEditingId(entry.id);
        showAlert('수정할 정보를 변경한 후 등록 버튼을 클릭하세요.', 'success');
    };

    const handleDelete = (id) => {
        if (window.confirm('정말로 삭제하시겠습니까?')) {
            deleteDbEntry(id);
            showAlert('DB 정보가 삭제되었습니다.');
        }
    };

    return (
        <div className="db-management">
            {alert.show && (
                <div className={`alert ${alert.type}`}>
                    {alert.message}
                </div>
            )}

            <div className="form-section">
                <h3>DB 관리 정보 입력</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="applicant">신청일자:</label>
                            <input
                                type="date"
                                id="applicant"
                                name="applicant"
                                value={formData.applicant}
                                onChange={handleInputChange}
                                placeholder="신청일자 입력"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="partner">제휴처:</label>
                            <input
                                type="text"
                                id="partner"
                                name="partner"
                                value={formData.partner}
                                onChange={handleInputChange}
                                placeholder="제휴처 입력"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="gender">성함:</label>
                            <input
                                type="text"
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                                placeholder="성함 입력"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="contact">연락처:</label>
                            <input
                                type="tel"
                                id="contact"
                                name="contact"
                                value={formData.contact}
                                onChange={handleInputChange}
                                placeholder="연락처 입력"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="visitPlace">희망 지점:</label>
                            <select 
                                id="visitPlace"
                                name="visitPlace"
                                value={formData.visitPlace}
                                onChange={handleInputChange}
                            >
                                <option value="잠실점">잠실점</option>
                                <option value="부산점">부산점</option>
                                <option value="강남점">강남점</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="visitDate">희망 내원일:</label>
                            <input
                                type="date"
                                id="visitDate"
                                name="visitDate"
                                value={formData.visitDate}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="visitCountin">내원 확인:</label>
                            <input
                                type="text"
                                id="visitCountin"
                                name="visitCountin"
                                value={formData.visitCountin}
                                onChange={handleInputChange}
                                placeholder="내원 확인 입력"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="manager">담당자:</label>
                            <input
                                type="text"
                                id="manager"
                                name="manager"
                                value={formData.manager}
                                onChange={handleInputChange}
                                placeholder="담당자 입력"
                            />
                        </div>
                    </div>
                    <div className="button-group">
                        <button 
                            type="button" 
                            className="submit-button reset-btn" 
                            onClick={resetForm}
                        >
                            초기화
                        </button>
                        <button type="submit" className="submit-button">
                            {editingId ? '수정' : '등록'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="table-container">
                <h3>DB 관리 목록</h3>
                <table className="db-table">
                    <thead>
                        <tr>
                            <th>신청일자</th>
                            <th>제휴처</th>
                            <th>성함</th>
                            <th>연락처</th>
                            <th>희망 지점</th>
                            <th>희망 내원일</th>
                            <th>내원 확인</th>
                            <th>담당자</th>
                            <th colSpan={2}>관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teamData.dbEntries.length === 0 ? (
                            <tr>
                                <td colSpan="9" className="no-data">
                                    등록된 DB 정보가 없습니다.
                                </td>
                            </tr>
                        ) : (
                            teamData.dbEntries.map(entry => (
                                <tr key={entry.id}>
                                    <td>{entry.applicant}</td>
                                    <td>{entry.partner}</td>
                                    <td>{entry.gender}</td>
                                    <td>{entry.contact}</td>
                                    <td>{entry.visitPlace}</td>
                                    <td>{entry.visitDate}</td>
                                    <td>{entry.visitCountin}</td>
                                    <td>{entry.manager}</td>
                                    <td>
                                        <button 
                                            className="edit-btn" 
                                            onClick={() => handleEdit(entry)}
                                        >
                                            수정
                                        </button>
                                    </td>
                                    <td>
                                        <button 
                                            className="delete-btn" 
                                            onClick={() => handleDelete(entry.id)}
                                        >
                                            삭제
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DBManagement;