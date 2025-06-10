import React, { useState } from 'react'

const Demoone = () => {
    const [myform, setMyform] = useState({
        name: '',
        age: '',
        status: ''
    })
    const [error, setErrors] =  useState({})

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMyform(prev => ({
            ...prev,
            [name]: value
        }))
    }
    const handleBlur  = (e) =>{
        const { name } = e.target;
        setMyform(prev => ({
            ...prev,
            [name]: true
        }))
    }

    const submitForm = (e) => {
        e.preventDefault();
        console.log(myform)
    }
    return (
        <>
            <form onSubmit={submitForm}>
                <div className='row mx-0'>
                    <div className='col-sm-3'>
                        <label>Enter Name</label>
                        <input type="text" name='name' value={myform.name} onChange={handleInputChange} onBlur={handleBlur}/>
                        {error.name && <div className='text-danger'>Name is Required</div> }
                    </div>
                    <div className='col-sm-3'>
                        <label>Enter Age</label>
                        <input type="number" name='age' value={myform.age} onChange={handleInputChange} onBlur={handleBlur} />
                    </div>
                    <div className='col-sm-3'>
                        <label>Enter Name</label>
                        <select name='status' value={myform.status} onChange={handleInputChange} onBlur={handleBlur} >
                            <option selected>Select status</option>
                            <option value='1'>Active</option>
                            <option value='2'>Inactive</option>
                        </select>
                    </div>
                </div>
                <div>
                    <button>Submit</button>
                </div>
            </form>
        </>
    )
}

export default Demoone
