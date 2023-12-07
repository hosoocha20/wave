import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import todaySVG from "../assets/Schedule-rafiki.svg";
import { HiOutlinePlus } from "react-icons/hi";
import MyDayItem from "./MyDayItem";
import axios from "axios";

const MyDay = (props) => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const userEmail = cookies.Email;
  const [date, setDate] = useState(new Date());
  const [myDayTasks, setMyDayTasks] = useState([]);
  const [newMyDay, setNewMyDay] = useState({
    userEmail: userEmail,
    title: "",
    date: new Date(),
    completed: false,
    myDay: true,
  });
  const tasks = [
    { list_id: "0", todo_id: "0", list_title: "My Day today", myDay: true },
    { list_id: "1", todo_id: "1", list_title: "Work on My Day", myDay: true },
    { list_id: "2", todo_id: "2", list_title: "Styling", myDay: true },
  ];

  const getMyDay = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVERURL}/myDay/${userEmail}`
      );
      const json = await response.data;
      //console.log(json)
      setMyDayTasks(json);
      //console.log(response)
    } catch (err) {
      console.error(err);
    }
  };

  const postMyDay = async (e) => {
    e.preventDefault();
    if (!newMyDay.title || /^\s*$/.test(newMyDay.title)) {
      return;
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/myDay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMyDay),
      });
      //console.log(response)
      if (response.status === 200) {
        setNewMyDay({
          userEmail: userEmail,
          title: "",
          date: new Date(),
          completed: false,
          myDay: true,
        });
        getMyDay();
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getMyDay();
  }, []);

  return (
    <div className="myDay-container">
      <div className="myDay-left">
        <div className="myDay-header">
          <h2>My Day</h2>
          <h4>
            {props.weekday[date.getDay()]}, {date.getDate()}{" "}
            {props.month[date.getMonth()]}
          </h4>
        </div>
        <div className="myDay-taskList-container">
          {myDayTasks ? (
            myDayTasks.map((t) => {
              return <MyDayItem key={t.todo_id} task={t} getMyDay={getMyDay} />;
            })
          ) : (
            <div className="emptyMyDay-container">
              <img src={todaySVG} id="todaySVG" />
              <p>Maximise your day</p>
              <p>Stay on top of your tasks with My Day:</p>
              <p>Your key to daily accomplishments.</p>
            </div>
          )}
        </div>
        <form className="myDay-form" onSubmit={postMyDay}>
          <HiOutlinePlus size={"18px"} color={"#31415f"} />
          <input
            type="text"
            placeholder="Add a Task"
            maxLength={200}
            name="title"
            value={newMyDay.title}
            onChange={(e) =>
              setNewMyDay({ ...newMyDay, title: e.target.value })
            }
            autoComplete="new-password"
          ></input>
        </form>
      </div>
    </div>
  );
};

export default MyDay;
