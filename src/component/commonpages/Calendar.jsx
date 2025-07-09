import React, { useState, useEffect } from "react";

function Calendar() {
  const [calendarData, setCalendarData] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [events, setEvents] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [newEvent, setNewEvent] = useState("");

  useEffect(() => {
    generateCalendar(year, month);
    loadEvents();
  }, [year, month]);

  // 📅 캘린더 생성
  const generateCalendar = (y, m) => {
    const firstDay = new Date(y, m, 1).getDay(); // 일요일 = 0
    const lastDate = new Date(y, m + 1, 0).getDate();
    const today = new Date().toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" });

    const result = [];
    let week = new Array(firstDay).fill(null); // 시작 요일만큼 null

    for (let day = 1; day <= lastDate; day++) {
      const date = new Date(y, m, day);
      const localDate = date.toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" });

      week.push({
        day,
        isToday: localDate === today,
        fullDate: `${y}-${String(m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      });

      if (date.getDay() === 6 || day === lastDate) {
        while (week.length < 7) week.push(null);
        result.push(week);
        week = [];
      }
    }

    setCalendarData(result);
  };

  // 🔁 이전/다음 월
  const handlePrevMonth = () => {
    if (month === 0) {
      setYear(prev => prev - 1);
      setMonth(11);
    } else {
      setMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setYear(prev => prev + 1);
      setMonth(0);
    } else {
      setMonth(prev => prev + 1);
    }
  };

  // 📥 일정 입력 열기
  const openEventPopup = (fullDate) => {
    setSelectedDate(fullDate);
    setNewEvent(events[fullDate] || "");
  };

  // ✅ 일정 저장 (로컬스토리지 + UI 상태)
  const saveEvent = () => {
    const updated = { ...events, [selectedDate]: newEvent };
    setEvents(updated);
    localStorage.setItem("calendarEvents", JSON.stringify(updated));

    // 🔽 백엔드와 연동할 때 사용될 코드 (주석 처리)
    /*
    fetch('/api/saveEvent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: selectedDate, event: newEvent }),
    });
    */

    setSelectedDate(null);
    setNewEvent("");
  };

  const loadEvents = () => {
    const saved = JSON.parse(localStorage.getItem("calendarEvents") || "{}");
    setEvents(saved);
  };

  return (
    <div style={{ width: "380px", margin: "auto", textAlign: "center", fontFamily: "sans-serif" }}>
      {/* 🔄 월 변경 헤더 */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
        <button onClick={handlePrevMonth}>◀️ 이전 달</button>
        <h2>{year}년 {month + 1}월</h2>
        <button onClick={handleNextMonth}>다음 달 ▶️</button>
      </div>

      {/* 📆 캘린더 테이블 */}
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            {["일", "월", "화", "수", "목", "금", "토"].map((d, i) => (
              <th key={i} style={{ color: i === 0 ? "red" : i === 6 ? "blue" : "black" }}>{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calendarData.map((week, i) => (
            <tr key={i}>
              {week.map((cell, j) => (
                <td
                  key={j}
                  style={{
                    padding: "8px",
                    height: "60px",
                    border: "1px solid #ddd",
                    verticalAlign: "top",
                    cursor: cell ? "pointer" : "default",
                    backgroundColor: cell?.isToday ? "#fff7cc" : "white",
                    color: j === 0 ? "red" : j === 6 ? "blue" : "black"
                  }}
                  onClick={() => cell && openEventPopup(cell.fullDate)}
                >
                  <div><strong>{cell?.day || ""}</strong></div>
                  <div style={{ fontSize: "12px", marginTop: "4px", wordWrap: "break-word" }}>
                    {cell?.fullDate && events[cell.fullDate]}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* 📝 팝업 입력 창 */}
      {selectedDate && (
        <div
          style={{
            position: "fixed",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -30%)",
            background: "white",
            border: "1px solid #ccc",
            padding: "16px",
            boxShadow: "0 0 10px rgba(0,0,0,0.2)",
            zIndex: 1000,
          }}
        >
          <h3>{selectedDate} 일정 추가</h3>
          <textarea
            rows={4}
            style={{ width: "100%", marginBottom: "8px" }}
            value={newEvent}
            onChange={(e) => setNewEvent(e.target.value)}
          />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
            <button onClick={() => setSelectedDate(null)}>취소</button>
            <button onClick={saveEvent}>저장</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;
