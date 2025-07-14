import React, { useState, useEffect } from "react";
import { ImagePlus, PencilLine, X, Check, ImageOff } from "lucide-react";
import { getPartnerList, insertPartnerInfo, updatePartnerInfo, deletePartnerInfo } from "../../services/AffiliateBusinessApi";
import '../styles/AffiliateBusiness.css'

function AffiliateBusiness() {
    const [data, setData] = useState([]);
    const [showMonthly, setShowMonthly] = useState(false);
    const [formData, setFormData] = useState({
        partnerName: '',
        partnerUnit: '',
        partnerManager: '',
        noticeDate1: '',
        noticeDate2: '',
        noticeDate3: '',
        targetValue: ''
    });
    const [selectedCell, setSelectedCell] = useState(null);
    const [cellValue, setCellValue] = useState('');
    const [tempRowData, setTempRowData] = useState({});

    const months = [
        { key: 'jan', name: '1월'},
        { key: 'feb', name: '2월'},
        { key: 'mar', name: '3월'},
        { key: 'apr', name: '4월'},
        { key: 'may', name: '5월'},
        { key: 'jun', name: '6월'},
        { key: 'jul', name: '7월'},
        { key: 'aug', name: '8월'},
        { key: 'sep', name: '9월'},
        { key: 'oct', name: '10월'},
        { key: 'nov', name: '11월'},
        { key: 'dec', name: '12월'},
    ];

    // 컴포넌트 마운트 시 데이터 로드
    useEffect(() => {
        const loadData = async () => {
            try {
                const partnerList = await getPartnerList();
                setData(partnerList);
            } catch (error) {
                alert("데이터 불러오기 실패: " + error.message);
            }
        };
        loadData();
    }, []);

    const getCurrentDate = () => {
        const now = new Date();
        return now.toISOString().split('T')[0].replace(/-/g, '.');
    }

    const handleSubmit = async () => {
        if (formData.partnerName) {
            try {
                await insertPartnerInfo(formData);
                
                // 데이터 다시 로드
                const updatedList = await getPartnerList();
                setData(updatedList);
                
                // 폼 초기화
                setFormData({
                    partnerName: '',
                    partnerUnit: '',
                    partnerManager: '',
                    noticeDate1: '',
                    noticeDate2: '',
                    noticeDate3: '',
                    targetValue: ''
                });
                
                alert("등록되었습니다.");
            } catch (error) {
                alert("등록 실패: " + error.message);
            }
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleCellClick = (rowId, field, currentValue) => {
        setSelectedCell({ rowId, field });
        const tempData = tempRowData[rowId] || {};
        setCellValue(tempData[field] !== undefined ? tempData[field] : currentValue);
    };

    const saveChanges = async (rowId) => {
        try {
            const original = data.find(r => r.id === rowId);
            const { field } = selectedCell || {};
            
            // 현재 편집 중인 필드 값과 임시 데이터 합치기
            const updatedData = {
                ...original,
                ...tempRowData[rowId],
                ...(field ? { [field]: cellValue } : {}),
            };

            // API 필드명으로 변환
            const updateData = {
                partnerId: rowId,
                partnerName: updatedData.affiliateName,
                partnerUnit: updatedData.unit,
                partnerManager: updatedData.manager,
                noticeDate1: updatedData.notice1,
                noticeDate2: updatedData.notice2,
                noticeDate3: updatedData.notice3,
                targetValue: updatedData.goalPerformance,
            };

            await updatePartnerInfo(updateData);
            alert('저장되었습니다.');
            
            // 데이터 다시 로드
            const refreshedList = await getPartnerList();
            setData(refreshedList);
            
            // 임시 데이터와 편집 상태 초기화
            setTempRowData(prev => {
                const updated = { ...prev };
                delete updated[rowId];
                return updated;
            });
            setSelectedCell(null);
            setCellValue('');
        } catch (error) {
            alert("저장 실패: " + error.message);
        }
    };

    const handleCellSave = () => {
        const { rowId, field } = selectedCell;

        setTempRowData(prev => ({
            ...prev,
            [rowId]: {
                ...prev[rowId],
                [field]: cellValue,
            }
        }));

        setSelectedCell(null);
        setCellValue('');
    }

    const cancelEdit = () => {
        setSelectedCell(null);
        setCellValue('');
    }

    const deleteRow = async (rowId) => {
        if (window.confirm("정말로 삭제하시겠습니까?")) {
            try {
                await deletePartnerInfo(rowId);
                alert("삭제되었습니다.");
                
                // 데이터 다시 로드
                const refreshedList = await getPartnerList();
                setData(refreshedList);
                
                // 관련 상태 초기화
                setTempRowData(prev => {
                    const newData = { ...prev };
                    delete newData[rowId];
                    return newData;
                });
                if (selectedCell && selectedCell.rowId === rowId) {
                    setSelectedCell(null);
                    setCellValue('');
                }
            } catch (error) {
                alert("삭제 실패: " + error.message);
            }
        }
    };

    const handleImageUpload = async (rowId, field, files) => {
        if (files && files.length > 0) {
            try {
                const file = files[0];
                const original = data.find(r => r.id === rowId);
                
                const updateData = {
                    partnerId: rowId,
                    partnerName: original.affiliateName,
                    partnerUnit: original.unit,
                    partnerManager: original.manager,
                    noticeDate1: original.notice1,
                    noticeDate2: original.notice2,
                    noticeDate3: original.notice3,
                    targetValue: original.goalPerformance,
                };

                // 이미지 필드명 매핑
                const imageMapping = {
                    'notice1Image': 'notice1Img',
                    'notice2Image': 'notice2Img', 
                    'notice3Image': 'notice3Img'
                };

                const images = {
                    [imageMapping[field]]: file
                };

                await updatePartnerInfo(updateData, images);
                
                // 데이터 다시 로드
                const refreshedList = await getPartnerList();
                setData(refreshedList);
            } catch (error) {
                alert("이미지 업로드 실패: " + error.message);
            }
        }
    };

    const handleImageDelete = async (rowId, field) => {
        if (window.confirm("정말로 삭제하시겠습니까?")) {
            try {
                const original = data.find(r => r.id === rowId);
                
                const updateData = {
                    partnerId: rowId,
                    partnerName: original.affiliateName,
                    partnerUnit: original.unit,
                    partnerManager: original.manager,
                    noticeDate1: original.notice1,
                    noticeDate2: original.notice2,
                    noticeDate3: original.notice3,
                    targetValue: original.goalPerformance,
                    [field]: null // 이미지 필드를 null로 설정
                };

                await updatePartnerInfo(updateData);
                
                // 데이터 다시 로드
                const refreshedList = await getPartnerList();
                setData(refreshedList);
            } catch (error) {
                alert("이미지 삭제 실패: " + error.message);
            }
        }
    };

    const isDateField = (field) => ['notice1', 'notice2', 'notice3'].includes(field);
    const isImageField = (field) => ['notice1Img', 'notice2Img', 'notice3Img'].includes(field);
    const isNumberField = (field) => {
        return field.includes('_db') || field.includes('_exam') || field.includes('_surgery') || field === 'goalPerformance';
    }
    
    const renderCell = (row, field) => {
        const isEditing = selectedCell?.rowId === row.id && selectedCell?.field === field;
        const tempData = tempRowData[row.id] || {};
        const displayValue = tempData[field] !== undefined ? tempData[field] : row[field];

        if (isEditing && !isImageField(field)) {
            return (
                <div className="cell-editing">
                    <input
                        className="cell-input"
                        type={isDateField(field) ? "date" : isNumberField(field) ? "number" : "text"}
                        value={cellValue}
                        onChange={(e) => setCellValue(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && saveChanges(row.id)}
                    />
                    <button className="cell-edit-btn" onClick={cancelEdit}>
                        <X size={15}/>
                    </button>
                    <button className="cell-edit-btn" onClick={handleCellSave}>
                        <Check size={15}/>
                    </button>
                </div>
            );
        }

        if (isDateField(field)) {
            const imageField = field + "Img";
            const imageObj = row[imageField];

            return (
                <div className="date-image-container">
                    <div onClick={() => handleCellClick(row.id, field, row[field])} className="cell-display">
                        {displayValue || <PencilLine size={16} />}
                    </div>
                    <div className="image-actions">
                        {imageObj ? (
                            <>
                                <img src={imageObj.url} alt="공지이미지" className="notice-image" />
                                <button className="image-delete-btn" onClick={() => handleImageDelete(row.id, imageField)}>
                                    <ImageOff size={16}/>
                                </button>
                            </>
                        ) : null}

                        <input
                            type="file"
                            accept="image/*"
                            id={`edit-${row.id}-${imageField}`}
                            style={{ display: "none" }}
                            onChange={(e) => handleImageUpload(row.id, imageField, e.target.files)}
                        />
                        {!imageObj && (
                            <label htmlFor={`edit-${row.id}-${imageField}`} className="image-upload-label">
                                <ImagePlus size={16} />
                            </label>
                        )}
                    </div>
                </div>
            );
        }

        return (
            <div onClick={() => handleCellClick(row.id, field, row[field])} className="cell-display">
                {displayValue || <PencilLine size={16} />}
            </div>
        );
    };

    const groupedName = {};
    data.forEach((item, index) => {
        if(!groupedName[item.affiliateName]){
            groupedName[item.affiliateName] = {rows: [], firstIndex: index};
        }
        groupedName[item.affiliateName].rows.push(item);
    });

    return (
        <div className="content-area">
            <div className="input-group">
                <label>제휴처명:
                    <input
                        type="text"
                        name="partnerName"
                        className="input"
                        value={formData.partnerName}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>단위:
                    <input
                        type="text"
                        name="partnerUnit"
                        className="input"
                        value={formData.partnerUnit}
                        onChange={handleInputChange}
                    />
                </label>
                <label>담당자:
                    <input
                        type="text"
                        name="partnerManager"
                        className="input"
                        value={formData.partnerManager}
                        onChange={handleInputChange}
                    />
                </label>
                <label>목표실적:
                    <input
                        type="number"
                        name="targetValue"
                        className="input"
                        value={formData.targetValue}
                        onChange={handleInputChange}
                    />
                </label>
                <label>공지 1차:
                    <input
                        type="date"
                        name="noticeDate1"
                        className="input"
                        value={formData.noticeDate1}
                        onChange={handleInputChange}
                    />
                </label>
                <label>공지 2차:
                    <input
                        type="date"
                        name="noticeDate2"
                        className="input"
                        value={formData.noticeDate2}
                        onChange={handleInputChange}
                    />
                </label>
                <label>공지 3차:
                    <input
                        type="date"
                        name="noticeDate3"
                        className="input"
                        value={formData.noticeDate3}
                        onChange={handleInputChange}
                    />
                </label>
                <button className="button" onClick={handleSubmit}>입력</button>
            </div>
            <div className="table-scroll">
                <table className="table" style={{ minWidth: showMonthly ? "4000px" : "1800px", tableLayout: "fixed" }}>
                    <thead>
                        <tr>
                            <th>제휴처명</th>
                            <th>단위</th>
                            <th>담당자</th>
                            <th style={{ width: "300px" }}>공지 1차</th>
                            <th style={{ width: "300px" }}>공지 2차</th>
                            <th style={{ width: "300px" }}>공지 3차</th>
                            <th style={{ width: "100px" }}>
                                <button className="button monthly-toggle-btn" onClick={() => setShowMonthly(!showMonthly)}>
                                    {showMonthly ? "월별 ◀" : "월별 ▶"}
                                </button>
                            </th>
                            {showMonthly && months.map(month => (
                                <th key={month.key}>
                                    <div>{month.name}</div>
                                    <div>DB|검사|수술</div>
                                </th>
                            ))}
                            <th>목표실적</th>
                            <th>업데이트</th>
                            <th>저장</th>
                            <th>삭제</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(groupedName).map(([affiliateName, group]) =>
                            group.rows.map((row, idx) => (
                            <tr key={row.id}>
                                {idx === 0 && (
                                    <td rowSpan={group.rows.length} style={{ verticalAlign: "middle" }}>
                                        {affiliateName}
                                    </td>
                                )}
                                <td>{renderCell(row, "unit")}</td>
                                <td>{renderCell(row, "manager")}</td>
                                <td>{renderCell(row, "notice1")}</td>
                                <td>{renderCell(row, "notice2")}</td>
                                <td>{renderCell(row, "notice3")}</td>
                                <td style={{ minWidth: "80px" }}></td>
                                {showMonthly && months.map(month => (
                                    <td key={month.key} className="monthly-td">
                                        <div className="monthly-cell">
                                            <div className="monthly-subcell">
                                                {renderCell(row, `${month.key}_db`)}
                                            </div>
                                            <div className="monthly-subcell">
                                                {renderCell(row, `${month.key}_exam`)}
                                            </div>
                                            <div className="monthly-subcell">
                                                {renderCell(row, `${month.key}_surgery`)}
                                            </div>
                                        </div>
                                    </td>
                                ))}
                                <td>{renderCell(row, "goalPerformance")}</td>
                                <td>{row.lastUpdated || getCurrentDate()}</td>
                                <td>
                                    <button className="button" onClick={() => saveChanges(row.id)}>
                                        저장
                                    </button>
                                </td>
                                <td>
                                    <button className="button" onClick={() => deleteRow(row.id)}>
                                        삭제
                                    </button>
                                </td>
                            </tr>
                        )))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AffiliateBusiness;