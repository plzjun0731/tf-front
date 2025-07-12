import React from "react";
import "../styles/MeetingLogBoard.css";

const MeetingLogDetail = ({
  log,
  onBack,
  onDelete,
  onEdit,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  currentIndex,
  totalCount,
}) => {
  if (!log) return <p>회의록을 선택해주세요.</p>;

  return (
    <div className="meeting-log-detail-form">
      <div className="form-section">
          <h2 className="section-title">회의 내용</h2>
          <table>
            <tbody>
              <tr>
                <th>주제</th>
                <td>{log.subject}</td>
              </tr>
              <tr>
                <th>장소</th>
                <td>{log.location}</td>
              </tr>
              <tr>
                <th>일시</th>
                <td>
                  {new Date(log.date).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  (
                  {new Date(log.date).toLocaleDateString("ko-KR", {
                    weekday: "short",
                  })}
                  )
                </td>
              </tr>
              <tr>
                <th>작성자</th>
                <td>{log.author}</td>
              </tr>
              <tr>
                <th>참여자</th>
                <td>{log.participants}</td>
              </tr>
              <tr>
                <th>결석자</th>
                <td>{log.absentees}</td>
              </tr>
              <tr>
                <th>내용</th>
                <td className="pre-line">{log.content}</td>
              </tr>
            </tbody>
          </table>
        </div>

      <div className="right-panel">
        <div className="form-section">
          <h2 className="section-title">회의 요약</h2>
          <table>
            <tbody>
              <tr>
                <th>결론</th>
                <td>{log.conclusion}</td>
              </tr>
              <tr>
                <th>다음 단계</th>
                <td>{log.nextStep}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="form-section follow-up-section">
          <h2 className="section-title">Follow-up</h2>
          <table>
            <thead>
              <tr>
                <th>No.</th>
                <th>작업</th>
                <th>실행자</th>
                <th>마감일</th>
              </tr>
            </thead>
            <tbody>
              {log.followUp?.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.job}</td>
                  <td>{item.assignee}</td>
                  <td>
                    {new Date(item.dueDate).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    (
                    {new Date(item.dueDate).toLocaleDateString("ko-KR", {
                      weekday: "short",
                    })}
                    )
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="detail-buttons">
        <button onClick={onBack}>목록으로</button>
        <button onClick={() => onEdit(log.id)}>수정</button>
        <button onClick={() => onDelete(log.id)}>삭제</button>
      </div>
    </div>
  );
};

export default MeetingLogDetail;
