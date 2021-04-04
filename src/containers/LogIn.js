import React, { useState, useContext } from "react";
import { UserContext } from "../UserContext";
import { LoginForm } from "../components/Login/LoginForm";
import { LoginSuccessful } from "../components/Login/LoginSuccessful";

export const LogIn = () => {

    const usernameRegex = /^[a-zA-Z0-9_]*$/;
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    const { setUser } = useContext(UserContext);

    const [attemptedAppUser, setAttemptedAppUser] = useState(null);
    const [isSuccessfulLogin, setIsSuccessfulLogin] = useState(false);
    const [isFailedLogin, setIsFailedLogin] = useState(false);


    const checkUserCredentials = async (userIdentity, password) => {

        // Detect whether the user identity inputted is a username or an email
        const requestBodyContent = {};
        if (usernameRegex.test(userIdentity)) {
            requestBodyContent.username = userIdentity;
            requestBodyContent.email = '';
        } else if (emailRegex.test(userIdentity)) {
            requestBodyContent.username = '';
            requestBodyContent.email = userIdentity;
        }

        // Add the password to the body content
        requestBodyContent.password = password;

        const response = await fetch(`http://localhost:4000/appusers/login`, {
            method: 'POST',
            mode: 'cors',
            cache: 'default',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(requestBodyContent)
        });
        const responseBodyText = await response.json();
        if (response.status === 200) {
            setUser(responseBodyText.appUser[0]);
            console.log(responseBodyText.appUser[0]);
            setIsSuccessfulLogin(true);
            setIsFailedLogin(false);
            setAttemptedAppUser(null);
        } else if (response.status === 400) {
            setAttemptedAppUser({
                errorMessage: responseBodyText.message,
                userIdentity: userIdentity
            });
            setIsSuccessfulLogin(false);
            setIsFailedLogin(true);
        }

    }

    return (
        <div>
            {isSuccessfulLogin ? <LoginSuccessful /> : <LoginForm usernameRegex={usernameRegex} emailRegex={emailRegex} checkUserCredentials={checkUserCredentials} attemptedAppUser={attemptedAppUser} isFailedLogin={isFailedLogin} />}
        </div>

    );
}
