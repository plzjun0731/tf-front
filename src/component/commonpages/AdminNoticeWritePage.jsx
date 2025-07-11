import React, { useState } from "react";
import { writeNotice } from "../../services/api";
import "../styles/AdminNotice.css";

function AdminNoticeWritePage({ setPage, onNoticeAdded }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    if (loading) return;

    try {
      setLoading(true);

      const noticeData = {
        noticeTitle: title.trim(),
        noticeContent: content.trim(),
        noticeFile: file ? file.name : null,
      };

      console.log('전송할 데이터:', noticeData);

      const result = await writeNotice(noticeData);
      console.log('저장 성공:', result);

      alert("공지사항이 등록되었습니다.");

      setTitle("");
      setContent("");
      setFile(null);

      if (onNoticeAdded) {
        onNoticeAdded(result);
      }

      setPage("notice");
    } catch (error) {
      console.error('공지사항 등록 실패:', error);
      alert("다시 시도해주세요.")
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const fileInputRef = React.useRef();

  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleCancel = () => {
    if (window.confirm("작성 중인 내용이 사라집니다. 작성을 취소하시겠습니까?")) {
      setTitle("");
      setContent("");
      setFile(null);
      setPage("notice");
    }
  };

  return (
    <div className="notice-page-container">
          <div className="notice-header">
          <h2>새 공지사항 작성</h2>
        </div>
          <div className="form-group">
            <label>제목</label>
            <input
              type="text"
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>내용</label>
            <textarea
              rows="20"
              placeholder="내용을 입력하세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="form-group file-group">
            <button className="file-btn" onClick={handleFileButtonClick}>
              첨부파일
            </button>
            <span>{file ? file.name : "선택된 파일 없음"}</span>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button className="submit-btn" onClick={handleSubmit}>
              등록
            </button>
            <button
              className="cancel-btn"
              onClick={handleCancel}
            >
              취소
            </button>
          </div>
        </div>
  );
}

export default AdminNoticeWritePage;
