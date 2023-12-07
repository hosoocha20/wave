import React from "react";

const DeleteModal = (props) => {
  const {
    deleteModal,
    setDeleteModal,
    listName,
    deleteType,
    task,
    getData,
    getAllData,
    listId,
    getTaskLists,
    setOpenLink
  } = props;
  const handleDelete = async () => {
    try {
      if (props.deleteType === "Task") {
        const response = await fetch(
          `${process.env.REACT_APP_SERVERURL}/todos/${task.todo_id}`,
          {
            method: "DELETE",
          }
        );
        //console.log(response);
        if (response.status === 200) {
          getData();
          getAllData();
          setDeleteModal(false);
          //console.log("Task Deleted!")
        }
      }
      else{
        const response = await fetch( `${process.env.REACT_APP_SERVERURL}/todoLists/${listId}` , 
        {
            method: "DELETE"
        })
        console.log(response)
        if (response.status === 200) {
            getTaskLists();
            setDeleteModal(false);
            setOpenLink("myDay");
        }
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div
      className={` ${
        deleteModal ? "deleteModal-container" : "deleteModal-hide"
      }`}
    >
      <div className="deleteModal-box">

        <h3>Delete this {deleteType}?</h3>
        <p>
          <span>{listName}</span> will be permanently deleted.
        </p>

        <div className="deleteModal-box__btns">
          <button onClick={(e) => setDeleteModal(false)}>Cancel</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
