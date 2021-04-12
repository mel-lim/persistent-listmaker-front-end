import React, { useState, useEffect } from "react";
import { GreetUser } from "../components/Dashboard/GreetUser";
import { LoadListsDropdown } from "../components/Dashboard/LoadListsDropdown";
import { NewTripForm } from "../components/Dashboard/NewTripForm";
import { ActiveTripConsole } from "../components/Dashboard/ActiveTripConsole";
import { Lists } from "../components/Lists/Lists";
import { Footer } from "../components/Footer";

export const Dashboard = () => {

    const [newTripClicked, setNewTripClicked] = useState(false); // When user clicks 'new trip', this will be set to 'true' engage the form for the user to input the settings to create a new trip
    const [newTripCreated, setNewTripCreated] = useState(false);
    const [activeTrip, setActiveTrip] = useState({ tripId: '', tripName: '', tripCategory: '', tripDuration: '' }); // If the post request to create a new trip is successful, the activeTrip variable will contain the details of the new trip provided in the response

    const [lists, setLists] = useState([]); // This will sit empty until the data is fetched from the server
    const [allListItems, setAllListItems] = useState([]); // This will sit empty until the data is fetched from the server
    const [allDeletedItems, setAllDeletedItems] = useState([]); // This will sit empty until the user starts deleting items from their lists

    const [saveAttemptMessage, setSaveAttemptMessage] = useState('');
    const [isFetchProcessing, setIsFetchProcessing] = useState(false);

    // This will persist the state of the newTripClicked variable past refresh
    useEffect(() => {
        const storedNewTripClicked = localStorage.getItem("newTripClicked");
        if (storedNewTripClicked) {
            setNewTripClicked(JSON.parse(storedNewTripClicked));
        }
    }, []);

    // Once the user clicks the 'new trip' button and changes the state of the newTripClicked variable, the result is stored in localStorage
    useEffect(() => {
        localStorage.setItem("newTripClicked", JSON.stringify(newTripClicked));
    }, [newTripClicked]);

    // Upon browser refresh, this will get the activeTrip data that we stored in localstorage, so we can persist the activeTrip state
    useEffect(() => {
        const storedActiveTrip = localStorage.getItem("activeTrip");
        console.log(storedActiveTrip);
        if (storedActiveTrip) {
            setActiveTrip(JSON.parse(storedActiveTrip));
        }
    }, []);

    // Once the activeTrip variable is loaded with the details of the trip that has been created, we store in localstorage for safekeeping
    useEffect(() => {
        localStorage.setItem("activeTrip", JSON.stringify(activeTrip));
    }, [activeTrip]);

    // Upon browser refresh, this will get the lists data that we stored in localstorage, so we can persist it
    useEffect(() => {
        const storedLists = localStorage.getItem("lists");
        console.log(storedLists);
        if (storedLists) {
            setLists(JSON.parse(storedLists));
        }
    }, []);

    // Once the lists variable are loaded with the data fetched from our db, we store in localstorage for safekeeping
    useEffect(() => {
        localStorage.setItem("lists", JSON.stringify(lists));
    }, [lists]);

    // Upon browser refresh, this will get the allListItems data that we stored in localstorage, so we can persist it
    useEffect(() => {
        const storedAllListItems = localStorage.getItem("allListItems");
        if (storedAllListItems) {
            setAllListItems(JSON.parse(storedAllListItems));
        }
    }, []);

    // Once the allListItems variable are loaded with the data fetched from our db, we store in localstorage for safekeeping
    useEffect(() => {
        localStorage.setItem("allListItems", JSON.stringify(allListItems));
    }, [allListItems]);

    // Upon browser refresh, this will get the allDeletedItems data that we stored in localstorage, so we can persist it
    useEffect(() => {
        const storedAllDeletedItems = localStorage.getItem("allDeletedItems");
        if (storedAllDeletedItems) {
            setAllDeletedItems(JSON.parse(storedAllDeletedItems));
        }
    }, []);

    // Once the allDeletedItems variable initialised with its array of empty arrays, we store in localstorage for safekeeping
    useEffect(() => {
        localStorage.setItem("allDeletedItems", JSON.stringify(allDeletedItems));
    }, [allDeletedItems]);

    // 
    const configureLists = (listsConfig, allListsConfig) => {
        // Set the lists and allListItems to their initial values provided by our get request
        setLists(listsConfig);
        setAllListItems(allListsConfig);

        // Set the initial value of our allDeletedItems variable to be an array of the same length as the number of lists we have. Each element in that array is itself an empty array.
        const numOfLists = listsConfig.length;
        let initialAllDeletedItems = [];
        for (let i = 0; i < numOfLists; i++) {
            initialAllDeletedItems.push([]);
        }
        setAllDeletedItems(initialAllDeletedItems);

        setIsFetchProcessing(false);
    }

    // Post data to db to save the users changes
    const saveChanges = async () => {

        if (!lists) {
            return;
        }

        const tripId = activeTrip.tripId;
        const requestBodyContent = { lists, allListItems };

        const response = await fetch(`/trips/${tripId}/lists/savelists`, {
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
        if (response.status === 201) {
            fetchLists(tripId);
        }
        setSaveAttemptMessage(responseBodyText.message);
        console.log(responseBodyText.message);
    }

    // Fetch list data from the db and sync to page
    const fetchLists = async (tripId) => {
        console.log("fetch lists called");
        // This will ensure that the render function doesn't race past the completion of the fetch request. 
        // While this is true, the renderer will render "Loading...". We will set it back to false at the end of the request to re-render the updated lists as fetched from the db.
        setIsFetchProcessing(true);

            const response = await fetch(`/trips/${tripId}/lists/fetchlists`, {
            method: 'GET',
            mode: 'cors',
            cache: 'default',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer'
        });

        const responseBodyText = await response.json();
        console.log(responseBodyText);

        if (response.status === 200 || response.status === 304) {

            // Configure the list and allListItems states
            configureLists(responseBodyText.lists, responseBodyText.allListItems);

        } else {
            console.log(responseBodyText.message);
        }
    }

    return (
        <div>
            <main>
                <div className="dashboard-start-container">
                    <GreetUser />
                    <LoadListsDropdown
                        newTripCreated={newTripCreated}
                        fetchLists={fetchLists}
                        setActiveTrip={setActiveTrip}
                    />
                    <NewTripForm
                        newTripClicked={newTripClicked}
                        setNewTripClicked={setNewTripClicked}
                        setIsFetchProcessing={setIsFetchProcessing}
                        setActiveTrip={setActiveTrip}
                        setNewTripCreated={setNewTripCreated} 
                        configureLists={configureLists}
                        />
                    {
                        (activeTrip.tripId && !isFetchProcessing) ?

                            <ActiveTripConsole setNewTripClicked={setNewTripClicked}
                                activeTrip={activeTrip}
                                lists={lists}
                                allListItems={allListItems}
                                saveChanges={saveChanges}
                                saveAttemptMessage={saveAttemptMessage}
                                fetchLists={fetchLists} />

                            : null
                    }
                </div>

                {lists.length && allListItems.length && !isFetchProcessing ?
                    <Lists
                        lists={lists}
                        allListItems={allListItems}
                        setAllListItems={setAllListItems}
                        allDeletedItems={allDeletedItems}
                        setAllDeletedItems={setAllDeletedItems} /> :
                    null}

            </main>

            <Footer />
        </div>
    );
}