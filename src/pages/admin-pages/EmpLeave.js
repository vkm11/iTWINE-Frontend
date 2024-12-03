import React, { useState, useEffect } from 'react';
import Layout from '../../components/AdminLayouts/Layout';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
const EmpLeave = () => {
    const [leavesData, setLeavesData] = useState([]);
    const [editStatus, setEditStatus] = useState(null); // To track the status being edited
    const [newStatus, setNewStatus] = useState(null); // To store the new status temporarily

    const getData = () => {
        axios
            .get(`${process.env.REACT_APP_API}/leave/`)
            .then((res) => {
                setLeavesData(res.data.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const updateStatus = (leaveId, newStatus) => {
        axios
            .put(`${process.env.REACT_APP_API}/leave/update-status/${leaveId}`, { status: newStatus })
            .then((res) => {
                setLeavesData((prevData) =>
                    prevData.map((leave) =>
                        leave._id === leaveId ? { ...leave, status: newStatus } : leave
                    )
                );
                console.log('Leave status updated:', res.data);
            })
            .catch((error) => {
                console.error('Error updating status:', error);
            });
    };

    const handleEditStatus = (leaveId, currentStatus) => {
        setEditStatus(leaveId); // Start editing status for this leave
        setNewStatus(currentStatus); // Set the current status as the selected status
    };

    const handleSaveStatus = (leaveId) => {
        if (newStatus !== null) {
            updateStatus(leaveId, newStatus);
        }
        setEditStatus(null); // Stop editing
    };

    const handleCancelEdit = () => {
        setEditStatus(null); // Cancel edit without saving
        setNewStatus(null); // Clear the new status
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
    }, []);

    return (
        <Layout>
            <div><p className='text-center mb-0 fs-3 fw-bold'>Employee Leaves</p></div>
            <div className='p-2'>
                <table className="table table-striped table-hover table-bordered">
                    <thead>
                        <tr>
                            <th>Sl.no</th>
                            <th>Name</th>
                            <th>Department</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Reason for Leave</th>
                            <th>From Date</th>
                            <th>To Date</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leavesData.map((le, index) => (
                            <tr key={le._id}>
                                <td>{index + 1}</td>
                                <td>{le.fname} {le.lname}</td>
                                <td>{le.dep}</td>
                                <td>{le.phone}</td>
                                <td>{le.email}</td>
                                <td>{le.reason}</td>
                                <td>{formatDate(le.formdate)}</td>
                                <td>{formatDate(le.todate)}</td>
                                <td>
                                    <div className='text-center'>
                                        {editStatus === le._id ? (
                                            // If status is being edited, show a select input
                                            <select
                                                value={newStatus}
                                                onChange={(e) => setNewStatus(Number(e.target.value))}
                                            >
                                                <option value={0}>Pending</option>
                                                <option value={1}>Rejected</option>
                                                <option value={2}>Approved</option>
                                            </select>
                                        ) : (
                                            // Display the current status as text
                                            <>
                                                {le.status === 0 && <span className="badge rounded-pill text-bg-warning">Pending</span>}
                                                {le.status === 1 && <span className="badge rounded-pill text-bg-danger">Rejected</span>}
                                                {le.status === 2 && <span className="badge rounded-pill text-bg-success">Approved</span>}
                                            </>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    {editStatus === le._id ? (
                                        // If editing, show Save and Cancel buttons
                                        <>
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => handleSaveStatus(le._id)}
                                            >
                                                <FontAwesomeIcon icon={faCheck} />
                                            </button>
                                            <button
                                                className="btn btn-secondary btn-sm ms-2"
                                                onClick={handleCancelEdit}
                                            >
                                                <FontAwesomeIcon icon={faXmark} />
                                            </button>
                                        </>
                                    ) : (
                                        // Display the Edit button
                                        <button
                                            className="btn btn-warning btn-sm"
                                            onClick={() => handleEditStatus(le._id, le.status)}
                                        >
                                                <FontAwesomeIcon icon={faPenToSquare} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
};

export default EmpLeave;
