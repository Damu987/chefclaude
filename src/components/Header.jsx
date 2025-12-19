import React from "react"
import chefclaudeLogo from "../assets/chef-claude-icon.png"

export default function Header(){
    return(
        <header>
            <img src={chefclaudeLogo} alt="Chef Claude Logo" className="logo" />
            <h1>Chef Claude</h1>
        </header>
    )
}