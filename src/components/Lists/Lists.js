import React from "react";
import { List } from "./List/List";

export const Lists = ({ tripId, lists, setLists, allListItems, setAllListItems, allDeletedItems, setAllDeletedItems, setProgressMessage, setIsLoading }) => {

    return (
        <article id="lists-container">
            {
                lists.map(
                    (list, index) =>
                        <List key={`list-${list.id}`}
                            tripId={tripId}
                            list={list}
                            lists={lists}
                            setLists={setLists}
                            index={index}
                            allListItems={allListItems}
                            setAllListItems={setAllListItems}
                            allDeletedItems={allDeletedItems}
                            setAllDeletedItems={setAllDeletedItems}
                            setProgressMessage={setProgressMessage}
                            setIsLoading={setIsLoading} />
                )
            }
        </article>
    );
}