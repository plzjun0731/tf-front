import React, { useState } from "react";
import "../styles/MeetingLogBoard.css";

const MeetingLogWriteForm = ({ onSave, onCancel, initialData }) => {
  const [formData, setFormData] = useState(
    initialData || {
      subject: "",
      location: "",
      date: "",
      author: "",
      participants: "",
      absentees: "",
      content: "",
      conclusion: "",
      nextStep: "",
      followUp: [
        { job: "", assignee: "", dueDate: "" },
        { job: "", assignee: "", dueDate: "" },
        { job: "", assignee: "", dueDate: "" },
        { job: "", assignee: "", dueDate: "" },
      ],
    }
  );

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFollowUpChange = (index, field, value) => {
    const updatedFollowUp = [...formData.followUp];
    updatedFollowUp[index][field] = value;
    setFormData({ ...formData, followUp: updatedFollowUp });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="meeting-log-form">
      <div className="meeting-form-layout">
        <h2>회의 내용</h2>
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
              </td>
            </tr>
            <tr>
              <td>일시</td>
              <td>
                <input
                  type="text"
                  value={formData.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                />
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
              </td>
            </tr>
            <tr>
              <td>참여자</td>
              <td>
                <input
                  type="text"
                  value={formData.participants}
                  onChange={(e) => handleChange("participants", e.target.value)}
                />
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
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="meeting-section">
        <h2>회의 요약</h2>
        <table>
          <tbody>
            <tr>
              <td>결론</td>
              <td>
                <textarea
                  value={formData.conclusion}
                  onChange={(e) => handleChange("conclusion", e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>다음 단계</td>
              <td>
                <textarea
                  value={formData.nextStep}
                  onChange={(e) => handleChange("nextStep", e.target.value)}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="meeting-section">
        <h2>Follow-up</h2>
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
            {formData.followUp.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <input
                    type="text"
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
                    type="text"
                    value={item.dueDate}
                    onChange={(e) =>
                      handleFollowUpChange(index, "dueDate", e.target.value)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="form-buttons">
        <button type="submit">등록</button>
        <button type="button" onClick={onCancel}>
          취소
        </button>
      </div>
    </form>
  );
};

export default MeetingLogWriteForm;
