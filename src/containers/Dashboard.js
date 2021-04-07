import React, { useState, useContext } from "react";
import { UserContext } from "../UserContext";
import { GreetNewUser } from "../components/GreetNewUser";
import { Questions } from "../components/Questions";
import { Lists } from "../components/Lists";
import { Footer } from "../components/Footer";

export const Dashboard = () => {
    const { user, setUser } = useContext(UserContext);
    const [newTrip, setNewTrip] = useState(false);
    const [selected, setSelected] = useState('');
    const [loadLists, setLoadLists] = useState(false);

    return (
        <div>
            <main>
                <div className="dashboard-start-container">
                    <GreetNewUser />
                    {
                        !newTrip ?
                            <input type="button" value='Create new trip' onClick={() => setNewTrip(true)} /> :
                            <Questions selected={selected} setSelected={setSelected} setNewTrip={setNewTrip} setLoadLists={setLoadLists} />
                    }
                </div>

                {loadLists && <Lists selected={selected} />}

            </main>

            <Footer />
        </div>
    );
}