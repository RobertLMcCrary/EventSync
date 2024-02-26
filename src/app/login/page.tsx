"use client";
import { useState } from 'react';
import { ArrowLongRightIcon, AtSymbolIcon, UserCircleIcon, LockClosedIcon } from "@heroicons/react/24/solid";

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('submit');
    };

    const inputStyle = {
        width: '100%',
        padding: '12px 15px',
        paddingLeft: '45px',
        borderRadius: '5px',
        filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.10))',
        masktype: 'ALPHA',
        marginBottom: '10px',
        fontSize: '16px',
        position: 'relative',
        fontfamily: 'Inter, sans-serif',
        color: 'black',
    };

    const iconStyle = {
        position: 'absolute',
        left: '12.5px',
        top: '50%',
        transform: 'translateY(-70%)',
        width: '24px',
        height: '24px',
        color: 'E0E0E0',
    };
    

    const buttonStyle = {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(37, 99, 235, 1)',
        filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.10))',
        masktype: 'ALPHA',
        color: 'white',
        padding: '12px 15px',
        borderRadius: '5px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px'
    };


    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ width: '450px', padding: '24px' }}>
                <h2 style={{ color: 'black', textAlign: 'left', fontSize: '24px', fontWeight: '600', marginBottom: '5px' }}>Log In</h2>
                <p style={{ color: '#BDBDBD', textAlign: 'left', fontSize: '14px', marginBottom: '10px' }}>
                    Dont't have an account?{' '}
                    <a style={{ textDecoration: 'underline', color: '#2196F3' }} href='https://google.com/'>Sign Up</a>
                </p>
                <form onSubmit={handleSubmit}>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={inputStyle}
                        />
                        <UserCircleIcon style={iconStyle} />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={inputStyle}
                        />
                        <LockClosedIcon style={iconStyle} />
                    </div>
                    <a style={{ color: '#2196F3', fontSize: "16px" }} href='https://google.com/'>Forgot Password?</a>
                    <button type="submit" style={buttonStyle}>
                        Log In 
                    </button>
                </form>
            </div>
        </div>
    );
}