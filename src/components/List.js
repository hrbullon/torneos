import React from 'react'

export default (props) => {

    return (
        Object.keys(props.items).map( (index, value) => {
            return <li key={index} class="tm-list-group-item">
                    <a href={"/"+props.kind+"/"+index}>{ props.items[index].Descripcion }</a>
                </li>    
        })
    )
}
