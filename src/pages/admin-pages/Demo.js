import React, { useState, useCallback, useEffect } from 'react'

const Demo = () => {
    const [userForm, setUserForm] = useState({
        name: '',
        age: '',
        status: '1'
    })
    const [touched, setTouched] = useState({});
    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);

    const onChangeinput = (e) => {
        const { name, value } = e.target;
        setUserForm(prev => ({
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
    const onsubmitForm = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Submitted:', userForm);
        }
    }
    const validateForm = useCallback(() => {
        const validationErrors = {};
        if (!userForm.name.trim()) {
            validationErrors.name = 'Name is required.';
        }
        if (!userForm.age) {
            validationErrors.age = 'Age is required.';
        }
        if (!userForm.status) {
            validationErrors.status = 'Status is required.';
        }
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    }, [userForm]);

    useEffect(() => {
        setIsFormValid(validateForm());

    }, [userForm, touched, validateForm])

    return (
        <>
            <form onSubmit={onsubmitForm}>
                <div>
                    <label>Enter Name</label>
                    <input type="text" name='name' value={userForm.name} onChange={onChangeinput} onBlur={handleBlur} />
                    {touched.name && errors.name && <div className="text-danger">{errors.name}</div>}
                </div>
                <div>
                    <label>Enter age</label>
                    <input type="number" name='age' value={userForm.age} onChange={onChangeinput} onBlur={handleBlur} />
                    {touched.age && errors.age && <div className='text-danger'>{errors.age}</div>}
                </div>
                <div>
                    <label>Status</label>
                    <select name='status' value={userForm.status} onChange={onChangeinput}>
                        <option value="1">Active</option>
                        <option value="2">InActive</option>
                    </select>
                </div>
                <div>
                    <button type='submit' className='btn btn-primary' disabled={!isFormValid}>Submit</button>
                </div>
            </form>

        </>
    )
}

export default Demo
