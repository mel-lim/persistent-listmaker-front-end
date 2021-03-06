import React from "react";

export const SettledListTitle = ({ listTitle, toggleEditListTitle }) => {

    return (
        <div className="list-name-container">
            <h3 className="list-title">{listTitle}</h3>
            <button className="edit-button ui-button" onClick={toggleEditListTitle}></button>
        </div>
    )
}