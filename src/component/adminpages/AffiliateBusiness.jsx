import React, { useState, useEffect } from "react";
import { ImagePlus, PencilLine, X, Check, ImageOff } from "lucide-react";

function AffiliateBusiness() {
    const [data, setData] = useState([]);
    const [showMonthly, setShowMonthly] = useState(false);
    const [formData, setFormData] = useState({
        affiliateName: '',
        unit: '',
        manager: '',
        notice1: '',
        notice2: '',
        notice3: '',
        goalPerformance: ''  // 통일: goalPerformance 사용
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

    const getCurrentDate = () => {
        const now = new Date();
        return now.toISOString().split('T')[0].replace(/-/g, '.');
    }

    const handleSubmit = () => {
        if (formData.affiliateName) {
            const currentDate = getCurrentDate();
            const monthlyData = {};
            months.forEach(month => {
                monthlyData[`${month.key}_db`] = '';
                monthlyData[`${month.key}_exam`] = '';
                monthlyData[`${month.key}_surgery`] = '';
            })
            setData([
                ...data,
                {
                    ...formData,
                    ...monthlyData,
                    id: Date.now(),
                    notice1Image: null,
                    notice2Image: null,
                    notice3Image: null,
                    lastUpdated: currentDate
                }
            ]);
            setFormData({
                affiliateName: '',
                unit: '',
                manager: '',
                notice1: '',
                notice2: '',
                notice3: '',
                goalPerformance: ''
            });
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

    const saveChanges = (rowId) => {
        const { field } = selectedCell || {};
        const currentDate = getCurrentDate();

        if (field) {
            setTempRowData(prev => ({
                ...prev,
                [rowId]: {
                    ...prev[rowId],
                    [field]: cellValue
                }
            }));
        }

        setData(prevData =>
            prevData.map(row =>
                row.id === rowId
                    ? { ...row, 
                        ...tempRowData[rowId], 
                        ...(field ? { [field]: cellValue } : {}),
                        lastUpdated: currentDate
                    }
                    : row
            )
        );

        setTempRowData(prev => {
            const updated = { ...prev };
            delete updated[rowId];
            return updated;
        });

        setSelectedCell(null);
        setCellValue('');
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

    const deleteRow = (rowId) => {
        if (window.confirm("정말로 삭제하시겠습니까?")) {
            setData(data.filter(row => row.id !== rowId));
            setTempRowData(prev => {
                const newData = { ...prev };
                delete newData[rowId];
                return newData;
            });
            if (selectedCell && selectedCell.rowId === rowId) {
                setSelectedCell(null);
                setCellValue('');
            }
        }
    };

    const handleImageUpload = (rowId, field, files) => {
        if (files && files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                const newImage = {
                    url: e.target.result,
                    name: file.name
                };

                const currentDate = getCurrentDate();

                setData(prev =>
                    prev.map(row =>
                        row.id === rowId
                            ? { ...row, [field]: newImage, lastUpdated: currentDate }
                            : row
                    )
                );
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageDelete = (rowId, field) => {
        if (window.confirm("정말로 삭제하시겠습니까?")) {
            const currentDate = getCurrentDate();
            setData(prev =>
                prev.map(row =>
                    row.id === rowId
                        ? { ...row, [field]: null, lastUpdated: currentDate }
                        : row
                )
            );
        }
    };

    const isDateField = (field) => ['notice1', 'notice2', 'notice3'].includes(field);
    const isImageField = (field) => ['notice1Image', 'notice2Image', 'notice3Image'].includes(field);
    const isNumberField = (field) => {
        return field.includes('_db') || field.includes('_exam') || field.includes('_surgery') || field === 'goalPerformance';
    }
    
    const renderCell = (row, field) => {
        const isEditing = selectedCell?.rowId === row.id && selectedCell?.field === field;
        const tempData = tempRowData[row.id] || {};
        const displayValue = tempData[field] !== undefined ? tempData[field] : row[field];

        if (isEditing && !isImageField(field)) {
            return (
                <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                    <input
                        type={isDateField(field) ? "date" : isNumberField(field) ? "number" : "text"}
                        value={cellValue}
                        onChange={(e) => setCellValue(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && saveChanges(row.id)}
                        style={{ width: isNumberField(field) ? "80px" : "auto" }}
                    />
                    <button 
                        onClick={cancelEdit} 
                        title="변경취소"
                        style={{ 
                            cursor: "pointer", 
                            background: "none", 
                            border: "none", 
                            padding: "2px"
                        }}
                    >
                        <X size={15}/>
                    </button>
                    <button 
                        onClick={handleCellSave} 
                        title="변경"
                        style={{ 
                            cursor: "pointer", 
                            background: "none", 
                            border: "none", 
                            padding: "2px"
                        }}
                    >
                        <Check size={15}/>
                    </button>
                </div>
            );
        }

        if (isDateField(field)) {
            const imageField = field + "Image";
            const imageObj = row[imageField];

            return (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "2px" }}>
                    <div onClick={() => handleCellClick(row.id, field, row[field])} title="수정" style={{ cursor: "pointer"}}>
                        {displayValue || <PencilLine size={16} />}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "2px"}}>
                        {imageObj ? (
                            <>
                                <img src={imageObj.url} alt={imageObj.name} width={100} height={100} />
                                <div
                                    onClick={() => handleImageDelete(row.id, imageField)}
                                    style={{ cursor: "pointer"}}
                                    title="이미지 삭제"
                                >
                                    <ImageOff size={16}/>
                                </div>
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
                            <label htmlFor={`edit-${row.id}-${imageField}`} title="이미지 추가" style={{ cursor: "pointer" }}>
                                <ImagePlus size={16} />
                            </label>
                        )}
                    </div>
                </div>
            );
        }

        return (
            <div onClick={() => handleCellClick(row.id, field, row[field])} 
                title="수정" 
                style={{ cursor: "pointer" }}>
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
            {/* 입력 폼 */}
            <div className="input-group">
                <label>제휴처명:
                    <input
                        type="text"
                        name="affiliateName"
                        className="input"
                        value={formData.affiliateName}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>단위:
                    <input
                        type="text"
                        name="unit"
                        className="input"
                        value={formData.unit}
                        onChange={handleInputChange}
                    />
                </label>
                <label>담당자:
                    <input
                        type="text"
                        name="manager"
                        className="input"
                        value={formData.manager}
                        onChange={handleInputChange}
                    />
                </label>
                <label>목표실적:
                    <input
                        type="number"
                        name="goalPerformance"
                        className="input"
                        value={formData.goalPerformance}
                        onChange={handleInputChange}
                    />
                </label>
                <label>공지 1차:
                    <input
                        type="date"
                        name="notice1"
                        className="input"
                        value={formData.notice1}
                        onChange={handleInputChange}
                    />
                </label>
                <label>공지 2차:
                    <input
                        type="date"
                        name="notice2"
                        className="input"
                        value={formData.notice2}
                        onChange={handleInputChange}
                    />
                </label>
                <label>공지 3차:
                    <input
                        type="date"
                        name="notice3"
                        className="input"
                        value={formData.notice3}
                        onChange={handleInputChange}
                    />
                </label>
                <button className="button" onClick={handleSubmit}>입력</button>
            </div>

            {/* 월별 실적 토글 버튼 */}
            <div style={{ marginBottom: "10px" }}>
                <button 
                    className="button"
                    onClick={() => setShowMonthly(!showMonthly)}
                >
                    {showMonthly ? "월별 실적 숨기기" : "월별 실적 보기"}
                </button>
            </div>

            {/* 테이블 스크롤 컨테이너 */}
            <div style={{ overflowX: "auto" }}>
                <table className="table" style={{ minWidth: showMonthly ? "2000px" : "800px" }}>
                    <thead>
                        <tr>
                            <th>제휴처명</th>
                            <th>단위</th>
                            {!showMonthly && <th>담당자</th>}
                            {!showMonthly && <th>공지 1차</th>}
                            {!showMonthly && <th>공지 2차</th>}
                            {!showMonthly && <th>공지 3차</th>}
                            {showMonthly && months.map(month => (
                                <th key={month.key} style={{ minWidth: "150px" }}>
                                    <div>{month.name}</div>
                                    <div style={{ fontSize: "12px", opacity: "0.8" }}>DB/검사/수술</div>
                                </th>
                            ))}
                            {!showMonthly && <th>목표실적</th>}
                            {!showMonthly && <th>업데이트</th>}
                            <th>저장/삭제</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(groupedName).map(([affiliateName, group]) =>
                            group.rows.map((row, idx) => (
                            <tr key={row.id}>
                                {idx === 0 && (
                                <td rowSpan={group.rows.length} style={{ verticalAlign: "middle", fontWeight: "bold" }}>
                                    {affiliateName}
                                </td>
                                )}
                                <td>{renderCell(row, "unit")}</td>
                                {!showMonthly && <td>{renderCell(row, "manager")}</td>}
                                {!showMonthly && <td>{renderCell(row, "notice1")}</td>}
                                {!showMonthly && <td>{renderCell(row, "notice2")}</td>}
                                {!showMonthly && <td>{renderCell(row, "notice3")}</td>}
                                {showMonthly && months.map(month => (
                                    <td key={month.key} style={{ padding: "0", border: "1px solid #ccc" }}>
                                        <div style={{ display: "flex", height: "100%" }}>
                                            <div style={{ flex: 1, borderRight: "1px solid #ccc", padding: "6px 4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                {renderCell(row, `${month.key}_db`)}
                                            </div>
                                            <div style={{ flex: 1, borderRight: "1px solid #ccc", padding: "6px 4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                {renderCell(row, `${month.key}_exam`)}
                                            </div>
                                            <div style={{ flex: 1, padding: "6px 4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                {renderCell(row, `${month.key}_surgery`)}
                                            </div>
                                        </div>
                                    </td>
                                ))}
                                <td>{renderCell(row, "goalPerformance")}</td>
                                <td style={{ fontSize: "12px" }}>
                                    {row.lastUpdated || getCurrentDate()}
                                </td>
                                <td>
                                    <span style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => saveChanges(row.id)}>저장</span>
                                    <span style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => deleteRow(row.id)}>삭제</span>
                                </td>
                            </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AffiliateBusiness;