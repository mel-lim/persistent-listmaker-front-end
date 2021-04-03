import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export const SignUpForm = ({ postNewUser, attemptedAppUser, isFailedRegistration }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [show, setShow] = useState(false);
    const [usernameValidationMessage, setUsernameValidationMessage] = useState('');
    const [passwordMatchMessage, setPasswordMatchMessage] = useState('');
    const [submissionUnsuccessfulMessage, setSubmissionUnsuccessfulMessage] = useState('');

    // Validate username - only want alphanumeric and no spaces, just to make things simple
    useEffect(() => {
        const regex = new RegExp("^[a-zA-Z0-9_]*$");
        !regex.test(username) ? setUsernameValidationMessage('*Use only alphanumeric characters') : setUsernameValidationMessage('');
    }, [username]);

    // Validate that the password and confirm password fields match
    useEffect(() => {
        if (password.length === 0 && confirmPassword.length === 0 ) {
            return;
        }
        password === confirmPassword ? setPasswordMatchMessage('Passwords match') : setPasswordMatchMessage('Passwords do not match');
    }, [password, confirmPassword]);

    useEffect(() => {
        if (isFailedRegistration && attemptedAppUser) {
            setSubmissionUnsuccessfulMessage("** " + attemptedAppUser.errorMessage + " **");
            setUsername(attemptedAppUser.username);
            setEmail(attemptedAppUser.email);
            setPassword(attemptedAppUser.password);
        }
    }, [isFailedRegistration, attemptedAppUser]);

    const handleSubmit = event => {
        event.preventDefault();
        // Prevent submission if either username or email fields are empty
        if (username.length === 0 || email.length === 0 || password.length === 0 || confirmPassword.length === 0) {
            setSubmissionUnsuccessfulMessage('All fields must be completed');
            return;
        } else if (password !== confirmPassword) { // Prevent submission if the password and confirm password fields don't match
            setSubmissionUnsuccessfulMessage('** Passwords do not match **');
            return;
        }
        postNewUser(username, email, password);
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setPasswordMatchMessage('');
        setSubmissionUnsuccessfulMessage('');
    }

    return (
        <div className="user-credentials sign-up">
            <h3>Sign up</h3>

            <p className="submission-unsuccessful-message">{submissionUnsuccessfulMessage}</p>

            <form className="user-credentials-form" onSubmit={handleSubmit}>
                <div className="input-label-container">
                    <label htmlFor="username-input" >Username</label>
                    <input type="text" id="username-input" name="username" onChange={event => setUsername(event.target.value)} value={username} required />
                    <p className="validation-message">{usernameValidationMessage}</p>
                </div>

                <div className="input-label-container">
                    <label htmlFor="email-input">Email</label>
                    <input type="email" id="email-input" name="email" onChange={event => setEmail(event.target.value)} value={email} required />
                </div>

                <div className="input-label-container">
                    <label htmlFor="password-input">Password (minimum 8 characters)</label>
                    <input type={show ? "text" : "password"} id="password-input" name="password" minLength="8" autoComplete="new-password" onChange={event => setPassword(event.target.value)} value={password} required />
                    <button onClick={event => setShow(!show)}>{show ? "Hide" : "Show"}</button>
                </div>

                <div className="input-label-container">
                    <label htmlFor="confirm-password-input">Confirm Password</label>
                    <input type="password" id="confirm-password-input" name="password" autoComplete="current-password" onChange={event => {
        setConfirmPassword(event.target.value)}} value={confirmPassword} required />
                    <p className="validation-message">{passwordMatchMessage}</p>
                </div>

                <div>
                    <input type="submit" value='Sign up' />
                </div>

                <hr></hr><p className="button-separator">or</p><hr></hr>

                <div>
                    <Link to="/">
                        <input type="button" value='Try as guest' />
                    </Link>
                </div>

            </form>
        </div>
    );
}
