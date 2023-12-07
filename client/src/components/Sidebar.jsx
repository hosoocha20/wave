import React, { useState, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import useClickOutside from "../hooks/useClickOutside";
import waveLogo from "../assets/waveLogo.png";
import userIcon from "../assets/userIcon-test40.png";
import { sideLinks } from "../data/lib";
import {
  MdOutlineSpaceDashboard,
  MdOutlineListAlt,
  MdArrowForwardIos,
} from "react-icons/md";
import { BsSun } from "react-icons/bs";
import { AiOutlineTeam } from "react-icons/ai";
import { HiOutlinePlus, HiPlusSm } from "react-icons/hi";
import { RiTaskLine } from "react-icons/ri";
import AddListModal from "./AddListModal";

const Sidebar = (props) => {
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const userEmail = cookies.Email;
  const [showTaskList, setShowTaskList] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const taskListRef = useRef(null);
  //const [showBoardList, setBoardList] = useState(true);
  const [newListModal, setNewListModal] = useState(false);
  const [newList, setNewList] = useState({
    list_id: "",
    list_title: "",
    user_email: userEmail,
    date: new Date(),
    bg: "bl",
  });

  const closeDropdown = () => {
    setShowProfileModal(false);
  };
  const profileModalRef = useClickOutside(closeDropdown);

  const collapseTaskDiv = () => {
    setShowTaskList(!showTaskList);
    const content = document.getElementById("grow");
    //console.log(taskListRef.current.clientHeight);
    content && !showTaskList
      ? (content.style.height = taskListRef.current.clientHeight + "px")
      : (content.style.height = "0px");
  };
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setNewListModal(true);
  };

  const postNewList = async (e) => {
    e.preventDefault();
    if (!newList.list_title || /^\s*$/.test(newList.list_title)) {
      return;
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/todoLists`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newList),
        }
      );
      //console.log(response)
      if (response.status === 200) {
        props.getTaskLists();
        props.setOpenLink("task");
        //openTaskList(newList);
        //console.log(props.taskListTitles[props.taskListTitles.length -1])
        setNewList({
          list_id: "",
          list_title: "",
          user_email: userEmail,
          date: new Date(),
          bg: "bl",
        });
        setNewListModal(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const logOut = () =>{
    removeCookie('Email')
    removeCookie('AuthToken')
    window.location.reload()
  }

  const openTaskList = (list) => {
    props.setOpeningTaskList(list);
    props.setOpenLink("task");
  };
  return (
    <div  className="sidebar-container">
      <div className="sidebar-logo">
        <img src={waveLogo} alt="Wave Logo" id="waveLogo" />
        <h1>Wave</h1>
      </div>

      <div  className="sidebar-userProfile" >
        <div className="sidebar-userProfile-wrapper" onClick={()=>setShowProfileModal(true)}>
          <img src={userIcon} alt="User Profile Icon" id="userProfleIcon" />
          <div className="sidebar-userProfile__name">
            <p>{props.userName.firstName} {props.userName.lastName}</p>
            <p>Morning, {props.userName.firstName}</p>
          </div>
        </div>

          <div className={`sidebar-userProfile-modal-container ${showProfileModal ? "" : "hideVisibility opacity-none"}`}>
            <div className="sidebar_userProfile-modal-bg" onClick={()=>setShowProfileModal(false)}></div>
            <div className="sidebar-userProfile-modal">
              <div className="sidebar-userProfile-modal-wrapper">
                <img
                  src={userIcon}
                  alt="User Profile Icon"
                  id="userProfleIcon"
                />
                <div className="sidebar-userProfile__name">
                  <p>{props.userName.firstName} {props.userName.lastName}</p>
                  <p>{userEmail}</p>
                </div>
              </div>
              <hr></hr>
              <div className="sidebar-userProfile-modal-logout" onClick={logOut}>
                <p>Log out</p>
              </div>
            </div>
          </div>
      </div>
      <div className="sidebar-links">
        <div className="sidelink-view">
          <div
            className={`sidelink-wrappper-1 ${
              props.openLink === "myDay" ? "sidebar-link-active" : ""
            }`}
            onClick={(e) => props.setOpenLink("myDay")}
          >
            <BsSun
              className={`${
                props.openLink === "myDay" ? "sidebar-icon-active" : ""
              }`}
              size={"20px"}
            />
            <p>My Day</p>
          </div>
        </div>
        <div className="sidelink-view">
          <div className="sidelink-wrappper-1">
            <RiTaskLine
              className={`${
                props.openLink === "tasks" ? "sidebar-icon-active" : ""
              }`}
              size={"20px"}
            />
            <p>Tasks</p>
          </div>
        </div>
        <div className="sidelink-view">
          <div
            className="sidelink-wrappper sidelink-add"
            name="collapseTaskDiv"
            onClick={(e) => collapseTaskDiv()}
          >
            <div>
              <MdOutlineListAlt
                className={`${
                  props.openLink === "task" ? "sidebar-icon-active" : ""
                }`}
                size={"20px"}
              />
              <p>My Lists</p>
            </div>

            <HiPlusSm
              className="sidebar-icon-container"
              name="taskListButton"
              onClick={(e) => handleClick(e)}
            />
          </div>
          <div
            className={`sidebar-taskList-container ${
              showTaskList ? "" : "sidebar-taskList-hide"
            }`}
            id="grow"
          >
            <div className="sidebar-taskList-wrapper" ref={taskListRef}>
              {props.taskListTitles &&
                props.taskListTitles.map((e) => {
                  return (
                    <div
                      key={e.list_id}
                      className={`sidebar-task ${
                        props.openLink === "task" &&
                        props.openingTaskList?.list_title === e.list_title
                          ? "sidebar-link-active"
                          : ""
                      }`}
                      onClick={() => openTaskList(e)}
                    >
                      {e.list_title}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        <div className="sidelink-view">
          <div className="sidelink-wrappper sidelink-add">
            <div>
              <MdOutlineSpaceDashboard
                className={`${
                  props.openLink === "boards" ? "sidebar-icon-active" : ""
                }`}
                size={"20px"}
              />
              <p>Boards</p>
            </div>

            <HiPlusSm className="sidebar-icon-container" />
          </div>
        </div>
        <div className="sidelink-view">
          <div className="sidelink-wrappper">
            <AiOutlineTeam
              className={`${
                props.openLink === "team" ? "sidebar-icon-active" : ""
              }`}
              size={"20px"}
            />
            <p>Team</p>
          </div>
        </div>
      </div>

      {newListModal && (
        <AddListModal
          setNewListModal={setNewListModal}
          newListModal={newListModal}
          newList={newList}
          setNewList={setNewList}
          postNewList={postNewList}
        />
      )}
    </div>
  );
};

export default Sidebar;
