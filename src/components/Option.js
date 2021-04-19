import React, { Component } from 'react'

export default (props) => {
    return (
        Object.keys(props.items).map( (index, value) => {
            let selected = (props.selected == index)? "selected" : "";
            return <option selected={selected} key={index} value={index}>{ props.items[index].Nombre }</option>    
        })
    )
}
