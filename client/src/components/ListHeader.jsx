import React, { useState } from "react";
import useClickOutside from "../hooks/useClickOutside";
import {BiSortAlt2} from "react-icons/bi";
import { AiOutlineSortAscending } from "react-icons/ai";

const ListHeader = (props) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const closeDropdown = () => {
    setShowDropdown(false);
  };
  const dropdownRef = useClickOutside(closeDropdown);
  return (
    <div className="todoPage-header">
      <h2 className="todoPage-ListName">{props.listName || ''}</h2>
      <div className="todoPage-filter">
        <div className={`${props.filteredTask === 'inProgress' ? "list-active-progress" : ""}`} onClick={(e)=>props.setFilteredTask('inProgress')}>In Progress</div>

        <div className={`${props.filteredTask === 'important' ? "list-active-important" : ""}`} onClick={(e)=>props.setFilteredTask('important')}>Important</div>
        <div className={`${props.filteredTask === 'completed' ? "list-active-completed" : ""}`} onClick={(e)=>props.setFilteredTask('completed')}>Completed</div>
      </div>
      <div ref={dropdownRef} className={`todoPage-sort ${showDropdown ? "todoPage-sort-active" : ""}`}> 
        <button className="todoPage-sort__label" onClick={(e) => setShowDropdown(!showDropdown)}>
          {props.sortOption === "Recently Added" ? (
            <BiSortAlt2 size={"20px"} className="sort-icon"/>
          )
        :
        (
            <AiOutlineSortAscending size={"20px"} className="sort-icon"/>
        )}
          
          <p>Sort</p>
        </button>
        <div className={`todoPage-sort__dropdownSection ${showDropdown ? "" : "dropdown-hide"}`} onClick={(e)=>setShowDropdown(false)}>
          <div onClick={(e)=>props.setSortOption("Alphabetically")}>
            <AiOutlineSortAscending />
            <p>Alphabetically</p>
          </div>
          <div onClick={(e)=>props.setSortOption("Recently Added")}>
            <BiSortAlt2 />
            <p>Recently Added</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ListHeader;
