import React,{useState,useEffect} from 'react'
import axios from 'axios';
import classNames from 'classnames';
import { AiOutlineClose } from "react-icons/ai";
import { MdDoneOutline } from "react-icons/md";

export default function GrocerySection() {
    const [groceryItemInput,updateGroceryItemInput]= useState('');
    const [groceryItemsList, updateItemsList] = useState([]);
    async function getGroceryItems() {
        try {
            const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/groceryItems/list`);
            console.log('response', response);
            updateItemsList([...response.data.result]);
        } catch (error) {
            console.log('Some error occurred while listing', error);
        }
    }
    useEffect(() => {
        getGroceryItems();
    }, [])
    function getCurrentMonth() {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const date = new Date();
        const currentMonthInInteger = date.getMonth();
        return months[currentMonthInInteger];
    }
    async function addGroceryItem() {
        try {
            const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/groceryItems/add`, {
                itemName: groceryItemInput,
                isPurchased: false
            });
            console.log('response', response);
            updateGroceryItemInput("");
            getGroceryItems();
        } catch (error) {
            console.log('Some error occurred while adding', error);
        }
    }
    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            console.log('enter key pressed');
            addGroceryItem();
        }
    }
    async function updatePurchasedStatus(_id) {
        try {
            const response = await axios.put(`${process.env.REACT_APP_SERVER_URL}/groceryItems/update`, {
                _id: _id
            });
            console.log('response', response);
            getGroceryItems();
        }catch (error) {
            console.log('Some error occurred while updating', error);
        } 
    }
    async function deleteItem(_id){
        try {
            const response = await axios.delete(`${process.env.REACT_APP_SERVER_URL}/groceryItems/delete`, 
            { data: {
                _id: _id
            },});
            console.log('response', response);
            getGroceryItems();
        }catch (error) {
            console.log('Some error occurred while deleting', error);
        } 
    }
    function renderGroceryItems() {
        console.log('groceryItemsList', groceryItemsList);
        return groceryItemsList.map((groceryitem) => {
            return (
                <div key={groceryitem.itemName} className='item w-80 h-10 border border-indigo-700 flex justify-center items-center px-2'>
                    <span className={classNames({'line-through':groceryitem.isPurchased=== true})}>
                        {groceryitem.itemName}
                    </span>
                    <div className='ml-auto'>
                        <button className='text-xl mr-2' onClick={() => updatePurchasedStatus(groceryitem._id)}><MdDoneOutline/></button>
                        <button className='text-xl' onClick={() => deleteItem(groceryitem._id)}><AiOutlineClose/></button>
                    </div>
                </div>
            )
        });
    }
    return (
        <div className="w-full h-96 flex justify-center items-center flex-col">
            <span className="text-2xl text-white m-4">Plan for the month of {getCurrentMonth()}</span>
            <div>
                <input className='border-2 border-black rounded w-80 h-10 grocery-items text-white' type="text" placeholder='Add item' value={groceryItemInput} onChange={(e)=>updateGroceryItemInput(e.target.value)} onKeyDown={handleKeyDown}></input>
            </div>
            <div>
                {renderGroceryItems()}
            </div>
        </div>
    )
}
