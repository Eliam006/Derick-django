import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';

const EditUserModal = ({ user, show, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        control_number: '',
        age: '',
        tel: ''
    });

    // Cargar datos del usuario cuando el modal se abre
    useEffect(() => {
        if (user && show) {
            setFormData({
                name: user.name || '',
                surname: user.surname || '',
                email: user.email || '',
                control_number: user.control_number || '',
                age: user.age || '',
                tel: user.tel || ''
            });
        }
    }, [user, show]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (window.confirm('¿Estás seguro que deseas actualizar este usuario?')) {
            try {
                const response = await axios.put(
                    `http://127.0.0.1:8000/users/api/${user.id}/`,
                    formData,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                        }
                    }
                );

                toast.success('Usuario actualizado correctamente');
                onUpdate(response.data);
                onClose();
            } catch (error) {
                console.error('Error al actualizar usuario:', error);
                toast.error(`Error al actualizar usuario: ${error.response?.data?.detail || error.message}`);
            }
        }
    };

    if (!show) return null;

    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Editar Usuario</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label className="form-label">Nombre</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Apellido</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="surname"
                                        value={formData.surname}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        disabled
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Número de control</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="control_number"
                                        value={formData.control_number}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label className="form-label">Edad</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        required
                                        min="1"
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Teléfono</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        name="tel"
                                        value={formData.tel}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={onClose}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Guardar Cambios
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditUserModal;