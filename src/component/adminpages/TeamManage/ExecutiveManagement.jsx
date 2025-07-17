import React, { useState } from 'react';
import '../../styles/admin/TeamManage/ExecutiveManagement.css';

const ExecutiveManagement = () => {
    const [executives, setExecutives] = useState([]);

    const [formData, setFormData] = useState({
        partner: '',
        position: '',
        name: '',
        title: '',
        visitDate: '',
        followUp: '',
        phone: '',
        option: '',
        memo: '',
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
        
        if (!formData.partner || !formData.name) {
            showAlert('제휴처명과 이름은 필수 입력 항목입니다.', 'error');
            return;
        }

        const executiveData = {
            ...formData,
            visitDate: formatDate(formData.visitDate),
            id: editingId || Date.now()
        };

        if (editingId) {
            setExecutives(prev => prev.map(exec => 
                exec.id === editingId ? executiveData : exec
            ));
            setEditingId(null);
            showAlert('제휴처 임원 정보가 수정되었습니다.');
        } else {
            setExecutives(prev => [...prev, executiveData]);
            showAlert('제휴처 임원이 추가되었습니다.');
        }

        resetForm();
    };

    const resetForm = () => {
        setFormData({
            partner: '',
            position: '',
            name: '',
            title: '',
            visitDate: '',
            followUp: '',
            phone: '',
            option: '',
            memo: '',
            manager: ''
        });
        setEditingId(null);
    };

    const handleEdit = (executive) => {
        setFormData({
            partner: executive.partner,
            position: executive.position,
            name: executive.name,
            title: executive.title,
            visitDate: executive.visitDate,
            followUp: executive.followUp,
            phone: executive.phone,
            option: executive.option,
            memo: executive.memo,
            manager: executive.manager
        });
        setEditingId(executive.id);
        showAlert('수정할 정보를 변경한 후 등록 버튼을 클릭하세요.', 'success');
    };

    const handleDelete = (id) => {
        if (window.confirm('정말로 삭제하시겠습니까?')) {
            setExecutives(prev => prev.filter(exec => exec.id !== id));
            showAlert('제휴처 임원이 삭제되었습니다.');
        }
    };

    return (
        <div className="executive-management">
            {alert.show && (
                <div className={`alert ${alert.type}`}>
                    {alert.message}
                </div>
            )}

            <div className="form-section">
                <h3 style={{ marginBottom: '20px', color: 'var(--color-gold-light)' }}>제휴처 임원 정보 입력</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="partner">제휴처명:</label>
                            <input
                                type="text"
                                id="partner"
                                name="partner"
                                value={formData.partner}
                                onChange={handleInputChange}
                                placeholder="제휴처명 입력"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="position">단위:</label>
                            <input
                                type="text"
                                id="position"
                                name="position"
                                value={formData.position}
                                onChange={handleInputChange}
                                placeholder="단위 입력"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">이름:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="이름 입력"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="title">직책:</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="직책 입력"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="visitDate">내원날짜:</label>
                            <input
                                type="date"
                                id="visitDate"
                                name="visitDate"
                                value={formData.visitDate}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="followUp">추후 외래:</label>
                            <input
                                type="text"
                                id="followUp"
                                name="followUp"
                                value={formData.followUp}
                                onChange={handleInputChange}
                                placeholder="추후 외래 입력"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">전화번호:</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="전화번호 입력"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="option">옵션:</label>
                            <input
                                type="text"
                                id="option"
                                name="option"
                                value={formData.option}
                                onChange={handleInputChange}
                                placeholder="옵션 입력"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="memo">비고:</label>
                            <input
                                type="text"
                                id="memo"
                                name="memo"
                                value={formData.memo}
                                onChange={handleInputChange}
                                placeholder="비고 입력"
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
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button 
                            type="button" 
                            className="submit-button" 
                            onClick={resetForm}
                            style={{ background: 'var(--white-25)' }}
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
                <h3 style={{ marginBottom: '20px', color: 'var(--color-gold-light)' }}>제휴처 임원 목록</h3>
                <table className="executive-table">
                    <thead>
                        <tr>
                            <th>학교명</th>
                            <th>단위</th>
                            <th>이름</th>
                            <th>직책</th>
                            <th>내원날짜</th>
                            <th>추후 외래</th>
                            <th>전화번호</th>
                            <th>옵션</th>
                            <th>비고</th>
                            <th>담당자</th>
                            <th>관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {executives.length === 0 ? (
                            <tr>
                                <td colSpan="11" className="no-data">
                                    등록된 제휴처 임원이 없습니다.
                                </td>
                            </tr>
                        ) : (
                            executives.map(executive => (
                                <tr key={executive.id}>
                                    <td>{executive.partner}</td>
                                    <td>{executive.position}</td>
                                    <td>{executive.name}</td>
                                    <td>{executive.title}</td>
                                    <td>{executive.visitDate}</td>
                                    <td>{executive.followUp}</td>
                                    <td>{executive.phone}</td>
                                    <td>{executive.option}</td>
                                    <td>{executive.memo}</td>
                                    <td>{executive.manager}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button 
                                                className="edit-btn" 
                                                onClick={() => handleEdit(executive)}
                                            >
                                                수정
                                            </button>
                                            <button 
                                                className="delete-btn" 
                                                onClick={() => handleDelete(executive.id)}
                                            >
                                                삭제
                                            </button>
                                        </div>
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

export default ExecutiveManagement;