import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../../components/UserLayouts/Layout';

const Leave = () => {
    const [leaveForm, setLeaveForm] = useState({
        fname: '',
        lname: '',
        phone: '',
        email: '',
        reason: '',
        dep: '',
        formdate: '',
        todate: '',
    });

    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false); // Track form validity
    const [touched, setTouched] = useState({}); // Track touched fields

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Update the form data
        setLeaveForm({
            ...leaveForm,
            [name]: value,
        });

        // Clear error for the field if it's corrected
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '', // Clear the error for the specific field being changed
        }));
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;

        // Set reason if any checkbox is checked, otherwise reset it to an empty string
        setLeaveForm({
            ...leaveForm,
            reason: checked ? name : '',
        });

        // Clear error when any reason checkbox is selected
        if (checked) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                reason: '', // Clear the error for reason when a reason is selected
            }));
        }
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched((prevTouched) => ({
            ...prevTouched,
            [name]: true, // Mark the field as touched
        }));
    };

    const validateForm = useCallback(() => {
        const validationErrors = {};

        if (!leaveForm.fname) {
            validationErrors.fname = 'First Name is required.';
        }

        if (!leaveForm.lname) {
            validationErrors.lname = 'Last Name is required.';
        }

        if (!leaveForm.dep) {
            validationErrors.dep = 'Department is required.';
        }

        if (!leaveForm.phone || isNaN(leaveForm.phone)) {
            validationErrors.phone = 'Phone number is required and must be valid.';
        }

        if (!leaveForm.email) {
            validationErrors.email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(leaveForm.email)) {
            validationErrors.email = 'Please enter a valid email address.';
        }

        // Check reason only if not selected
        if (!leaveForm.reason) {
            validationErrors.reason = 'Please select a reason for leave.';
        }

        if (!leaveForm.formdate) {
            validationErrors.formdate = 'First Day of Absence is required.';
        }

        if (!leaveForm.todate) {
            validationErrors.todate = 'Last Day of Absence is required.';
        }

        // Validate date range: formdate must be before todate
        if (leaveForm.formdate && leaveForm.todate) {
            const formDate = new Date(leaveForm.formdate);
            const toDate = new Date(leaveForm.todate);

            // Check if formdate is greater than todate
            if (formDate > toDate) {
                validationErrors.date = 'First Day of Absence must be before the Last Day of Absence.';
            }
        }

        setErrors(validationErrors);

        return Object.keys(validationErrors).length === 0;
    }, [leaveForm]); // Added touched to the dependency array

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            console.log('Form submitted:', leaveForm);

            // Reset the form fields
            setLeaveForm({
                fname: '',
                lname: '',
                phone: '',
                email: '',
                reason: '',
                dep: '',
                formdate: '',
                todate: '',
            });

            // Reset errors
            setErrors({});
            setTouched({});
            setIsFormValid(false); // Reset the button state after form submission
        }
    };

    useEffect(() => {
        setIsFormValid(validateForm());
    }, [leaveForm, touched, validateForm]);

    return (
        <>
            <Layout>
                <p className="font22 text-center fw-bold">Leave Application Form</p>
                <div className="container-fluid px-2">
                    <form>
                        <div className="row mx-0">
                            <div className="col-sm-4">
                                <label className="form-label" htmlFor="fname">Applicant First Name</label><span className='text-danger'>*</span>
                                <input
                                    className="form-control"
                                    id="fname"
                                    type="text"
                                    name="fname"
                                    value={leaveForm.fname}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur} // Mark as touched on blur
                                    required
                                />
                                {touched.fname && errors.fname && <div className="text-danger">{errors.fname}</div>}
                            </div>
                            <div className="col-sm-4">
                                <label className="form-label" htmlFor="lname">Applicant Last Name</label><span className='text-danger'>*</span>
                                <input
                                    className="form-control"
                                    id="lname"
                                    type="text"
                                    name="lname"
                                    value={leaveForm.lname}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur} // Mark as touched on blur
                                    required
                                />
                                {touched.lname && errors.lname && <div className="text-danger">{errors.lname}</div>}
                            </div>
                            <div className="col-sm-4">
                                <label className="form-label" htmlFor="dep">Departments</label><span className='text-danger'>*</span>
                                <select
                                    className="form-control"
                                    id="dep"
                                    name="dep"
                                    value={leaveForm.dep}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur} // Mark as touched on blur
                                    required
                                >
                                    <option value="" disabled>Select Departments</option>
                                    <option value="mob">Mobile team</option>
                                    <option value="php">PHP team</option>
                                    <option value="dotnet">.Net team</option>
                                </select>
                                {touched.dep && errors.dep && <div className="text-danger">{errors.dep}</div>}
                            </div>
                        </div>
                        <div className="row mt-2 mx-0">
                            <div className="col-sm-4">
                                <label className="form-label" htmlFor="phone">Phone</label><span className='text-danger'>*</span>
                                <input
                                    className="form-control"
                                    id="phone"
                                    type="number"
                                    name="phone"
                                    value={leaveForm.phone}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur} // Mark as touched on blur
                                    required
                                />
                                {touched.phone && errors.phone && <div className="text-danger">{errors.phone}</div>}
                            </div>
                            <div className="col-sm-4">
                                <label className="form-label" htmlFor="email">Email</label><span className='text-danger'>*</span>
                                <input
                                    className="form-control"
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={leaveForm.email}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur} // Mark as touched on blur
                                    required
                                />
                                {touched.email && errors.email && <div className="text-danger">{errors.email}</div>}
                            </div>
                            <div className="col-sm-4">
                                <label className="form-label">Reason for Leave</label><span className='text-danger'>*</span>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        name="Emergency Leave"
                                        checked={leaveForm.reason === 'Emergency Leave'}
                                        onChange={handleCheckboxChange}
                                        onBlur={handleBlur}
                                    />
                                    <label className="form-check-label" htmlFor="flexCheckDefault">
                                        Emergency Leave
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        name="Casual Leave"
                                        checked={leaveForm.reason === 'Casual Leave'}
                                        onChange={handleCheckboxChange}
                                        onBlur={handleBlur}
                                    />
                                    <label className="form-check-label" htmlFor="flexCheckDefault">
                                        Casual Leave
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        name="others"
                                        checked={leaveForm.reason === 'others'}
                                        onChange={handleCheckboxChange}
                                        onBlur={handleBlur}
                                    />
                                    <label className="form-check-label" htmlFor="flexCheckDefault">
                                        Others
                                    </label>
                                </div>
                                {touched.reason && errors.reason && <div className="text-danger">{errors.reason}</div>}
                            </div>
                        </div>
                        <div className="row mt-2 mx-0">
                            <div className="col-sm-4">
                                <label className="form-label" htmlFor="formdate">From</label><span className='text-danger'>*</span>
                                <input
                                    className="form-control"
                                    id="formdate"
                                    type="date"
                                    name="formdate"
                                    value={leaveForm.formdate}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur} // Mark as touched on blur
                                    required
                                />
                                {touched.formdate && errors.formdate && <div className="text-danger">{errors.formdate}</div>}
                            </div>
                            <div className="col-sm-4">
                                <label className="form-label" htmlFor="todate">To</label><span className='text-danger'>*</span>
                                <input
                                    className="form-control"
                                    id="todate"
                                    type="date"
                                    name="todate"
                                    value={leaveForm.todate}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur} // Mark as touched on blur
                                    required
                                />
                                {touched.todate && errors.todate && <div className="text-danger">{errors.todate}</div>}
                                {touched.todate && errors.date && <div className="text-danger">{errors.date}</div>} {/* Display custom date range error */}
                            </div>
                        </div>
                        <div className="row mt-2 mx-0">
                            <div className="col-sm-12 text-end">
                                <button
                                    className="btn btn-primary"
                                    onClick={handleSubmit}
                                    disabled={!isFormValid} // Disable submit if form is invalid
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </Layout>
        </>
    );
};

export default Leave;
