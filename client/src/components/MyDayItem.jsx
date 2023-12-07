import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";

const MyDayItem = (props) => {
    const [myDayCompleted, setmyDayCompleted] = useState(props.task.completed);

    const removeMyDay = async(type) => {
        const myDayChange = !props.task.myday;
        let response;
        if (type === 'Task'){
            try{
                response = await fetch(`${process.env.REACT_APP_SERVERURL}/myDay/tasks/${props.task.todo_id}`, {
                    method: "PUT",
                    headers: {"Content-Type" : 'application/json'},
                    body: JSON.stringify({myDay: myDayChange})
                })
                if (response.status === 200) {
                    props.getMyDay();
                    //console.log("Task Removed from MyDay!")
                  }
            }catch(err){
                console.error(err)
            }
        }
        else{
            try{
                response = await fetch(`${process.env.REACT_APP_SERVERURL}/myDay/myLists/${props.task.todo_id}`, {
                    method: "PUT",
                    headers: {"Content-Type" : 'application/json'},
                    body: JSON.stringify({myDay: myDayChange})
                })
                if (response.status === 200) {
                    props.getMyDay();
                    //console.log("List Task Removed from MyDay!")
                  }
            }catch(err){
                console.error(err)
            }

        }
    }
    const completeMyDay = async(type) =>{
        setmyDayCompleted(!myDayCompleted);
        const completedChange = !props.task.completed;
        let response;
        if (type === 'Task'){
            try{
                response = await fetch(`${process.env.REACT_APP_SERVERURL}/myDay/completed/tasks/${props.task.todo_id}`, {
                    method: "PUT",
                    headers: {"Content-Type" : 'application/json'},
                    body: JSON.stringify({completed: completedChange})
                })
                if (response.status === 200) {
                    const timer = setTimeout(() => {
                        props.getMyDay();
                      }, 300);
                      return () => clearTimeout(timer);
                    
                    //console.log("Task Completed from MyDay!")
                  }
            }catch(err){
                console.error(err)
            }
        }
        else{
            try{
                response = await fetch(`${process.env.REACT_APP_SERVERURL}/myDay/completed/myLists/${props.task.todo_id}`, {
                    method: "PUT",
                    headers: {"Content-Type" : 'application/json'},
                    body: JSON.stringify({completed: completedChange})
                })
                if (response.status === 200) {
                    const timer = setTimeout(() => {
                        props.getMyDay();
                      }, 300);
                      return () => clearTimeout(timer);
                    //console.log("List Task Completed from MyDay!")
                  }
            }catch(err){
                console.error(err)
            }

        }
    }
  return (
    <div className='myDayItem'>
        <p className='myDay-bc'>
            {props.task.list_id === 'Task' ? "Tasks" : `My Lists > ${props.task.list_title}`}
            </p>
        <div className='myDayItem-wrapper'>
            <input type="checkbox"  checked={myDayCompleted} className={`ui-checkbox`} id='myDayCheckbox' onChange={()=>completeMyDay(props.task.list_id)}/>
            <p className='myDay-title'>{props.task.title}</p>
            <IoClose  className='myDayCloseIcon' onClick={()=>removeMyDay(props.task.list_id)}/>
        </div>
    </div>
  )
}

export default MyDayItem