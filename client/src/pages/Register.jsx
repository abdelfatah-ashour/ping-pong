import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Context-Api/Auth';
import { InputForm } from '../components/InputForm';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../API';

export default function Register(props) {
    let history = useHistory();
    const { Auth } = useContext(AuthContext);

    // set initial state of user
    const [user, setUser] = useState({
        username: '',
        email: '',
        password: '',
    });

    useEffect(() => {
        document.title = 'Register';
        // check if you have token  so when are you want register new account ? so return to Home page
        if (Auth.isUser) {
            window.location.href = '/friends';
        }
    }, [Auth.isUser]);

    // handle input on change
    const handleChange = e => {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        });
    };

    // handle submit
    const handleSubmit = async e => {
        e.preventDefault();
        await API.post('/api/auth/register', user)
            .then(({ data }) => {
                toast.success('🦄 ' + data.message, {
                    position: 'top-center',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setUser({
                    username: '',
                    email: '',
                    password: '',
                });
                setTimeout(() => {
                    history.push('/login');
                }, 1500);
            })
            .catch(({ response }) => {
                if (response && response.data.message) {
                    toast.error('⚠ ' + response.data.message, {
                        position: 'top-center',
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    setUser({
                        ...user,
                    });
                }
            });
    };
    const InputFields = [
        {
            type: 'text',
            label: 'Username',
            id: 'usernameInput',
            name: 'username',
            value: user.username,
            handleInput: handleChange,
        },
        {
            type: 'email',
            label: 'Email Address',
            id: 'emailInput',
            name: 'email',
            value: user.email,
            handleInput: handleChange,
        },
        {
            type: 'password',
            label: 'Password',
            id: 'passwordInput',
            name: 'password',
            value: user.password,
            handleInput: handleChange,
        },
    ];

    return (
        <div
            className="column my-4 d-flex justify-content-center align-items-center"
            style={{ height: '80vh' }}>
            <div className="col-6 mx-auto">
                {InputFields.map((props, i) => {
                    return (
                        <React.Fragment key={i}>
                            <InputForm {...props} />
                        </React.Fragment>
                    );
                })}
                <button
                    className="btn mr-2"
                    style={{ backgroundColor: '#f1f1f1' }}
                    onClick={handleSubmit}>
                    Register
                </button>
                Already have account {'  '}
                <Link
                    to="/login"
                    style={{
                        color: '#fff',
                        fontSize: '1rem',
                        textDecoration: 'underline',
                    }}>
                    Login
                </Link>
            </div>
        </div>
    );
}
