import React, { useState, useEffect } from "react";
import { ImagePlus, PencilLine, X, Check, ImageOff } from "lucide-react";
import { insertPartnerInfo, getPartnerList, updatePartnerInfo, deletePartnerInfo } from "../../services/AffiliateBusinessApi";
import "../styles/AffiliateBusiness.css";

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
        goalPerformance: '' 
    });
    const [imageFiles, setImageFiles] = useState({});
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

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await getPartnerList();
                setData(data);
            } catch (error) {
                console.error('데이터 로드 실패:', error);
            }
        };
        loadData();
    }, []);

    const getCurrentDate = () => {
        const now = new Date();
        return now.toISOString().split('T')[0].replace(/-/g, '.');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const sendData = {
            partnerName: formData.affiliateName,
            partnerUnit: formData.unit,
            partnerManager: formData.manager,
            noticeDate1: formData.notice1,
            noticeDate2: formData.notice2,
            noticeDate3: formData.notice3,
            TargetValue: formData.goalPerformance
        }

        try {
            await insertPartnerInfo(sendData);

            const updatedList = await getPartnerList();

            setData(updatedList);
            setFormData({
                affiliateName: '',
                unit: '',
                manager: '',
                notice1: '',
                notice2: '',
                notice3: '',
                goalPerformance: ''
            });
            alert("제휴처가 등록되었습니다.");
        } catch (error) {
            alert("제휴처 등록 중 오류가 발생했습니다.");
            console.log(error);
        }
        // if (formData.affiliateName) {
        //     const currentDate = getCurrentDate();
        //     const monthlyData = {};
        //     months.forEach(month => {
        //         monthlyData[`${month.key}_db`] = '';
        //         monthlyData[`${month.key}_exam`] = '';
        //         monthlyData[`${month.key}_surgery`] = '';
        //     })
        //     setData([
        //         ...data,
        //         {
        //             ...formData,
        //             ...monthlyData,
        //             id: Date.now(),
        //             notice1Image: null,
        //             notice2Image: null,
        //             notice3Image: null,
        //             lastUpdated: currentDate
        //         }
        //     ]);
        //     setFormData({
        //         affiliateName: '',
        //         unit: '',
        //         manager: '',
        //         notice1: '',
        //         notice2: '',
        //         notice3: '',
        //         goalPerformance: ''
        //     });
        // }
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
        const valueToSet = tempData[field] !== undefined ? tempData[field] : (currentValue || '');
        setCellValue(valueToSet);
    };

    const saveChanges = async (rowId) => {
        const { field } = selectedCell || {};

        if (field) {
            try {
                const currentRow = data.find(row => row.id === rowId);
                if (!currentRow) {
                    alert('데이터를 찾을 수 없습니다.');
                    return;
                }

                const tempData = tempRowData[rowId] || {};
                
                const partnerData = {
                    partnerId: currentRow.id,
                    partnerName: tempData.affiliateName !== undefined ? tempData.affiliateName : currentRow.affiliateName,
                    partnerUnit: tempData.unit !== undefined ? tempData.unit : currentRow.unit,
                    partnerManager: tempData.manager !== undefined ? tempData.manager : currentRow.manager,
                    noticeDate1: tempData.notice1 !== undefined ? tempData.notice1 : currentRow.notice1,
                    noticeDate2: tempData.notice2 !== undefined ? tempData.notice2 : currentRow.notice2,
                    noticeDate3: tempData.notice3 !== undefined ? tempData.notice3 : currentRow.notice3,
                    TargetValue: tempData.goalPerformance !== undefined ? tempData.goalPerformance : currentRow.goalPerformance,
                };

                if (field === 'affiliateName') {
                    partnerData.partnerName = cellValue;
                } else if (field === 'unit') {
                    partnerData.partnerUnit = cellValue;
                } else if (field === 'manager') {
                    partnerData.partnerManager = cellValue;
                } else if (field === 'goalPerformance') {
                    partnerData.TargetValue = cellValue;
                } else if (field === 'notice1') {
                    partnerData.noticeDate1 = cellValue;
                } else if (field === 'notice2') {
                    partnerData.noticeDate2 = cellValue;
                } else if (field === 'notice3') {
                    partnerData.noticeDate3 = cellValue;
                }

                const images = imageFiles[rowId] || {};
                console.log('전송할 데이터:', partnerData);
                console.log('전송할 이미지:', images);

                await updatePartnerInfo(partnerData, images);

                const updatedList = await getPartnerList();
                setData(updatedList);
                alert('저장되었습니다.');

            } catch (error) {
                alert('저장에 실패했습니다. 다시 시도해 주세요.');
                console.error(error);
                return; 
            }
        }
        // cleanup
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

    const deleteRow = async (rowId) => {
        if (window.confirm("정말로 삭제하시겠습니까?")) {
            try {
                await deletePartnerInfo(rowId);

                const updatedList = await getPartnerList();
                setData(updatedList);

                setTempRowData(prev => {
                    const newData = { ...prev };
                    delete newData[rowId];
                    return newData;
                });

                setImageFiles(prev => {
                    const newData = { ...prev };
                    delete newData[rowId];
                    return newData;
                });

                if (selectedCell && selectedCell.rowId === rowId) {
                    setSelectedCell(null);
                    setCellValue('');
                }

                alert('삭제되었습니다.');
            } catch (error) {
                alert('삭제에 실패했습니다. 다시 시도해 주세요.');
                console.error(error);
            }
        }
    };

    const handleImageUpload = (rowId, field, files) => {
        if (files && files.length > 0) {
            const file = files[0];
            const reader = new FileReader();

            reader.onload = (e) => {
                const newImage = { url: e.target.result };

                setData(prev =>
                    prev.map(row =>
                        row.id === rowId
                            ? { ...row, [field]: newImage, lastUpdated: getCurrentDate() }
                            : row
                    )
                );
            };
            reader.readAsDataURL(file);
            setImageFiles(prev => ({
                ...prev,
                [rowId]: {
                    ...prev[rowId],
                    [field]: file 
                }
            }));
        }
    };

    const handleImageDelete = (rowId, field) => {
        if (window.confirm("정말로 삭제하시겠습니까?")) {
            setData(prev =>
                prev.map(row =>
                    row.id === rowId
                        ? { ...row, [field]: null, lastUpdated: getCurrentDate() }
                        : row
                )
            );

            setImageFiles(prev => {
                const updated = { ...prev };
                if (updated[rowId]) {
                    delete updated[rowId][field];
                    if (Object.keys(updated[rowId]).length === 0) {
                        delete updated[rowId];
                    }
                }
                return updated;
            });
            console.log('이미지 삭제:', { rowId, field });
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
        const displayValue = tempData[field] !== undefined ? tempData[field] : (row[field] || '');

        if (isEditing && !isImageField(field)) {
            return (
                <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                    <input
                        type={isDateField(field) ? "date" : isNumberField(field) ? "number" : "text"}
                        value={cellValue || ''}
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
            const imageField = field + "Img";
            const imageObj = row[imageField];

            return (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "2px" }}>
                    <div onClick={() => handleCellClick(row.id, field, row[field])} title="수정" style={{ cursor: "pointer"}}>
                        {displayValue || <PencilLine size={16} />}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "2px"}}>
                        {imageObj ? (
                            <>
                                <img src={imageObj.url} width={100} height={100} />
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
            <div className="table-scroll" style={{ overflowX: "auto" }}>
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
                                <div onClick={() => setShowMonthly(!showMonthly)} style={{ cursor: "pointer" }}>
                                    {showMonthly ? "월별 ◀" : "월별 ▶"}
                                </div>
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
                                    <td key={month.key} style={{ padding: "0", border: "1px solid #ccc" }}>
                                        <div style={{ display: "flex", height: "100%" }}>
                                            <div style={{ flex: 1, borderRight: "1px solid #ccc", padding: "8px 6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                {renderCell(row, `${month.key}_db`)}
                                            </div>
                                            <div style={{ flex: 1, borderRight: "1px solid #ccc", padding: "8px 6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                {renderCell(row, `${month.key}_exam`)}
                                            </div>
                                            <div style={{ flex: 1, padding: "8px 6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                {renderCell(row, `${month.key}_surgery`)}
                                            </div>
                                        </div>
                                    </td>
                                ))}
                                <td>{renderCell(row, "goalPerformance")}</td>
                                <td>{row.lastUpdated || getCurrentDate()}</td>
                                <td>
                                    <span 
                                        onClick={() => saveChanges(row.id)}
                                        style={{ 
                                            cursor: "pointer", 
                                            textDecoration: "underline",
                                            marginRight: "10px"
                                        }}
                                    >
                                        저장
                                    </span>
                                </td>
                                <td>
                                    <span 
                                        onClick={() => deleteRow(row.id)}
                                        style={{ 
                                            cursor: "pointer", 
                                            textDecoration: "underline"
                                        }}
                                    >
                                        삭제
                                    </span>
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