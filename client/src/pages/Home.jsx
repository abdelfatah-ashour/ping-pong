import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../Context-Api/Auth';
import '../css/Home.css';

function Home() {
    const { Auth } = useContext(AuthContext);

    return (
        <main className="wrapper-main">
            <h1>PING - PONG</h1>
            <div>
                {Auth.isUser && (
                    <p className="lead">
                        Welcome {Auth.username} , start chat with {'  '}
                        <Link
                            to="/friends"
                            aria-label="link to friend page"
                            className="link-router">
                            Friends
                        </Link>
                    </p>
                )}
                {!Auth.isUser && (
                    <p className="lead">
                        You are not sign in ,Please{' '}
                        <Link
                            to="/login"
                            aria-label="link to friend page"
                            className="link-router">
                            Login
                        </Link>
                    </p>
                )}
            </div>
        </main>
    );
}

export default Home;
