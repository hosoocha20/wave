import React, { useEffect, useState} from "react";
import { useCookies } from "react-cookie";
//import useState from 'react-usestateref'
import ListHeader from "./ListHeader";
import axios from "axios";
import ListItem from "./ListItem";
import ListSide from "./ListSide";
import {HiOutlinePlus} from "react-icons/hi";
import OrangeBg from "../assets/bg-2-r.svg";
import PurpleBg from "../assets/bg-3-r.svg";
import PurpleBlueBg from "../assets/bg-4-r.svg";
import PurpleOrangeBg from "../assets/bg-5-r.svg";
import BlueOrangeBg from "../assets/bg-6-r.svg";
import BluePurpleBg from "../assets/bg-7-r.svg";
import BlueBg from "../assets/bg-1-r.svg";



const TodoPage = (props) => {
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const userEmail = cookies.Email;
  const [filteredTask, setFilteredTask] = useState("inProgress");
  const [allTasks, setAllTasks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [taskAnalytics, setTaskAnalytics] = useState({all: 0, inProgress: 0, important : 0, completed: 0});
  const [task, setTask] = useState({list_id : props.openingTaskList.list_id, user_email: userEmail, title: '', date: new Date(), completed: false, important: filteredTask === 'important' ? true: false, myDay: false});
  const [sortOption, setSortOption] = useState("Recently Added");
  const [changeTitle, setChangeTitle] =  useState(props.openingTaskList.list_title || '');
  const [timer, setTimer] = useState(null);

  const [bgSelect, setBgSelect] = useState(props.openingTaskList.bg);
  const bgs = [
    { bg: BlueBg, name: "bl" },
    { bg: OrangeBg, name: "or" },
    { bg: PurpleBg, name: "pu" },
    { bg: BluePurpleBg, name: "blpu" },
    { bg: BlueOrangeBg, name: "blor" },
    { bg: PurpleBlueBg, name: "publ" },
    { bg: PurpleOrangeBg, name: "puor" },
  ];

  const getCount = () => {
    const inProg = allTasks.filter(function arr (e){
      return e.completed === false;
    })
    const imp = allTasks.filter(function arr (e){
      return (e.important === true);
    })
    const com = allTasks.filter(function arr (e){
      return e.completed === true;
    })
    setTaskAnalytics({ ...taskAnalytics, all: allTasks.length, inProgress: inProg.length, important: imp.length, completed: com.length });
  }

  const postData = async (e) =>{
    //console.log(task)
    e.preventDefault();
    if (!task.title || /^\s*$/.test(task.title)) {
      return;
    }
    try{
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos` , {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(task)
      })
      //console.log(response);
      if (response.status === 200) {
        
        //console.log("Added new Task!")
        setTask({ list_id : props.openingTaskList.list_id, user_email: userEmail, title: '', date: new Date(), completed: false, important: filteredTask === 'important' ? true: false , myDay: false})
        getData();
        getAllData();
      }
    } catch(err){
      console.error(err)
    }
  }


  const getData = async () =>{
    let response;
      try{
        if (filteredTask === "inProgress"){
          response = await axios.get(`${process.env.REACT_APP_SERVERURL}/todos/${props.openingTaskList.list_id}/${'f'}/${sortOption}`)
        }
        else if (filteredTask === "important"){
          response = await axios.get(`${process.env.REACT_APP_SERVERURL}/todos/${props.openingTaskList.list_id}/${sortOption}/tasks/starred`)
        }
        else{
          response = await axios.get(`${process.env.REACT_APP_SERVERURL}/todos/${props.openingTaskList.list_id}/${'t'}/${sortOption}`)
        }
          const json = await response.data;
          setTasks(json);
          //console.log(json);
      } catch (err){
          console.error(err)
      }
  }


  const getAllData = async () =>{
    try{
        const response = await axios.get(`${process.env.REACT_APP_SERVERURL}/todos/${props.openingTaskList.list_id}/all`)
        const json = await response.data;
        setAllTasks(json);
        //console.log(json);
    } catch (err){
        console.error(err)
    }
  }



  const updateListTitle = async() =>{
    try{
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todoLists/${props.openingTaskList.list_id}`, {
        method : 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({list_title: changeTitle})

      })
      if (response.status === 200){
        props.getTaskLists();
        //console.log("updated list title!")
      }
    }catch(err){
      console.error(err)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask(newTask => ({
      ...task,
      [name] : value
    }))
  }



  useEffect(()=>{
    getAllData();
    getData();
    getCount(); 
  },[])
  useEffect(()=>{
    getAllData();
    getData();
    getCount(); 
    setTask({ ...task,  list_id: props.openingTaskList.list_id});
    setChangeTitle(props.openingTaskList.list_title)
  },[props.openingTaskList])
  useEffect(()=>{
    getData();
    setTask({ ...task,  important: filteredTask === 'important' ? true: false});
},[filteredTask])

  useEffect(()=>{
    getData();
  },[sortOption])

useEffect(() =>{
  getCount();
}, [allTasks])
useEffect(()=>{
  setBgSelect(props.openingTaskList.bg)
},[props.openingTaskList.bg])
useEffect(()=>{

    clearTimeout(timer)

    const newTimer = setTimeout(() => {
      updateListTitle()
    }, 500)

    setTimer(newTimer)
},[changeTitle])




  return (
    <div className={`todoPage-container ${props.openingTaskList.bg === "bl" ? "bl" : ""} ${props.openingTaskList.bg === "or" ? "or" : ""} ${props.openingTaskList.bg === "pu" ? "pu" : ""} ${props.openingTaskList.bg === "blor" ? "blor" : ""} ${props.openingTaskList.bg === "blpu" ? "blpu" : ""} ${props.openingTaskList.bg === "publ" ? "publ" : ""} ${props.openingTaskList.bg === "puor" ? "puor" : ""}`}>
      <div className="todoPage-left">
        <ListHeader
          listName={changeTitle}
          filteredTask={filteredTask}
          setFilteredTask={setFilteredTask}
          sortOption={sortOption}
          setSortOption={setSortOption}
        />

        <div className="taskList-container">
          {tasks?.map((t) => (
            <ListItem key={t.todo_id} task={t} getData={getData} getAllData={getAllData}/>
          ))}
        </div>
        <form className="taskList-newForm" onSubmit={postData}>
          <HiOutlinePlus size={"18px"} color={"#31415f"}/>
          <input type="text" maxLength={200} placeholder="Add a Task" name="title" value={task.title} onChange={handleChange} autoComplete="new-password"></input>
        </form>
      </div>

      <ListSide openingTaskList={props.openingTaskList} setOpeningTaskList={props.setOpeningTaskList} taskAnalytics={taskAnalytics} listName={props.openingTaskList.list_title} setTaskListName={props.setTaskListName} getTaskLists={props.getTaskLists} weekdayS={props.weekdayS} monthS={props.monthS} bgs={bgs} bgSelect={bgSelect} setBgSelect={setBgSelect}  changeTitle={changeTitle} setChangeTitle={setChangeTitle}  setOpenLink={props.setOpenLink}/>
    </div>
  );
};

export default TodoPage;
