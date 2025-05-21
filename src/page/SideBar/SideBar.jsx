import React from "react";
import logo from "../../asset/logo.png";
import "./SideBar.css";

export default function SideBar() {
    return (
        <div className="sidebar">
            <div className="logo-container">
                <img src={logo} alt="Logo" className="logo" />
            </div>
        </div>
    );
}
