import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { LoadSpinner } from "../LoadSpinner/LoadSpinner";

import { UserContext, CookieExpiryContext, GuestUserContext } from "../../UserContext";
import { delay, checkUserCredentialsApi } from "../../api";
import configData from "../../config.json";

export const ValidateCredentials = ({ context, setOpenConfirmCredentialsModal }) => {

    // Contexts for user and cookie expiry
    const { user, setUser } = useContext(UserContext);
    const { setCookieExpiry } = useContext(CookieExpiryContext);
    const { setIsGuestUser } = useContext(GuestUserContext);

    // State to render the spinner
    const [isLoading, setIsLoading] = useState(false);

    // State for the message above the form
    const [progressMessage, setProgressMessage] = useState("");

    // States for the inputs in the form
    const [userIdentity, setUserIdentity] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Regex expressions for username and email
    const usernameRegex = new RegExp(configData.USERNAME_REGEX);
    const emailRegex = new RegExp(configData.EMAIL_REGEX);

    // If this we are rendering the confirm credentials modal, we only want the current user to be able to confirm their credentials, so we lock the userIdentity field to be the user in the pre-existing cookie
    useEffect(() => {
        if (context === "confirmCredentials") {
            setUserIdentity(user);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const checkUserCredentials = async (userIdentity, password, retryCount = 0) => {
        setIsLoading(true);
        setProgressMessage("Logging you in...");

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

        try {
            // Api call to check the user's credentials
            const { response, responseBodyText } = await checkUserCredentialsApi(requestBodyContent);

            if (response.ok === true) {
                const username = responseBodyText.username;

                if (context === "login") { // Login page
                    const lastUser = localStorage.getItem("lastUser");

                    // If the user that just logged in was not the last user, clear the local storage (if there is anything there)
                    if (username !== lastUser) {
                        localStorage.clear();
                    }

                } else if (context === "confirmCredentials") { // Confirm credentials modal

                    // Once the user successfully confirms their credentials, close the modal and let the user continue using the dashboard
                    setOpenConfirmCredentialsModal(false);
                }

                setIsLoading(false);
                setIsGuestUser(false);
                setCookieExpiry(responseBodyText.cookieExpiry);
                setUser(username);
                console.log("login sucessful");
                console.log("Oh hello there! Thanks for looking.");

            } else { // i.e. response.ok === false
                setProgressMessage("** " + responseBodyText.message + " **");
                setUserIdentity(userIdentity);
                setIsLoading(false);
            }
        }

        catch (error) {
            console.error("Cannot connect to server");
            setUserIdentity(userIdentity);

            if (retryCount < 5) {
                setProgressMessage(`The server not responding. Trying again... ${retryCount}/4`);
                await delay(retryCount); // Exponential backoff - see api.js
                return checkUserCredentials(userIdentity, password, retryCount + 1); // After the delay, try connecting again
            }

            else {
                setProgressMessage('Sorry, our server is not responding. Please check your internet connection or come back later.');
                setIsLoading(false);
            };
        }
    }

    const handleSubmit = event => {
        event.preventDefault();

        // Prevent submission if either the userIdentity or password field is empty
        if (context === "login" && userIdentity.length === 0) {
            return;
        }

        // Validate user identity as either valid username or valid email
        if (!usernameRegex.test(userIdentity) && !emailRegex.test(userIdentity)) {
            setProgressMessage('** Invalid username or email **');
            return;
        } else if (password.length < 8) {
            setProgressMessage('** Password needs to be greater than 8 characters **');
            return;
        }

        checkUserCredentials(userIdentity, password);
    }

    const toggleShowPassword = event => {
        event.preventDefault();
        setShowPassword(!showPassword);
    }

    return (
        <div className="user-credentials login">

            <h3>{context === "login" ? "Log in" : "Refresh my token"}</h3>

            <p className="progress-message">{progressMessage}</p>

            {
                isLoading ?
                    <LoadSpinner />
                    : null
            }

            <form className="user-credentials-form" onSubmit={handleSubmit}>

                <div className="input-label-container">
                    <label htmlFor="user-identity-input" >Username or email</label>
                    {context === "login" ?
                        <input type="text"
                            id="user-identity-input"
                            name="userIdentity"
                            onChange={event => setUserIdentity(event.target.value)}
                            value={userIdentity}
                            autoComplete="username" /> :
                        <input type="text"
                            id="user-identity-input"
                            name="userIdentity"
                            value={userIdentity}
                            readOnly />
                    }
                </div>

                <div className="input-label-container" id="password-input-label-container">

                    <label htmlFor="password-input">Password</label>

                    <input type={showPassword ? "text" : "password"}
                        id="password-input"
                        name="password"
                        minLength="8"
                        autoComplete="current-password"
                        onChange={event => setPassword(event.target.value)}
                        value={password}
                        required />
                    <button type="button"
                        className={showPassword ? "visible password-button" : "not-visible password-button"}
                        onClick={toggleShowPassword}></button>

                </div>

                <div>
                    <input type="submit"
                        className="pillbox-button"
                        value={context === "login" ? 'Log in' : 'Confirm'} />
                    {
                        context === "confirmCredentials" ?
                            <Link to="/logout">
                                <input type="button"
                                    className="pillbox-button"
                                    value='Logout now' />
                            </Link>
                            : null
                    }
                </div>

            </form>
            {
                context === "login" ?
                    <div>
                        <hr></hr><p className="button-separator">or</p><hr></hr>

                        <Link to="/signup">
                            <div>
                                <input type="button"
                                    className="pillbox-button"
                                    value='Sign up' />
                            </div>
                        </Link>
                    </div>
                    : null
            }

        </div>
    );
}
