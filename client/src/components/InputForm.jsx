import React from 'react';
import '../css/getNewFriends.css';
export function InputForm({ name, label, id, type, value, handleInput }) {
    return (
        <>
            <div className="mb-3">
                <label htmlFor={id} className="form-label">
                    {label}
                </label>
                <input
                    name={name}
                    type={type}
                    className="form-control p-3"
                    id={id}
                    value={value}
                    onChange={handleInput}
                />
            </div>
        </>
    );
}
