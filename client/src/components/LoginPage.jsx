import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie"

import WaveLogo from "../assets/waveLogo.png";
import SurfSVG from "../assets/undraw_surfer_2.svg";
import SignupOverlay from "./SignupOverlay";
import LeftOverlay from "./LeftOverlay";
import LoginOverlay from "./LoginOverlay";
import RightOverlay from "./RightOverlay";

const LoginPage = () => {
    const [loginBoxDisplay, setLoginBoxDisplay] = useState('login');
    const [email, setEmail] = useState()
    const [pw, setPw] = useState();
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [error, setError] = useState(null);
    const [cookies, setCookie, removeCookie] = useCookies(null)

    const signUp = async(e) =>{
      e.preventDefault();
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/signup` ,{
        method: "POST",
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({email, firstName, lastName, pw})
      })
      const data = await response.json()
      if (data.detail){
        setError(data.detail)
        let obj = document.getElementById("signUp-error")
        obj.style.animation = 'none';
        window.requestAnimationFrame(function(){
          obj.style.animation = 'bounce 0.5s 0.15s ease';
        });
      } else{
        setCookie('Email', data.email)
        setCookie('AuthToken', data.token)
        
        try {
          const response = await fetch(
            `${process.env.REACT_APP_SERVERURL}/todoLists`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  list_id: "",
                  list_title: "Work",
                  user_email: email,
                  date: new Date(),
                  bg: "bl"}),
              }
            );
            //console.log(response)
          } catch (err) {
            console.error(err);
          }
        window.location.reload()
      }
      //console.log(error);
    }

    const logIn = async(e) =>{
      e.preventDefault();
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/login` ,{
        method: "POST",
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({email, pw})
      })
      const data = await response.json()
      if (data.detail){
        setError(data.detail)
        let obj = document.getElementById("login-error")
        obj.style.animation = 'none';
        window.requestAnimationFrame(function(){
          obj.style.animation = 'bounce 0.5s 0.15s ease';
        });
      } else{
        setCookie('Email', data.email)
        setCookie('AuthToken', data.token)
        window.location.reload()
      }
      //console.log(error);
    }

    useEffect(()=>{
      setError(null)
      setEmail('')
      setPw('')
      setFirstName('')
      setLastName('')
    },[loginBoxDisplay])

    // useEffect(()=>{


    //   let el = document.getElementById("signUp-error");
    //   let newone = el.cloneNode(true);
    //   el.parentNode.replaceChild(newone, el);
    //   console.log("hi")
    // },[error])
  return (
    <div className="loginPage">
      <div className="loginPage__box">
        <div className="leftSide-overlay">
            <LoginOverlay loginBoxDisplay={loginBoxDisplay} setLoginBoxDisplay={setLoginBoxDisplay} email={email} setEmail={setEmail} pw={pw} setPw={setPw} logIn={logIn} error={error}/>
            <LeftOverlay loginBoxDisplay={loginBoxDisplay} setLoginBoxDisplay={setLoginBoxDisplay}/>
        </div>
        <div className="rightSide-overlay">
            <SignupOverlay loginBoxDisplay={loginBoxDisplay} setLoginBoxDisplay={setLoginBoxDisplay} signUp={signUp} email={email} setEmail={setEmail} firstName={firstName} setFirstName={setFirstName} lastName={lastName} setLastName={setLastName} pw={pw} setPw={setPw} error={error}/> 
            <RightOverlay loginBoxDisplay={loginBoxDisplay} setLoginBoxDisplay={setLoginBoxDisplay}/>
        </div>
        <div className={`loginPage-box-moving ${loginBoxDisplay === 'login' ? "loginPage-box-moving-right" : "loginPage-box-moving-left"}`}>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
