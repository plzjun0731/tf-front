import React, { useState } from "react";
import "../styles/AdminNotice.css";

function AdminNoticeWritePage({ setPage, onNoticeAdded }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);

  // localStorage 함수들을 컴포넌트 내부에 직접 정의
  const getNotices = () => {
    try {
      const notices = localStorage.getItem("notices");
      return notices ? JSON.parse(notices) : [];
    } catch (error) {
      console.error("공지사항 로드 실패:", error);
      return [];
    }
  };

  const saveNotices = (noticeList) => {
    try {
      localStorage.setItem("notices", JSON.stringify(noticeList));
      return true;
    } catch (error) {
      console.error("공지사항 저장 실패:", error);
      return false;
    }
  };

  const addNotice = (notice) => {
    try {
      const notices = getNotices();
      const newNotice = {
        ...notice,
        id: Date.now(),
        date: new Date().toISOString().split("T")[0],
        author: "관리자",
      };

      const updatedNotices = [newNotice, ...notices];
      saveNotices(updatedNotices);
      return newNotice;
    } catch (error) {
      console.error("공지사항 추가 실패:", error);
      return null;
    }
  };

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      const newNotice = addNotice({
        title: title.trim(),
        content: content.trim(),
        file: file ? file.name : null,
      });

      if (newNotice) {
        alert("공지사항이 등록되었습니다.");

        // 초기화
        setTitle("");
        setContent("");
        setFile(null);

        // 부모 컴포넌트에 알림
        if (onNoticeAdded) {
          onNoticeAdded(newNotice);
        }

        // 목록 페이지로 이동
        setPage("notice");
      } else {
        alert("공지사항 등록에 실패했습니다.");
      }
    } catch (error) {
      alert("공지사항 등록에 실패했습니다.");
      console.error("Error saving notice:", error);
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
    setTitle("");
    setContent("");
    setFile(null);
    setPage("notice");
  };

  return (
    <div className="admin-wrapper">
      <main className="main-content">
        <div className="notice-write-box">
          <h2>새 공지사항 작성</h2>

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
              rows="10"
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
              className="submit-btn"
              onClick={handleCancel}
              style={{ backgroundColor: "var(--white-25)" }}
            >
              취소
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminNoticeWritePage;
