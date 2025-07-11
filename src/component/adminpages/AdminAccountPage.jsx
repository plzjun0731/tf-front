// AdminAccountPage.jsx
import React, { useState, useEffect } from "react";
import { createUserAccount, getUserAccount } from "../../services/api";
import "../styles/AdminAccount.css";

function AdminAccountPage() {
    const [form, setForm] = useState({
        guestName: '',
        userId: '',
        userPassword: '',
        email: '',
        tel: '',
        userRole: 'guest'
    });

    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const userList = await getUserAccount();
            setUsers(userList);
            } catch (error) {
                alert(error.message);
            }
        }
        fetchUsers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const sendData = {
            memberName: form.guestName,
            memberId: form.userId,
            memberPw: form.userPassword,
            memberEmail: form.email,
            memberPhone: form.tel,
            memberRole: form.userRole === 'guest' ? 2 : 1
        }

        try {
            const result = await createUserAccount(sendData);

            setUsers([...users, { index: users.length + 1, ...result }]);
            `setForm({
                guestName: "",
                userId: "",
                userPassword: "",
                email: "",
                tel: "",
                userRole: "guest"
            });`
            alert("계정이 등록되었습니다.");
        } catch (error) {
            alert("계정 등록 중 오류가 발생했습니다.");
            console.error(error);
        }
    
        // setUsers([...users, { index: users.length + 1, ...form }]);
        // setForm({
        //     guestName: "",
        //     userId: "",
        //     userPassword: "",
        //     email: "",
        //     tel: "",
        //     userRole: "guest"
        // });
        // alert("계정이 등록되었습니다.");
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            [name]: value
        }))
    }

    return (
        <div className="content-area">
            <form onSubmit={handleSubmit} autoComplete="off">
                <div className="input-group">
                    <label>이름: 
                        <input 
                            className="input" 
                            type="text" 
                            name="guestName"
                            onChange={handleChange}
                            placeholder="OOO" 
                            autoComplete="off"
                            required
                        />
                    </label>
                    <label>아이디: 
                        <input 
                            key="userId"
                            className="input" 
                            type="text" 
                            name="userId"
                            onChange={handleChange} 
                            placeholder="ID"
                            autoComplete="off"
                        />
                    </label>
                    <label>비밀번호: 
                        <input 
                            key="userPassword"
                            className="input" 
                            type="password" 
                            name="userPassword"
                            onChange={handleChange}
                            placeholder="Password"
                            autoComplete="new-password"
                        />
                    </label>
                    <label>이메일:  
                        <input 
                            className="input" 
                            type="email" 
                            name="email"
                            onChange={handleChange}
                            placeholder="@email" 
                            autoComplete="off"
                        />
                    </label>
                    <label>전화번호: 
                        <input 
                            className="input" 
                            type="tel" 
                            name="tel"
                            onChange={handleChange}
                            placeholder="010-0000-0000"
                            autoComplete="off"
                        />
                    </label>
                    <label>계정 구분: 
                        <select
                            className="input"
                            name="userRole"
                            onChange={handleChange}
                        >
                            <option value="guest" style={{color: "#1F2D3D"}}>게스트</option>
                            <option value="admin" style={{color: "#1F2D3D"}}>관리자</option>
                        </select>
                    </label>
                    <button className="adac-save-button" type="submit">저장</button>
                </div>
            </form>
            <table className="table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>이름</th>
                        <th>아이디</th>
                        <th>이메일</th>
                        <th>전화번호</th>
                        <th>계정구분</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.index}>
                            <td>{user.index}</td>
                            <td>{user.memberName}</td>
                            <td>{user.memberId}</td>
                            <td>{user.memberEmail}</td>
                            <td>{user.memberPhone}</td>
                            <td>{user.userRole === 'guest' ? '게스트' : '관리자'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>  
        </div>                  
    );
}

export default AdminAccountPage;
