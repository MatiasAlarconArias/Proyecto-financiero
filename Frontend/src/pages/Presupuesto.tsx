import { useEffect, useState } from 'react';
import './Presupuesto.css';
import NavBar from '../Componentes/navBar/navBar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Edit2, Trash2 } from 'lucide-react';

interface Category {
    _id: string;
    name: string;
    type: string;
}

interface Budget {
    _id: string; // Added ID for key and actions
    categoryId: Category;
    amount: number;
    spent: number;
    period: string; // Added period
    status: string; // Added status
}

export default function Presupuesto() {
    // Estado para almacenar la lista de presupuestos traídos del backend
    const [budgets, setBudgets] = useState<Budget[]>([]);
    // Estado para controlar la visualización de carga mientras se obtienen los datos
    const [loading, setLoading] = useState(true);
    
    // Estados para el modal y formulario
    const [showModal, setShowModal] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [newBudget, setNewBudget] = useState({
        categoryId: '',
        amount: '',
        period: 'Mensual'
    });
    // Estado para saber si estamos editando un presupuesto (contiene el ID del presupuesto a editar)
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        // Función asíncrona para obtener los presupuestos de la API
        const fetchBudgets = async () => {
            try {
                // Realizar la petición GET al endpoint de presupuestos
                const response = await fetch('/api/budgets'); 
                // Si la respuesta no es exitosa, lanzar un error
                if (!response.ok) throw new Error('Error al cargar presupuestos');
                // Convertir la respuesta a formato JSON
                const data = await response.json();
                // Actualizar el estado con los datos obtenidos
                setBudgets(data);
            } catch (error) {
                // Registrar cualquier error en la consola
                console.error(error);
            } finally {
                // Finalizar el estado de carga, haya éxito o error
                setLoading(false);
            }
        };

        // Fetch categories for the dropdown
        const fetchCategories = async () => {
             try {
                const response = await fetch('/api/categories');
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        // Ejecutar la función de carga inicial
        fetchBudgets();
        fetchCategories();
    }, []); // Array de dependencias vacío para ejecutar solo al montar el componente

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setNewBudget({ ...newBudget, [e.target.name]: e.target.value });
    };

    const handleSaveBudget = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const method = editingId ? 'PUT' : 'POST';
            const url = editingId ? `/api/budgets/${editingId}` : '/api/budgets';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newBudget),
            });

            if (response.ok) {
                const savedBudget = await response.json();
                
                if (editingId) {
                    // Actualizar el presupuesto existente en la lista
                    setBudgets(budgets.map(b => b._id === editingId ? savedBudget : b));
                } else {
                    // Agregar el nuevo presupuesto a la lista
                    setBudgets([...budgets, savedBudget]);
                }
                
                setShowModal(false);
                setNewBudget({ categoryId: '', amount: '', period: 'Mensual' }); // Reset form
                setEditingId(null); // Reset editing state
            } else {
                alert('Error al guardar presupuesto');
            }
        } catch (error) {
            console.error('Error saving budget:', error);
        }
    };

    const handleEdit = (budget: Budget) => {
        setEditingId(budget._id);
        setNewBudget({
            categoryId: budget.categoryId._id,
            amount: budget.amount.toString(),
            period: budget.period
        });
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('¿Estás seguro de eliminar este presupuesto?')) return;
        
        try {
            const response = await fetch(`/api/budgets/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setBudgets(budgets.filter(b => b._id !== id));
            } else {
                alert('Error al eliminar presupuesto');
            }
        } catch (error) {
            console.error('Error deleting budget:', error);
        }
    };

    const openNewBudgetModal = () => {
        setEditingId(null);
        setNewBudget({ categoryId: '', amount: '', period: 'Mensual' });
        setShowModal(true);
    };

    // Mostrar un mensaje de carga si los datos aún no están listos
    if (loading) return <div className="Container">Cargando...</div>;

    // Calcular la suma total de todos los montos presupuestados
    const totalAmount = budgets.reduce((acc, curr) => acc + curr.amount, 0);
    // Calcular la suma total de lo que se ha gastado en todos los presupuestos
    const totalSpent = budgets.reduce((acc, curr) => acc + curr.spent, 0);
    // Calcular el monto disponible restando lo gastado al total presupuestado
    const totalAvailable = totalAmount - totalSpent;
    // Contar el número de presupuestos donde el gasto supera el monto asignado
    const exceededCount = budgets.filter(b => b.spent > b.amount).length;

    // Función auxiliar para formatear montos a moneda chilena (CLP)
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
    };

    // Calcular el porcentaje gastado del total; retorna '0.0' si el total es 0 para evitar divisiones por cero
    const spentPercentage = totalAmount > 0 ? ((totalSpent / totalAmount) * 100).toFixed(1) : '0.0';

    // Preparar datos para el gráfico
    const chartData = budgets.map(b => ({
        name: b.categoryId?.name || 'Sin Categoría', // Usar nombre de la categoría o fallback
        Presupuesto: b.amount,
        Gasto: b.spent
    }));

    return (
        <>
            <NavBar />

            <div className="Container">
                <div className="Budget-Summary">
                    <div className="Budget-Card">
                        <h3>Presupuesto Total</h3>
                        <p className="Amount Blue">{formatCurrency(totalAmount)}</p>
                    </div>

                    <div className="Budget-Card">
                        <h3>Gastado</h3>
                        <p className="Amount Red">{formatCurrency(totalSpent)}</p>
                        <span className="Subtext">{spentPercentage}% del total</span>
                    </div>

                    <div className="Budget-Card">
                        <h3>Disponible</h3>
                        <p className="Amount Green">{formatCurrency(totalAvailable)}</p>
                    </div>

                    <div className="Budget-Card">
                        <div className="Exceeded-Header">
                            <span className="Warning-Icon">⚠️</span>
                            <h3>Excedidos</h3>
                        </div>
                        <p className="Amount Warning">{exceededCount}</p>
                        <span className="Subtext">de {budgets.length} presupuestos</span>
                    </div>
                </div>

                <div className="Chart-Container">
                    <h3>📈 Presupuesto vs Gasto por Categoría</h3>
                    <div style={{ width: '100%', height: 400 }}>
                        <ResponsiveContainer>
                            <BarChart
                                data={chartData}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip formatter={(value: number | undefined) => [value !== undefined ? formatCurrency(value) : '$0', "Monto"]} />
                                <Legend />
                                <Bar dataKey="Presupuesto" fill="#4285F4" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Gasto" fill="#EA4335" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="Budget-Header-Section">
                    <h2>Mis Presupuestos</h2>
                    <button className="Btn-New-Budget" onClick={openNewBudgetModal}>+ Nuevo Presupuesto</button>
                </div>

                <div className="Budget-List">
                    {budgets.map((budget) => {
                         const percentage = budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0;
                         const remaining = budget.amount - budget.spent;
                         const isExceeded = budget.spent > budget.amount;

                         return (
                            <div key={budget._id} className="Budget-Item-Card">
                                <div className="Budget-Item-Header">
                                    <div>
                                        <h4>{budget.categoryId?.name}</h4>
                                        <span className="Period-Label">Período: {budget.period}</span>
                                    </div>
                                    <span className={`Status-Label ${isExceeded ? 'Exceeded' : 'Good'}`}>
                                        {isExceeded ? 'Excedido' : 'En buen camino'}
                                    </span>
                                </div>

                                <div className="Budget-Item-Stats">
                                    <span>Gastado: {formatCurrency(budget.spent)}</span>
                                    <span>Presupuesto: {formatCurrency(budget.amount)}</span>
                                </div>

                                <div className="Progress-Bar-Container">
                                    <div 
                                        className="Progress-Bar-Fill" 
                                        style={{ 
                                            width: `${Math.min(percentage, 100)}%`,
                                            backgroundColor: isExceeded ? '#EA4335' : '#080C18'
                                        }}
                                    ></div>
                                </div>

                                <div className="Budget-Item-Footer">
                                    <span className="Percentage">{percentage.toFixed(1)}% utilizado</span>
                                    <span className={`Remaining ${remaining < 0 ? 'Negative' : ''}`}>
                                        {formatCurrency(remaining)} restante
                                    </span>
                                </div>

                                <div className="Budget-Actions">
                                    <button className="Btn-Action Edit" onClick={() => handleEdit(budget)}><Edit2 size={16} /> Editar</button>
                                    <button className="Btn-Action Delete" onClick={() => handleDelete(budget._id)}><Trash2 size={16} /> Eliminar</button>
                                </div>
                            </div>
                         );
                    })}
                </div>

                {showModal && (
                    <div className="Modal-Overlay">
                        <div className="Modal-Content">
                            <h3>{editingId ? 'Editar Presupuesto' : 'Nuevo Presupuesto'}</h3>
                            <form onSubmit={handleSaveBudget}>
                                <div className="Form-Group">
                                    <label>Categoría</label>
                                    <select 
                                        name="categoryId" 
                                        value={newBudget.categoryId} 
                                        onChange={handleInputChange} 
                                        required
                                    >
                                        <option value="">Selecciona una categoría</option>
                                        {categories.map(cat => (
                                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="Form-Group">
                                    <label>Monto</label>
                                    <input 
                                        type="number" 
                                        name="amount" 
                                        value={newBudget.amount} 
                                        onChange={handleInputChange} 
                                        required 
                                        min="0"
                                    />
                                </div>
                                <div className="Form-Group">
                                    <label>Período</label>
                                    <select 
                                        name="period" 
                                        value={newBudget.period} 
                                        onChange={handleInputChange}
                                    >
                                        <option value="Mensual">Mensual</option>
                                        <option value="Anual">Anual</option>
                                    </select>
                                </div>
                                <div className="Modal-Actions">
                                    <button type="button" className="Btn-Cancel" onClick={() => setShowModal(false)}>Cancelar</button>
                                    <button type="submit" className="Btn-Submit">{editingId ? 'Guardar Cambios' : 'Crear Presupuesto'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}