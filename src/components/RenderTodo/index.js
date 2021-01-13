import React from 'react'

export default function RenderTodo(props) {
    return (
        <div>
            {props.data ? 
                props.data.map(el=>{
                    return(
                        <div key={el.id} style={el.status ? {background:'green'} : {background:'red'}}>
                            <h2>{el.title}</h2>
                            <div>
                                {!el.status ? 
                                    <button
                                        onClick={()=>{
                                            props.doneTodo(el.id)
                                        }}
                                    >
                                        Done
                                    </button>
                                    :null }

                                <button 
                                    onClick={()=>{
                                        props.deleteTodo(el.id)
                                    }}>
                                    Delete
                                </button>
                                <button 
                                    value={el.id}
                                    data-title = {el.title}
                                    onClick={event=>{
                                        props.openModal(event)
                                    }}
                                    >
                                    Edit
                                </button>
                            </div>
                        </div>
                    )
                })
                : <h3>Пока данных нет</h3>
            }
        </div>
    )
}
