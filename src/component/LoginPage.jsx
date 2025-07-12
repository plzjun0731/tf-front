// LoginPage.jsx
import React, { useState } from "react";
import { loginUser } from "../services/LoginApi";
import "./styles/LoginPage.css";

function LoginPage({ onLoginSuccess }) {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const data = await loginUser({ memberId: userName, memberPw: password });

            if (data.status === 0) {
                alert("로그인 실패: 회원 정보가 없습니다.");
            } else if (data.status === 1) {
                onLoginSuccess("admin");
            } else if (data.status === 2) {
                onLoginSuccess("guest");
            } else {
                alert("알 수 없는 응답입니다. 관리자에게 문의하세요.");
            }
        } catch (error) {
            console.error("로그인 요청 중 오류 발생:", error);
            alert("로그인 실패: 올바른 ID와 비밀번호를 입력해주세요.");
        }

    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    id="userName"
                    name="userName"
                    placeholder="Username"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                />
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default LoginPage;
