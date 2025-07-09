import React, { useState } from 'react';
import '../styles/AdminNotice.css';

function NoticeWritePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    // 백엔드 없으므로 콘솔 출력
    console.log('제목:', title);
    console.log('내용:', content);
    console.log('첨부파일:', file);

    alert('공지사항이 등록되었습니다 (가상)');
    
    // 초기화
    setTitle('');
    setContent('');
    setFile(null);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const fileInputRef = React.useRef();

  const handleFileButtonClick = () => {
    fileInputRef.current.click();
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
            <button className="file-btn" onClick={handleFileButtonClick}>첨부파일</button>
            <span>{file ? file.name : '선택된 파일 없음'}</span>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>

          <button className="submit-btn" onClick={handleSubmit}>등록</button>
        </div>
      </main>
    </div>
  );
}

export default NoticeWritePage;
