import React, {useState, useEffect} from 'react'
import { API } from '../../config'
import RenderTodo from '../RenderTodo'
import './Home.css'

export default function Home(props) {
    const [todoInput,setTodoInput] = useState('')
    const [data, setData] = useState([])
    const [modal, setModal]= useState(false)
    const [editElement, setEditElement] = useState('')
    const [editInput, setEditInput] = useState('')


    useEffect(()=>{
        let token = localStorage.getItem('token')
        if(token == null){
            props.history.push('/login')
        }else{
            getAllTodos()
        }

    },[])
    const logOut=()=>{
        localStorage.removeItem('token', '')
        props.history.push('/login')
    }

    const getAllTodos=async()=>{
        let token = localStorage.getItem('token')
        try{
            let resp = await fetch(API,{
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                    Authorization:'token '+ token
                }
            })
            let json = await resp.json()
            console.log(json)
            setData(json)
        }catch(err){
            console.log(err)
        }
    }
    const createTodo=async()=>{
        let id = localStorage.getItem('id')
        let token = localStorage.getItem('token')
        let data = {
            author:id,
            title:todoInput,
            body:todoInput
        }
        try {
            let resp = await fetch(API,{
                method:'POST',
                body:JSON.stringify(data),
                headers:{
                    'Content-Type':'application/json',
                    Authorization:'token '+ token
                }
            })
            let json = await resp.json()
            setTodoInput('')
            getAllTodos()
        } catch (error) {
            console.log(error)
        }
    }
    const doneTodo= async (elId)=>{
        let idElement = elId
        let id = localStorage.getItem('id')
        let token = localStorage.getItem('token')

        let data = {
            username: id,
            status: true
        }
        try {
            let resp = await fetch(API+idElement+'/',{
                method:'PATCH',
                body:JSON.stringify(data),
                headers:{
                    'Content-Type':'application/json',
                    Authorization:'token '+ token
                }
            })
            setTodoInput('')
            getAllTodos()
        } catch (error) {
            console.log(error)
        }
    }

    const openModal=(event)=>{
        setModal(true)
        setEditInput(event.target.dataset.title)
        setEditElement(event.target.value)
    }
    const deleteTodo = async (elId)=>{
        let idElement = elId
        let token = localStorage.getItem('token')
        try {
            let resp = await fetch(API+idElement+'/',{
                method:'DELETE',
                headers:{
                    'Content-Type':'application/json',
                    Authorization:'token '+ token
                }
            })
            setTodoInput('')
            getAllTodos()
        } catch (error) {
            console.log(error)
        }
    }

    const saveEdit=async()=>{
        let idElement = editElement
        let id = localStorage.getItem('id')
        let token = localStorage.getItem('token')
        let title = editInput
        let data = {
            username:id,
            title:title
        }
        try {
            let resp = await fetch(API+idElement+'/',{
                method:'PATCH',
                body:JSON.stringify(data),
                headers:{
                    'Content-Type':'application/json',
                    Authorization:'token '+ token
                }
            })
            setModal(false)

            getAllTodos()

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <h1>Home</h1>
            <p onClick={logOut}>Выйти</p>

            <div>
                <input 
                    type="text" 
                    value={todoInput}
                    onChange={(event)=>{
                        setTodoInput(event.target.value)
                    }}
                    placeholder='todo'/>
                <button onClick={()=>{
                    createTodo()
                }}>Add</button>

            </div>

                <RenderTodo
                    data={data}
                    doneTodo={doneTodo}
                    deleteTodo={deleteTodo}
                    openModal={openModal}
                />
                {modal ? 
                    <div className='modal'>
                        <span onClick={
                            ()=>setModal(false)
                        }
                            className='close'
                        >+</span>
                        <input type="text"
                            value={editInput}
                            onChange={(event)=>{
                                setEditInput(event.target.value)
                            }}
                        />
                        <button onClick={()=>{
                            saveEdit()
                        }}>Change</button>
                    </div>
                : null
                }
        </div>
    )
}
