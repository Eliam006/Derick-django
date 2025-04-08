import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { toast } from 'react-toastify'; // Para mostrar mensajes bonitos
import 'react-toastify/dist/ReactToastify.css';
import EditUserModal from "./EditUserModal";

const UserDataTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  // Estado para el ID del usuario actual
  const [currentUserId, setCurrentUserId] = useState(null);
  // Para editar usuario
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Configurar axios y obtener ID del usuario actual
  useEffect(() => {
    // Obtener el ID del usuario del token
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(payload.user_id); // Asegúrate de que el token incluya user_id
      } catch (error) {
        console.error("Error al decodificar el token:", error);
      }
    }

    // Configurar interceptor para las peticiones
    axios.interceptors.request.use(config => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    }, error => {
      return Promise.reject(error);
    });
  }, []);

  const handleDelete = (userId, userName) => {
    // Verificar si el usuario intenta borrarse a sí mismo
    if (userId === currentUserId) {
      toast.error("No puedes eliminarte a ti mismo");
      return;
    }

    // Mostrar confirmación
    if (window.confirm(`¿Estás seguro de que deseas eliminar al usuario ${userName}?`)) {
      setLoading(true);
      axios.delete(`http://127.0.0.1:8000/users/api/${userId}/`)
        .then(response => {
          setData(data.filter(user => user.id !== userId));
          toast.success(`Usuario ${userName} eliminado correctamente`);
        })
        .catch(error => {
          console.error("Error al eliminar el usuario:", error);
          toast.error(`Error al eliminar el usuario: ${error.response?.data?.detail || error.message}`);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  const handleUpdateSuccess = (updatedUser) => {
    setData(data.map(user =>
      user.id === updatedUser.id ? updatedUser : user
    ));
  };

  // Configuración de columnas
  const columns = [
    {
      name: "Nombre",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Teléfono",
      selector: (row) => row.tel,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <span>
          <button
            className="btn btn-warning me-4"
            onClick={() => handleEdit(row)}
          >
            <i className="bi bi-pencil"></i>
          </button>
          <button
            className="btn btn-danger me-4"
            onClick={() => handleDelete(row.id, row.name)}
            disabled={row.id === currentUserId}
            title={row.id === currentUserId ? "No puedes eliminarte a ti mismo" : ""}
          >
            <i className="bi bi-trash"></i>
          </button>
        </span>
      ),
    },
  ];

  // Obtener datos desde la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/users/api/");
        setData(response.data);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        toast.error(`Error al cargar usuarios: ${error.response?.data?.detail || error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h3>Tabla de usuarios</h3>
      <DataTable
        columns={columns}
        data={data}
        progressPending={loading}
        pagination
        highlightOnHover
        pointerOnHover
      />

      {showEditModal && (
        <EditUserModal
          user={editingUser}
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default UserDataTable;