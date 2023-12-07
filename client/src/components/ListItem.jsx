import React, { useState } from "react";
import useClickOutside from "../hooks/useClickOutside";
import { MdEdit } from "react-icons/md";
import { IoMdTrash } from "react-icons/io";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { BsSun } from "react-icons/bs";
import { GoStar, GoStarFill } from "react-icons/go";
import DeleteModal from "./DeleteModal";
import EditTask from "./EditTask";

const ListItem = (props) => {
  const [taskTitle, setTaskTitle] = useState(props.task.title);
  const [taskItemCompleted, setTaskItemCompleted] = useState(props.task.completed);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const closeDropdown = () => {
    setShowDropdown(false);
  };

  const dropdownRef = useClickOutside(closeDropdown);

  const closeEditMode = () =>{
    setEditMode(false);
    setTaskTitle(props.task.title);
  }


  const editTask = async(e) =>{
    e.preventDefault();
    if (taskTitle === props.taskTitle || !taskTitle || /^\s*$/.test(taskTitle)) {
      closeEditMode();
      return
    }
    try{
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos/${props.task.todo_id}`, {
        method: "PUT",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({title : taskTitle})
      })
      if (response.status === 200) {
        //console.log("Edited Task!")
        setEditMode(false);
        props.getData();
        props.getAllData();
      }
      else{
        console.log("fail")
      }
    } catch(err){
      console.error(err);
    }
  }

  const editImportant = async() => {
    const importantChange = !props.task.important;
    try{
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos/${props.task.todo_id}/important`, {
        method: "PUT",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({important: importantChange})
      })
      if (response.status === 200) {
        //console.log("Edited Important!")
        props.getData();
        props.getAllData();
      }
    }catch(err){
      console.error(err)
    }
  }
  const editMyDay = async() => {
    const myDayChange = !props.task.myday;
    try{
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos/${props.task.todo_id}/myDay`, {
        method: 'PUT',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({myDay: myDayChange})
      })
      if (response.status === 200){
        //console.log("Changed myDay")
        props.getAllData();
        props.getData();
      }
    } catch(err){
      console.error(err)
    }
  }
  const editComplete = async() => {
    setTaskItemCompleted(!props.task.completed);
    const completeChange = !props.task.completed;
    try{
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos/${props.task.todo_id}/complete`, {
        method: "PUT",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({complete: completeChange})
      })
      if (response.status === 200) {
        //console.log("Edited Completed!")
        props.getAllData();        
        const timer = setTimeout(() => {
          props.getData();
        }, 500);
        return () => clearTimeout(timer);
      }
    }catch(err){
      console.error(err)
    }
  }

  return (
    <div
      className={`listItem ${showDropdown ? "listItem-active" : ""}`}
      id="listItem"
    >
      {props.task.myday && (
        <div className="listItem-myDay-wrapper">
          <BsSun size={"12px"}/>
          <p className="listItem-myDay-text">My Day</p>
        </div>
      )}
      <div className="listItem-taskWrapper">
        <div className="listItem__inputs">
          <input type="checkbox" checked={taskItemCompleted} className={`ui-checkbox ${props.task.important ? "ui-checkbox-important": ""}`} onChange={editComplete}/>
            <p className="listItem-title">{props.task.title}</p>
        </div>
        <div className="listItem__buttons" ref={dropdownRef}>
          <button
            className="listItem-options-btn"
            onClick={(e) => setShowDropdown(true)}
          >
            <BiDotsVerticalRounded size={"20px"} />
          </button>
          <div
            className={`listItem-buttons-dropdown ${
              showDropdown ? "" : "dropdown-hide"
            }`}
            onClick={(e) => setShowDropdown(false)}
          >
            <button onClick={editMyDay}>
              <BsSun size={"20px"} />
              {props.task.myday ? (
                <p>Remove from My Day</p>
              ) : (
                <p>Add to My Day</p>
              )}
            </button>
            <button onClick={editImportant}>
              {props.task.important ? (
                <>
                  <GoStarFill size={"18px"}/>
                  <p>Remove Importance</p>
                </>
              ) : (
                <>
                  <GoStar size={"18px"} />
                  <p>Mark as Important</p>
                </>
              )}
            </button>
            <button onClick={(e) => setEditMode(true)}>
              <MdEdit size={"18px"} />
              <p>Edit</p>
            </button>
            <button onClick={(e) => setDeleteModal(true)}>
              <IoMdTrash size={"18px"} color={"#ed5e68"}/>
              <p className="delete-text">Delete</p>
            </button>
          </div>
        </div>
      </div>
      {editMode && <EditTask  closeEditMode={closeEditMode} editTask={editTask} task={props.task} taskTitle={taskTitle} setTaskTitle={setTaskTitle}/>}

      <DeleteModal
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        listName={props.task.title}
        deleteType={"Task"}
        task={props.task}
        getData={props.getData}
        getAllData={props.getAllData}
      />
    </div>
  );
};

export default ListItem;
