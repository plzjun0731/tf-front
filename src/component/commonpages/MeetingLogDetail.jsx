import React, { useState } from "react";
import "../styles/MeetingLogBoard.css";

const MeetingLogWriteForm = ({ onSave, onCancel, initialData }) => {
  const [formData, setFormData] = useState(
    initialData || {
      subject: "",
      location: "",
      startDate: "",
      endDate: "",
      author: "",
      participants: "",
      absentees: "",
      content: "",
      conclusion: "",
      nextStep: "",
      followUp: [{ job: "", assignee: "", dueDate: "" }],
    }
  );
  const [showDateWarning, setShowDateWarning] = useState(false); // 일시 경고 상태
  const [showEndDateBeforeStartDateWarning, setShowEndDateBeforeStartDateWarning] = useState(false); // 종료 일시가 시작 일시보다 빠를 때 경고 상태
  const [followUpDateWarnings, setFollowUpDateWarnings] = useState(
    formData.followUp.map(() => false)
  ); // Follow-up 마감일 경고 상태
  const [showSubjectWarning, setShowSubjectWarning] = useState(false);
  const [showLocationWarning, setShowLocationWarning] = useState(false);
  const [showAuthorWarning, setShowAuthorWarning] = useState(false);
  const [showConclusionWarning, setShowConclusionWarning] = useState(false);
  const [showNextStepWarning, setShowNextStepWarning] = useState(false);
  const [showParticipantsWarning, setShowParticipantsWarning] = useState(false);
  const [showContentWarning, setShowContentWarning] = useState(false);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if ((field === "startDate" || field === "endDate") && value) {
      setShowDateWarning(false); // 날짜가 입력되면 경고 숨김
      setShowEndDateBeforeStartDateWarning(false); // 종료 일시 경고 숨김
    }
    if (field === "subject" && value) setShowSubjectWarning(false);
    if (field === "location" && value) setShowLocationWarning(false);
    if (field === "author" && value) setShowAuthorWarning(false);
    if (field === "conclusion" && value) setShowConclusionWarning(false);
    if (field === "nextStep" && value) setShowNextStepWarning(false);
    if (field === "participants" && value) setShowParticipantsWarning(false);
    if (field === "content" && value) setShowContentWarning(false);
  };

  const handleFollowUpChange = (index, field, value) => {
    const updatedFollowUp = [...formData.followUp];
    updatedFollowUp[index][field] = value;
    setFormData({ ...formData, followUp: updatedFollowUp });

    if (field === "dueDate") {
      const updatedWarnings = [...followUpDateWarnings];
      updatedWarnings[index] = false; // 날짜가 입력되면 경고 숨김
      setFollowUpDateWarnings(updatedWarnings);
    }
  };

  const addFollowUpItem = () => {
    setFormData((prev) => ({
      ...prev,
      followUp: [...prev.followUp, { job: "", assignee: "", dueDate: "" }],
    }));
    setFollowUpDateWarnings((prev) => [...prev, false]); // 새 항목에 대한 경고 상태 추가
  };

  const removeFollowUpItem = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      followUp: prev.followUp.filter((_, index) => index !== indexToRemove),
    }));
    setFollowUpDateWarnings((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    ); // 해당 항목의 경고 상태 제거
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let hasError = false;
    const newFollowUpDateWarnings = [...followUpDateWarnings];

    // 일시 유효성 검사
    if (!formData.startDate || isNaN(new Date(formData.startDate).getTime())) {
      setShowDateWarning(true);
      hasError = true;
    } else {
      setShowDateWarning(false);
    }

    // 종료 일시가 시작 일시보다 빠른 경우 경고
    if (formData.startDate && formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      setShowEndDateBeforeStartDateWarning(true);
      hasError = true;
    } else {
      setShowEndDateBeforeStartDateWarning(false);
    }

    // 개별 필드 유효성 검사
    if (!formData.subject) { setShowSubjectWarning(true); hasError = true; }
    else { setShowSubjectWarning(false); }
    if (!formData.location) { setShowLocationWarning(true); hasError = true; }
    else { setShowLocationWarning(false); }
    if (!formData.author) { setShowAuthorWarning(true); hasError = true; }
    else { setShowAuthorWarning(false); }
    if (!formData.participants) { setShowParticipantsWarning(true); hasError = true; }
    else { setShowParticipantsWarning(false); }
    if (!formData.content) { setShowContentWarning(true); hasError = true; }
    else { setShowContentWarning(false); }
    if (!formData.conclusion) { setShowConclusionWarning(true); hasError = true; }
    else { setShowConclusionWarning(false); }
    if (!formData.nextStep) { setShowNextStepWarning(true); hasError = true; }
    else { setShowNextStepWarning(false); }

    formData.followUp.forEach((item, index) => {
      if (!item.dueDate || isNaN(new Date(item.dueDate).getTime())) {
        newFollowUpDateWarnings[index] = true;
        hasError = true;
      } else {
        newFollowUpDateWarnings[index] = false;
      }
    });

    setFollowUpDateWarnings(newFollowUpDateWarnings);

    if (hasError) {
      return; // 에러가 있으면 저장하지 않음
    }

    onSave(formData);
  };

  const handleCancel = () => {
    if (window.confirm("작성 중인 내용이 사라집니다. 작성을 취소하시겠습니까?")) {
      onCancel();
      setFormData({
        subject: "",
        location: "",
        startDate: "",
        endDate: ""
      })
    }
  };

  return (
    <div className="meeting-log-write-container">
      <div className="meeting-log-header">
        <h2>{initialData ? "회의록 수정" : "새 회의록 작성"}</h2>
      </div>
      <form onSubmit={handleSubmit} className="meeting-log-form">
        {/* 회의 내용 섹션 */}
      <div className="form-section" style={{ gridArea: 'content' }}>
        <h2 className="section-title">회의 내용</h2>
        <table>
          <tbody>
            <tr>
              <td>주제</td>
              <td>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                />
                {showSubjectWarning && (
                  <p style={{ color: 'red', fontSize: '0.8em', marginTop: '5px' }}>
                    주제를 입력해주세요.
                  </p>
                )}
              </td>
            </tr>
            <tr>
              <td>장소</td>
              <td>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                />
                {showLocationWarning && (
                  <p style={{ color: 'red', fontSize: '0.8em', marginTop: '5px' }}>
                    장소를 입력해주세요.
                  </p>
                )}
              </td>
            </tr>
            <tr>
              <td>시작 일시</td>
              <td>
                <input
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                />
                {showDateWarning && (
                  <p style={{ color: 'red', fontSize: '0.8em', marginTop: '5px' }}>
                    시작 일시를 입력해주세요.
                  </p>
                )}
              </td>
            </tr>
            <tr>
              <td>종료 일시</td>
              <td>
                <input
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => handleChange("endDate", e.target.value)}
                />
                {showEndDateBeforeStartDateWarning && (
                  <p style={{ color: 'red', fontSize: '0.8em', marginTop: '5px' }}>
                    종료 일시는 시작 일시보다 빠를 수 없습니다.
                  </p>
                )}
              </td>
            </tr>
            <tr>
              <td>작성자</td>
              <td>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => handleChange("author", e.target.value)}
                />
                {showAuthorWarning && (
                  <p style={{ color: 'red', fontSize: '0.8em', marginTop: '5px' }}>
                    작성자를 입력해주세요.
                  </p>
                )}
              </td>
            </tr>
            <tr>
              <td>참여자</td>
              <td>
                <input
                  type="text"
                  value={formData.participants}
                  onChange={(e) =>
                    handleChange("participants", e.target.value)
                  }
                />
                {showParticipantsWarning && (
                  <p style={{ color: 'red', fontSize: '0.8em', marginTop: '5px' }}>
                    참여자를 입력해주세요.
                  </p>
                )}
              </td>
            </tr>
            <tr>
              <td>결석자</td>
              <td>
                <input
                  type="text"
                  value={formData.absentees}
                  onChange={(e) => handleChange("absentees", e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>내용</td>
              <td>
                <textarea
                  value={formData.content}
                  onChange={(e) => handleChange("content", e.target.value)}
                />
                {showContentWarning && (
                  <p style={{ color: 'red', fontSize: '0.8em', marginTop: '5px' }}>
                    내용을 입력해주세요.
                  </p>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 오른쪽 패널 (회의 요약 + Follow-up) */}
      <div className="right-panel" style={{ gridArea: 'right-panel' }}>
        {/* 회의 요약 섹션 */}
        <div className="form-section">
          <h2 className="section-title">회의 요약</h2>
          <table>
            <tbody>
              <tr>
                <td>결론</td>
                <td>
                  <textarea
                    value={formData.conclusion}
                    onChange={(e) =>
                      handleChange("conclusion", e.target.value)
                    }
                  />
                  {showConclusionWarning && (
                    <p style={{ color: 'red', fontSize: '0.8em', marginTop: '5px' }}>
                      결론을 입력해주세요.
                    </p>
                  )}
                </td>
              </tr>
              <tr>
                <td>다음 단계</td>
                <td>
                  <textarea
                    value={formData.nextStep}
                    onChange={(e) => handleChange("nextStep", e.target.value)}
                  />
                  {showNextStepWarning && (
                    <p style={{ color: 'red', fontSize: '0.8em', marginTop: '5px' }}>
                      다음 단계를 입력해주세요.
                    </p>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Follow-up 섹션 */}
        <div className="form-section follow-up-section">
          <h2 className="section-title">Follow-up</h2>
          <table>
            <thead>
              <tr>
                <th>No.</th>
                <th>작업</th>
                <th>실행자</th>
                <th>마감일</th>
                <th>삭제</th>
              </tr>
            </thead>
            <tbody>
              {formData.followUp.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <textarea
                      value={item.job}
                      onChange={(e) =>
                        handleFollowUpChange(index, "job", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={item.assignee}
                      onChange={(e) =>
                        handleFollowUpChange(index, "assignee", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      value={item.dueDate}
                      onChange={(e) =>
                        handleFollowUpChange(index, "dueDate", e.target.value)
                      }
                    />
                    {followUpDateWarnings[index] && (
                      <p style={{ color: 'red', fontSize: '0.7em', marginTop: '3px' }}>
                        유효한 마감일을 입력해주세요.
                      </p>
                    )}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeFollowUpItem(index)}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="button"
            className="add-btn"
            onClick={addFollowUpItem}
          >
            Follow-up 추가
          </button>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="form-buttons">
        <button type="submit">등록</button>
        <button type="button" onClick={handleCancel}>
          취소
        </button>
      </div>
    </form>
  </div>
  );
};

export default MeetingLogWriteForm;