import React from 'react'
import { IoClose } from "react-icons/io5";

const AddListModal = (props) => {
    const cancelList = (e)=>{
        props.setNewListModal(false);
        props.setNewList({...props.newList, list_title: ''})
    }
  return (
    <div className={`addListModal`}>
        <div className='addListModal-modal'>
            <div className='addListModal-closeIcon-wrapper'>
                <IoClose className='addListModal-closeIcon' size={"20px"} onClick={cancelList}/>
            </div>
            <form className='addListModal-form' onSubmit={(e)=>props.postNewList(e)}>
                <input type='text' maxLength={30} autoFocus placeholder='Add a List Title' value={props.newList.list_title} onChange={(e) => props.setNewList({...props.newList, list_title: e.target.value})}/>
                <div className='addListModal-btn-wrapper'>
                    <button>Continue</button>
                </div>
            </form>

        </div>
    </div>
  )
}

export default AddListModal