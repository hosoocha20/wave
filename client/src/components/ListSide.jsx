import React, { useEffect, useState } from "react";
import { IoMdTrash } from "react-icons/io";
import { HiOutlineCheck } from "react-icons/hi";
import DeleteModal from "./DeleteModal";


const ListSide = (props) => {
  const [deleteModal, setDeleteModal] = useState(false);


  const handleListNameChange = (value) => {
    props.setTaskListName(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const editBg = async(bgChange) =>{
    props.setBgSelect(bgChange)
    try{
        const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todoLists/bg/${props.openingTaskList.list_id}` , {
          method: "PUT",
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({bg: bgChange})
        })
        //console.log(response);
        if (response.status === 200) {
        props.setOpeningTaskList({ ...props.openingTaskList,  bg: bgChange});
          props.getTaskLists();
          console.log("Changged backgground!")
        }
      } catch(err){
        console.error(err)
      }
  }

//   useEffect(()=>{
//     props.setBgSelect(props.openingTaskList.bg)
//   },[props.openingTaskList.bg])

  return (
    <div className="listSide-container">
      <form className="listSide-title-form" onSubmit={handleSubmit}>
        <input
          type="text"
          maxLength={30}
          value={props.changeTitle}
          onChange={(e)=>props.setChangeTitle(e.target.value)}
        />
      </form>
      <hr></hr>
      <div className="listSide-bg-change">
        <p>BACKGROUND</p>
        <div className="listSide-bg-change__options">
          {props.bgs.map((i) => {
            return (
              <div
                className="listSide-bg-item"
                onClick={() => editBg(i.name)}
              >
                <svg width="50" height="50">
                  <defs>
                    <clipPath id="circleView">
                      <circle cx="25" cy="25" r="20" fill="#FFFFFF" />
                    </clipPath>
                  </defs>
                  <image
                    width="100"
                    height="50"
                    href={i.bg}
                    clip-path="url(#circleView)"
                  />
                </svg>
                <HiOutlineCheck  className={`bg-checkIcon ${props.bgSelect === i.name ? "" : "hideVisibility"}`}/>
              </div>
            );
          })}
        </div>
      </div>
      <hr></hr>
      <p className="listSide-filter-overview">OVERVIEW</p>
      <div className="listSide-filter-display">
        <div className="listSide-filter-block">
          <p>In Progress</p>
          <div className="listSide-filter-block__num1">
            {props.taskAnalytics.inProgress}
          </div>
        </div>
        <div className="listSide-filter-block">
          <p>Important</p>
          <div className="listSide-filter-block__num2">
            {props.taskAnalytics.important}
          </div>
        </div>
        <div className="listSide-filter-block">
          <p>Completed</p>
          <div className="listSide-filter-block__num3">
            {props.taskAnalytics.completed}
          </div>
        </div>
        <div className="listSide-filter-block">
          <p>All</p>
          <div className="listSide-filter-block__num4">
            {props.taskAnalytics.all}
          </div>
        </div>
      </div>
      <div className="listSide-end-container">
        <p>
          Created on{" "}
          {props.weekdayS[new Date(props.openingTaskList.date).getDay()]},{" "}
          {new Date(props.openingTaskList.date).getDate()}{" "}
          {props.monthS[new Date(props.openingTaskList.date).getMonth()]}{" "}
          {new Date(props.openingTaskList.date).getFullYear()}
        </p>
        <div
          className="listSide-trash-icon-container"
          onClick={(e) => setDeleteModal(true)}
        >
          <IoMdTrash />
        </div>
      </div>

      <DeleteModal
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        listName={props.openingTaskList.list_title}
        deleteType={"List"}
        listId={props.openingTaskList.list_id}
        getTaskLists={props.getTaskLists}
        setOpenLink={props.setOpenLink}
      />
    </div>
  );
};

export default ListSide;
