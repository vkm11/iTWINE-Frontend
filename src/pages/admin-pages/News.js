
import React, { useState, useCallback, useEffect } from 'react';
import Layout from '../../components/AdminLayouts/Layout';

const News = () => {
    const [newsForm, setNewsForm] = useState({
        date: '',
        news: '',
        status: "1"
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewsForm({
            ...newsForm,
            [name]: value,
        });
        // Clear error for the field if it's corrected
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '', // Clear the error for the specific field being changed
        }));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Form submitted:', newsForm);
            setErrors({});
            setTouched({});
            setIsFormValid(false);
        }
    };

    // Handle blur (focus out) event
    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched((prevTouched) => ({
            ...prevTouched,
            [name]: true, // Mark the field as touched
        }));
    };

    // Form validation logic
    const validateForm = useCallback(() => {
        const validationErrors = {};

        if (!newsForm.date) {
            validationErrors.date = 'Date is required.';
        }

        if (!newsForm.news) {
            validationErrors.news = 'News is required.';
        }

        if (touched.status && !newsForm.status) {
            validationErrors.status = 'Status is required.';
        }

        setErrors(validationErrors);

        return Object.keys(validationErrors).length === 0; // Form is valid if no errors
    }, [newsForm, touched]);

    // Update form validity on every change
    useEffect(() => {
        setIsFormValid(validateForm());
    }, [newsForm, validateForm]);

    return (
        <>
            <Layout>
                <div className='container-fluid'>
                    <div className='card mt-2'>
                        <div className='text-center card-header'>
                            <div className='d-flex justify-content-between align-items-center'>
                                <p className='mb-0 fw-bold '>Latest News</p>
                                <button className='btn btn-primary'>Add</button>
                            </div>
                        </div>
                        <div className='card-body'>
                            <form>
                                <div className='row mx-0'>
                                    <div className='col-sm-3'>
                                        <label className='form-label' htmlFor='date'>Select Date</label>
                                        <input
                                            type="date"
                                            id='date'
                                            className='form-control'
                                            placeholder='Select date'
                                            name='date'
                                            value={newsForm.date}
                                            onChange={handleInputChange}
                                            onBlur={handleBlur}
                                            required
                                        />
                                        {touched.date && errors.date && <div className="text-danger">{errors.date}</div>}
                                    </div>
                                    <div className='col-sm-3'>
                                        <label className='form-label' htmlFor='news'>News</label>
                                        <textarea
                                            id='news'
                                            className='form-control'
                                            placeholder='Enter news'
                                            name='news'
                                            value={newsForm.news}
                                            onChange={handleInputChange}
                                            onBlur={handleBlur}
                                            required
                                        />
                                        {touched.news && errors.news && <div className="text-danger">{errors.news}</div>}
                                    </div>
                                    <div className='col-sm-3'>
                                        <label className='form-label' htmlFor='status'>Status</label>
                                        <select
                                            id='status'
                                            className='form-control'
                                            name="status"
                                            value={newsForm.status}
                                            onChange={handleInputChange}
                                            onBlur={handleBlur}
                                        >
                                            <option value="" disabled>Select Status</option>
                                            <option value="0">In-active</option>
                                            <option value="1">Active</option>
                                        </select>
                                        {touched.status && errors.status && <div className="text-danger">{errors.status}</div>}

                                    </div>
                                </div>
                                <div className='text-end'>
                                    <button
                                        className='btn btn-primary'
                                        type="submit"
                                        onClick={handleSubmit}
                                        disabled={!isFormValid}>Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default News;

