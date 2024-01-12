import React, { useState } from "react";
import NoteContext from "./NoteContext";

const NoteState = (props) => {
  const host = "http://localhost:8000";
  const notesinitial = [];
  const [notes, setNotes] = useState(notesinitial);

  //   Get all note
  const getNote = async () => {
    //  Api call
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjU1YzhmODM0NmQzZGE5MGM2ZmY4NDBmIn0sImlhdCI6MTcwMDU2NDg2N30.iNu_QrIsKuTiWBLD6pZCfiok49l9-Sy-MFt9jo9wAJA"
        "auth-token": localStorage.getItem("token"),
      },
    });
    const json = await response.json();
    setNotes(json);
  };

  //   Add a note
  const addNote = async (title, description, tag) => {
    // Todo Api call
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjU1YzhmODM0NmQzZGE5MGM2ZmY4NDBmIn0sImlhdCI6MTcwMDU2NDg2N30.iNu_QrIsKuTiWBLD6pZCfiok49l9-Sy-MFt9jo9wAJA"
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const note = await response.json();
    setNotes(notes.concat(note));
  };

  // Delete a note
  const deleteNote = async (id) => {
    //  Api call
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjU1YzhmODM0NmQzZGE5MGM2ZmY4NDBmIn0sImlhdCI6MTcwMDU2NDg2N30.iNu_QrIsKuTiWBLD6pZCfiok49l9-Sy-MFt9jo9wAJA"
        "auth-token": localStorage.getItem("token"),
      },
    });
    const json = await response.json();
    const newNotes = notes.filter((note) => {
      return note._id !== id;
    });
    setNotes(newNotes);
    console.log(json);
  };

  // Edit a note
  const editNote = async (id, title, description, tag) => {
    //Api Call
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjU1YzhmODM0NmQzZGE5MGM2ZmY4NDBmIn0sImlhdCI6MTcwMDU2NDg2N30.iNu_QrIsKuTiWBLD6pZCfiok49l9-Sy-MFt9jo9wAJA"
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const json = await response.json();
    console.log(json);

    let newNotes = JSON.parse(JSON.stringify(notes));
    //Logic to edit in client
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
    }
    setNotes(newNotes);
  };

  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote }}>
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
