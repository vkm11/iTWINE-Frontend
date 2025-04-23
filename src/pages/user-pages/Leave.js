import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../../components/UserLayouts/Layout';
import axios from 'axios';
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
        status: "0"
    });

    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false); // Track form validity
    const [touched, setTouched] = useState({}); // Track touched fields
    const [responseMessage, setResponseMessage] = useState(''); 
    const [leavesData, setLeavesData] = useState([]);
    const [hideStatus] = useState(false);
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
            const userId = localStorage.getItem('user_id');

            const formDataWithUserId = {
                ...leaveForm,
                userId  // 👈 Add userId to the data being sent
            };

            axios
                .post(`${process.env.REACT_APP_API}/leave/create-leave`, formDataWithUserId)
                .then((res) => {
                    console.log(res.data);

                    setLeaveForm({
                        fname: '',
                        lname: '',
                        phone: '',
                        email: '',
                        reason: '',
                        dep: '',
                        formdate: '',
                        todate: '',
                        status: '0'
                    });
                    setErrors({});
                    setTouched({});
                    setIsFormValid(false);

                    setResponseMessage(res.data.message);
                    setTimeout(() => {
                        setResponseMessage('');
                    }, 3000);
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        }
    };

    const handleStatusChange = (e) => {
        setLeaveForm((prevForm) => ({
            ...prevForm,
            status: e.target.value
        }));
    };
    const getData = () => {
        const userId = localStorage.getItem('user_id');
        console.log(userId)
        axios
            .get(`${process.env.REACT_APP_API}/leave/user-leaves/${userId}`)
            .then((res) => {
                setLeavesData(res.data.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    useEffect(() => {
        getData();
        setIsFormValid(validateForm());
        const interval = setInterval(() => {
            getData();
        }, 1000); 
        return () => clearInterval(interval);
    }, [leaveForm, touched, validateForm]);

    return (
        <>
            <Layout>
                <div className='text-center py-2'>
                    <p className='fw-bold font22 pt-2 mb-0'>Leave Application Form</p>
                    <img src="../../images/newLayer/layer.png" alt="layer" height="50" width="100%" />
                </div>
                <div className="container-fluid px-2">
                    <form>
                        <div className="row mx-0">
                            <div className="col-sm-4">
                                <label className="form-label mb-0" htmlFor="fname">Applicant First Name</label><span className='text-danger'>*</span>
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
                                <label className="form-label mb-0" htmlFor="lname">Applicant Last Name</label><span className='text-danger'>*</span>
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
                                <label className="form-label mb-0" htmlFor="dep">Departments</label><span className='text-danger'>*</span>
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
                                <label className="form-label mb-0" htmlFor="phone">Phone</label><span className='text-danger'>*</span>
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
                                <label className="form-label mb-0" htmlFor="email">Email</label><span className='text-danger'>*</span>
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
                                <label className="form-label mb-0">Reason for Leave</label><span className='text-danger'>*</span>
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
                                <label className="form-label mb-0" htmlFor="formdate">From</label><span className='text-danger'>*</span>
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
                                <label className="form-label mb-0" htmlFor="todate">To</label><span className='text-danger'>*</span>
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
                            {hideStatus && (<div className="col-sm-4">
                                <label className='form-label my-0'>Status</label><span className='text-danger'>*</span>
                                <select
                                    className="form-control"
                                    value={leaveForm.status}
                                    onChange={handleStatusChange}
                                >
                                    <option value="" disabled>Select status</option>
                                    <option value="0" className="text-warning">pending</option>
                                    <option value="1" className="text-success">Approved</option>
                                    <option value="2" className="text-danger">Rejected</option>

                                </select>
                            </div>)}
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
                    {responseMessage && <div className="response-message">{responseMessage}</div>}
                </div>
                <div className='p-2'>
                    {leavesData.length > 0 ? (
                    <table className="table table-striped table-hover table-bordered border-secondary">
                        <thead>
                            <tr>
                                <th>Sl.no</th>
                                <th>Name</th>
                                <th>Department</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>Reason for Leave</th>
                                <th>Form date</th>
                                <th>To date</th>
                                <th className='text-center'>Status</th>
                            </tr>
                        </thead>
                        <tbody className="table-group-divider">
                            {leavesData.map((le, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{le.fname} {le.lname}</td>
                                    <td>{le.dep}</td>
                                    <td>{le.phone}</td>
                                    <td>{le.email}</td>
                                    <td>{le.reason}</td>
                                    <td>{formatDate(le.formdate)}</td>
                                    <td>{formatDate(le.todate)}</td>
                                    {/* <td>{le.status}</td> */}
                                    <td>
                                        <div className='text-center'>
                                            {le.status === 0 && <span className="badge rounded-pill text-bg-warning">Pending</span>}
                                            {le.status === 1 && <span className="badge rounded-pill text-bg-danger">Rejected</span>}
                                            {le.status === 2 && <span className="badge rounded-pill text-bg-success">Approved</span>}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    ) : (
                        <p className="text-center text-muted">No leave records found.</p>
                    )}
                </div>
            </Layout>
        </>
    );
};

export default Leave;
