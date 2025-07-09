import React, { useState } from "react";
import "../styles/AdminAccount.css";

function AdminAccountPage() {
    const [form, setForm] = useState({
        name: '',
        id: '',
        password: '',
        email: '',
        tel: ''
    });

    const [users, setUsers] = useState([
    
    ]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        /*
        try {
            const response = await fetch("/api/account", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            });

            if (!response.ok) {
                throw new Error("계정 등록 실패");
            }

            const result = await response.json();

            setUsers([...users, {index: users.length + 1, ...form}])

            setForm({
                name: '',
                id: '',
                password: '',
                email: '',
                tel: ''
            });
            alert("계정이 등록되었습니다. ");            
        } catch (error) {
            alert("계정 등록 중 오류가 발생했습니다.")
        }
        */
        // 새 사용자를 목록에 추가
        const newUser = {
            index: users.length + 1,
            ...form
        };
        
        setUsers([...users, newUser]);
        
        // 폼 초기화
        setForm({
            name: '',
            id: '',
            password: '',
            email: '',
            tel: ''
        });
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            [name]: value
        }))
    }

    return (
        <>
            <div className="content-area">
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>이름: 
                            <input 
                                className="input" 
                                type="text" 
                                name="name"
                                value={form.name} 
                                onChange={handleChange}
                                placeholder="OOO" 
                                required
                            />
                        </label>
                        <label>아이디: 
                            <input 
                                className="input" 
                                type="text" 
                                name="id"
                                value={form.id}
                                onChange={handleChange} 
                                placeholder="ID"
                                required
                            />
                        </label>
                        <label>비밀번호: 
                            <input 
                                className="input" 
                                type="password" 
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Password"
                                required
                            />
                        </label>
                        <label>이메일:  
                            <input 
                                className="input" 
                                type="email" 
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="@email" 
                                required
                            />
                        </label>
                        <label>전화번호: 
                            <input 
                                className="input" 
                                type="tel" 
                                name="tel"
                                value={form.tel}
                                onChange={handleChange}
                                placeholder="010-0000-0000"
                                required
                            />
                        </label>
                        <button className="button" type="submit">저장</button>
                    </div>
                </form>
                <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>이름</th>
                            <th>아이디</th>
                            <th>비밀번호</th>
                            <th>이메일</th>
                            <th>전화번호</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.index}>
                                <td>{user.index}</td>
                                <td>{user.name}</td>
                                <td>{user.id}</td>
                                <td>{user.password}</td>
                                <td>{user.email}</td>
                                <td>{user.tel}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>  
            </div>                  
        </>
    );
}

export default AdminAccountPage;
