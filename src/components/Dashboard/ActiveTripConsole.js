import React, { useState } from "react";
import { SettledTripName } from "./SettledTripName";
import { EditTripNameForm } from "./EditTripNameForm";
import { ConfirmDeleteTripModal } from "./ConfirmDeleteTripModal";

export const ActiveTripConsole = ({ activeTrip, setActiveTrip, fetchTrips, editTripDetails, resetTripAndListStates, createNewList, setProgressMessage, setIsLoading }) => {

    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    }

    /* const handleClickSync = event => {
        event.preventDefault();
        fetchLists(activeTrip.tripId);
    } */

    const handleClickNewList = () => {
        createNewList();
    }

    return (
        <div className="active-trip-console">

            <hr></hr>

            <div>
                <div>
                    <p className="bolder">Active trip console</p>
                    {
                        !isEditing ?
                            <SettledTripName
                                activeTrip={activeTrip}
                                toggleEdit={toggleEdit} />
                            : <EditTripNameForm
                                activeTrip={activeTrip}
                                setActiveTrip={setActiveTrip}
                                toggleEdit={toggleEdit}
                                editTripDetails={editTripDetails}
                            />
                    }
                </div>

                <h5 className="lighter-weight">Trip category: {activeTrip.tripCategory}</h5>

                <h5 className="lighter-weight">Trip duration: {activeTrip.tripDuration}</h5>
            </div>

            <div className="save-button-container">
                <ConfirmDeleteTripModal
                    activeTrip={activeTrip}
                    fetchTrips={fetchTrips}
                    resetTripAndListStates={resetTripAndListStates}
                    setProgressMessage={setProgressMessage}
                    setIsLoading={setIsLoading} />
                <input type="button"
                    className="pillbox-button"
                    value="New list" onClick={handleClickNewList} />

                {/* {lists.length && allListItems.length ?
                    <div>
                        <input type="button"
                            className="pillbox-button"
                            value="Sync"
                            onClick={handleClickSync} />
                    </div>
                    :
                    null} */}

            </div>
        </div>
    );
}

