import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { useTeamData } from "./TeamDataContext";
import '../../styles/admin/TeamManage/PerformanceManagement.css';

const PerformanceManagement = () => {
    const { teamData, teamId, teamName, updateTeamData, deletePerformance } = useTeamData();
   
    const [editingCell, setEditingCell] = useState(null); // { rowIndex, colKey }
    const [cellValue, setCellValue] = useState('');

    // 저장 버튼 누르기 전까지는 임시 데이터
    const [performanceData, setPerformanceData] = useState(() => {
        return teamData.performance || [];
    });

    React.useEffect(() => {
        setPerformanceData(teamData.performance || []);
    }, [teamId, teamData.performance]);

    const handleCellClick = (rowIndex, colKey, value) => {
        setEditingCell({ rowIndex, colKey });
        setCellValue(value);
    };

    const handleCellChange = (e) => {
        let value = e.target.value;
        const currentYear = new Date().getFullYear();

        if (editingCell) {
            if (editingCell.colKey === 'achievedPersonnel') {
                if (value === '' || value === null) {
                    // 빈 값 허용
                } else {
                    value = parseInt(value, 10);
                    if (isNaN(value) || value < 0) {
                        value = 0; // 음수 또는 유효하지 않은 값은 0으로 처리
                    }
                }
            } else if (editingCell.colKey === 'year') {
                if (value === '' || value === null) {
                    // 빈 값 허용
                } else {
                    value = parseInt(value, 10);
                    if (isNaN(value) || value > currentYear) {
                        alert(`연도는 ${currentYear}년까지만 입력 가능합니다.`);
                        value = currentYear; // 유효하지 않은 연도는 현재 연도로 설정
                    }
                }
            }
        }
        setCellValue(value);
    };

    const handleCellBlur = (rowIndex, colKey) => {
        const updatedData = performanceData.map((row, idx) => {
            if (idx === rowIndex) {
                return { ...row, [colKey]: cellValue };
            }
            return row;
        });
        updateTeamData('performance', updatedData);
        setEditingCell(null);
    };

    const handleAddYear = () => {
        const currentYear = new Date().getFullYear();

        let newYearToAdd;

        if (performanceData.length === 0) {
            newYearToAdd = currentYear;
        } else {
            const maxYearInTable = Math.max(...performanceData.map(data => data.year));
            if (maxYearInTable >= currentYear) {
                alert(`더 이상 연도를 추가할 수 없습니다. ${currentYear}년이 최대 연도입니다.`);
                return;
            }
            newYearToAdd = maxYearInTable + 1;
        }

        // 이미 존재하는 연도인지 확인
        if (performanceData.some(data => data.year === newYearToAdd)) {
            alert(`${newYearToAdd}년은 이미 존재합니다.`);
            return;
        }

        const newEntry = { 
            year: newYearToAdd, 
            achievedPersonnel: '',
            id: Date.now(), // 고유 ID 생성};
            teamId: teamId
        };

        const updatedData = [...performanceData, newEntry];
        updatedData.sort((a, b) => a.year - b.year);

        setPerformanceData(updatedData);
        console.log(performanceData);
    };

    const handleDeleteRow = (yearToDelete) => {
        if (!window.confirm(`${yearToDelete}년의 실적 데이터를 삭제하시겠습니까?`)) return;
        const itemToDelete = performanceData.filter(row => row.year === yearToDelete);
        if (itemToDelete) {
            const updatedData = performanceData.filter(row => row.year !== yearToDelete);
            setPerformanceData(updatedData);
            updateTeamData('performance', updatedData);
        }
    };

    const handleSaveAll = () => {
        updateTeamData('performance', performanceData);
        alert(`${teamName} 팀의 실적 데이터가 저장되었습니다.`);
    };

    return (
        <div className="performance-management-container">
            <div className="performance-header-controls">
                <span style={{ display:"flex", alignItems:"center", gap:"6px", color:"white", fontSize:"15px"}}>
                    <Info size={22}/>셀을 클릭하여 수정할 수 있습니다.
                </span>
                <button className="save-all-button" onClick={handleSaveAll}>저장</button>
            </div>
            <div className="performance-table-section">
                <button className="add-year-button" onClick={handleAddYear}>연도 추가</button>
                <table>
                    <thead>
                        <tr>
                            <th>연도</th>
                            <th>실적 인원수</th>
                            <th>작업</th>
                        </tr>
                    </thead>
                    <tbody>
                        {performanceData.length === 0 ? (
                            <tr>
                                <td colSpan="3" style={{fontStyle:"italic"}}>등록된 실적이 없습니다.</td>
                            </tr>
                        ) : (
                            performanceData.map((data, rowIndex) => (
                                <tr key={data.year}>
                                    <td onClick={() => handleCellClick(rowIndex, 'year', data.year)}>
                                        {editingCell && editingCell.rowIndex === rowIndex && editingCell.colKey === 'year' ? (
                                            <input
                                                type="number"
                                                value={cellValue}
                                                onChange={handleCellChange}
                                                onBlur={() => handleCellBlur(rowIndex, 'year')}
                                                autoFocus
                                            />
                                        ) : (
                                            data.year
                                        )}
                                    </td>
                                    <td onClick={() => handleCellClick(rowIndex, 'achievedPersonnel', data.achievedPersonnel)}>
                                        {editingCell && editingCell.rowIndex === rowIndex && editingCell.colKey === 'achievedPersonnel' ? (
                                            <input
                                                type="number"
                                                value={cellValue}
                                                onChange={handleCellChange}
                                                onBlur={() => handleCellBlur(rowIndex, 'achievedPersonnel')}
                                                autoFocus
                                            />
                                        ) : (
                                            data.achievedPersonnel
                                        )}
                                    </td>
                                    <td>
                                        <button 
                                            className="delete-button"
                                            onClick={() => handleDeleteRow(data.year)}
                                        >삭제</button>
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

export default PerformanceManagement;
