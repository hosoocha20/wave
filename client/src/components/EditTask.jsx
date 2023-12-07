import React, { useState } from "react";
import { BsArrowReturnLeft } from "react-icons/bs";

const EditTask = (props) => {
    
  return (
    <div  className={`editTask-container`}>
      <div className="editTask-background" onClick={props.closeEditMode}></div>
      <div className="editTask-modal">
        <form onSubmit={(e)=>props.editTask(e)}>
          <input type="text" autoFocus value={props.taskTitle} onChange={(e) => props.setTaskTitle(e.target.value)}/>
          <button className="editTask-save-btn">Save</button>
        </form>
        <button className="editTaskEnterButton">
          <BsArrowReturnLeft size={"15px"} />
        </button>
      </div>
    </div>
  );
};

export default EditTask;
