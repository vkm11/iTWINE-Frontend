import React, { useState, useCallback, useEffect } from 'react'

const Demoone = () => {
    const [myform, setMyform] = useState({
        name: '',
        age: '',
        status: ''
    })
    const [touched, setTouched] = useState({});
    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMyform(prev => ({
            ...prev,
            [name]: value
        }))
    }
    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prevState => ({
            ...prevState,
            [name]: true
        }))

    }

    const submitForm = (e) => {
        e.preventDefault();
        console.log(myform)
        if (validateForm()) {
            console.log('Submitted:', myform);
        }
    }
    const validateForm = useCallback(() => {
        const validationErrors = {};
        if (!myform.name.trim()) {
            validationErrors.name = 'Name is required.';
        }
        if (!myform.age) {
            validationErrors.age = 'Age is required.';
        }
        if (!myform.status) {
            validationErrors.status = 'Status is required.';
        }
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    }, [myform]);
    useEffect(() => {
        setIsFormValid(validateForm());

    }, [myform, touched, validateForm])
    return (
        <>
            <form onSubmit={submitForm}>
                <div className='row mx-0'>
                    <div className='col-sm-3'>
                        <label>Enter Name</label>
                        <input type="text" name='name' value={myform.name} onChange={handleInputChange} onBlur={handleBlur}/>
                        {errors.name && <div className='text-danger'>Name is Required</div> }
                    </div>
                    <div className='col-sm-3'>
                        <label>Enter Age</label>
                        <input type="number" name='age' value={myform.age} onChange={handleInputChange} onBlur={handleBlur} />
                        {errors.age && <div className='text-danger'>Age is Required</div>}
                    </div>
                    <div className='col-sm-3'>
                        <label>Select Status</label>
                        <select name='status' value={myform.status} onChange={handleInputChange} onBlur={handleBlur} >
                            <option selected>Select status</option>
                            <option value='1'>Active</option>
                            <option value='2'>Inactive</option>
                        </select>
                        {errors.status && <div className='text-danger'>Status is Required</div>}
                    </div>
                </div>
                <div>
                    <button className='btn btn-primary' type='submit'>Submit</button>
                </div>
            </form>
        </>
    )
}

export default Demoone
