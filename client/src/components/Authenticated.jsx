import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import Sidebar from './Sidebar';
import TodoPage from './TodoPage';
import MyDay from "./MyDay";

const Authenticated = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const [taskListTitles, setTaskListTitles] = useState([]);
  const [openingTaskList, setOpeningTaskList] = useState();
  const [openLink, setOpenLink] = useState('myDay');
  //const userEmail = "test@gmail.com";
  const userEmail = cookies.Email;
  const [userName, setUserName] = useState('')

  const weekdayS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const monthS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getTaskLists = async () =>{

    try{
        const response = await axios.get(`http://localhost:8000/todolists/${userEmail}`)
        const json = await response.data;
        setTaskListTitles(json);
        //setOpeningTaskList(json[0]);

        //console.log(json);
    } catch (err){
        console.error(err)
    }
}
const getUserDetails = async () =>{
  try{
    const response = await axios.get(`http://localhost:8000/userDetails/${userEmail}`)
    const json = await response.data;
    setUserName(json)
  }catch(err){
    console.error(err)
  }
}

useEffect(()=>{
    getTaskLists();
    getUserDetails();
},[])
useEffect(()=>{
  if (openLink === "myDay"){
    return
  }
  setOpeningTaskList(taskListTitles[taskListTitles.length -1]);
},[taskListTitles.length])

  return (
    <div className='grid-section'>
      <Sidebar userName={userName} taskListTitles={taskListTitles} setOpeningTaskList={setOpeningTaskList} openingTaskList={openingTaskList} getTaskLists={getTaskLists} openLink={openLink} setOpenLink={setOpenLink}/>
      {(openLink === "myDay") && (
        <MyDay weekday={weekday} month={month}/>
      )}
      {(openLink === "task") && openingTaskList && (
        <TodoPage openingTaskList={openingTaskList} setOpeningTaskList={setOpeningTaskList}  getTaskLists={getTaskLists} weekdayS={weekdayS} monthS={monthS} setOpenLink={setOpenLink}/>
      )}
      

  </div>
  )
}

export default Authenticated