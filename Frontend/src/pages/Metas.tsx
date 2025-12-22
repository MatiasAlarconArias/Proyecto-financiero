import { useState, useEffect } from 'react';
import './Metas.css';
import NavBar from '../Componentes/navBar/navBar';
import { Plus, Edit2, Trash2, DollarSign, Target } from 'lucide-react';

interface Goal {
    _id: string; // Updated to _id for MongoDB
    name: string; // Changed from title to name based on backend
    targetAmount: number;
    currentAmount: number;
    deadline: string;
    status: 'En progreso' | 'Completada' | 'Vencida'; // Updated status enum
    priority: 'Alta' | 'Media' | 'Baja';
}

interface User {
    id: string;
    _id?: string;
    username: string;
    email: string;
}

export default function Metas() {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        targetAmount: '',
        currentAmount: '',
        deadline: '',
        priority: 'Media',
        status: 'En progreso'
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            // Support both id and _id formats depending on how it was stored
            const userId = parsedUser.id || parsedUser._id;
            fetchGoals(userId);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchGoals = async (userId: string) => {
        try {
            const response = await fetch(`/api/savinggoals/user/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setGoals(data.data || []); 
            }
        } catch (error) {
            console.error('Error fetching goals:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const openNewGoalModal = () => {
        setEditingId(null);
        setFormData({
            name: '',
            targetAmount: '',
            currentAmount: '0',
            deadline: '',
            priority: 'Media',
            status: 'En progreso'
        });
        setShowModal(true);
    };

    const handleEdit = (goal: Goal) => {
        setEditingId(goal._id);
        setFormData({
            name: goal.name,
            targetAmount: goal.targetAmount.toString(),
            currentAmount: goal.currentAmount.toString(),
            deadline: goal.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : '',
            priority: goal.priority,
            status: goal.status
        });
        setShowModal(true);
    };

    const handleSaveGoal = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            const userId = user.id || user._id;
            const method = editingId ? 'PUT' : 'POST';
            const url = editingId ? `/api/savinggoals/${editingId}` : '/api/savinggoals';

            const payload = {
                ...formData,
                userId: userId,
                targetAmount: Number(formData.targetAmount),
                currentAmount: Number(formData.currentAmount)
            };

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const savedGoal = await response.json();
                // Refresh list or update local state
                fetchGoals(userId!);
                setShowModal(false);
            } else {
                alert('Error al guardar la meta');
            }
        } catch (error) {
            console.error('Error saving goal:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('¿Estás seguro de eliminar esta meta?')) return;
        if (!user) return;

        try {
            const response = await fetch(`/api/savinggoals/${id}`, { method: 'DELETE' });
            if (response.ok) {
                setGoals(goals.filter(goal => goal._id !== id));
            } else {
                alert('Error al eliminar la meta');
            }
        } catch (error) {
            console.error('Error deleting goal:', error);
        }
    };

    const handleAddFunds = async (id: string) => {
        const amount = prompt("Monto a agregar:");
        if (!amount || isNaN(Number(amount))) return;

        try {
            const response = await fetch(`/api/savinggoals/${id}/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: Number(amount) })
            });
            if (response.ok) {
                 const userId = user!.id || user!._id;
                 fetchGoals(userId!);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Derived calculations
    const totalObjective = goals.reduce((acc, goal) => acc + goal.targetAmount, 0);
    const totalSaved = goals.reduce((acc, goal) => acc + goal.currentAmount, 0);
    const totalRemaining = totalObjective - totalSaved;
    const completedGoals = goals.filter(g => g.currentAmount >= g.targetAmount).length;
    
    // Overall Progress
    const overallProgress = totalObjective > 0 ? (totalSaved / totalObjective) * 100 : 0;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
    };

    if (loading) return <div className="Container">Cargando metas...</div>;

    return (
        <>
            <NavBar />
            <div className="Container">
                {/* Summary Cards Section */}
                <div className="Goals-Summary">
                    <div className="Summary-Card">
                        <h3>Total Objetivo</h3>
                        <p className="Amount Blue">{formatCurrency(totalObjective)}</p>
                    </div>
                    <div className="Summary-Card">
                        <h3>Total Ahorrado</h3>
                        <p className="Amount Green">{formatCurrency(totalSaved)}</p>
                        <span className="Subtext">{overallProgress.toFixed(1)}% del objetivo</span>
                    </div>
                    <div className="Summary-Card">
                        <h3>Falta Ahorrar</h3>
                        <p className="Amount Orange">{formatCurrency(totalRemaining)}</p>
                    </div>
                    <div className="Summary-Card">
                        <h3>Metas Completadas</h3>
                        <p className="Amount Purple">{completedGoals}</p>
                        <span className="Subtext">de {goals.length} metas</span>
                    </div>
                </div>

                {/* General Progress Section */}
                <div className="General-Progress-Section">
                    <div className="Section-Header">
                        <Target className="Icon-Blue" size={20} />
                        <h3>Progreso General de Metas</h3>
                    </div>
                    <div className="Progress-Info">
                        <span>Progreso total: {overallProgress.toFixed(1)}%</span>
                        <span>{formatCurrency(totalSaved)} / {formatCurrency(totalObjective)}</span>
                    </div>
                    <div className="Big-Progress-Bar">
                        <div 
                            className="Big-Progress-Fill" 
                            style={{ width: `${Math.min(overallProgress, 100)}%` }}
                        ></div>
                    </div>
                </div>

                {/* Goals Header */}
                <div className="Goals-List-Header">
                    <h2>Mis Metas de Ahorro</h2>
                    <button className="Btn-New-Goal" onClick={openNewGoalModal}>
                        <Plus size={18} /> Nueva Meta
                    </button>
                </div>

                {/* Goals Grid */}
                <div className="Goals-Grid">
                    {goals.map(goal => {
                        const progress = (goal.currentAmount / goal.targetAmount) * 100;
                        const remaining = goal.targetAmount - goal.currentAmount;
                        
                        // Check if deadline is passed
                        const isOverdue = goal.deadline && new Date(goal.deadline) < new Date();
                        const isCompleted = goal.currentAmount >= goal.targetAmount;

                        return (
                            <div key={goal._id} className="Goal-Card">
                                <div className="Goal-Header">
                                    <div className="Goal-Title-Group">
                                        <Target className="Icon-Blue" size={20} />
                                        <div>
                                            <h3>{goal.name}</h3>
                                            <span className="Category-Label">Meta de Ahorro</span>
                                        </div>
                                    </div>
                                    <span className="Priority-Badge">{goal.priority}</span>
                                </div>

                                <div className="Goal-Financials">
                                    <span className="Current-Amount">{formatCurrency(goal.currentAmount)}</span>
                                    <span className="Target-Info">Meta: {formatCurrency(goal.targetAmount)}</span>
                                </div>

                                <div className="Goal-Progress-Container">
                                    <div className="Goal-Progress-Bar">
                                        <div 
                                            className="Goal-Progress-Fill" 
                                            style={{ 
                                                width: `${Math.min(progress, 100)}%`,
                                                backgroundColor: isCompleted ? '#0f9d58' : '#000'
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="Goal-Status-Row">
                                    <span className="Percentage-Text">{progress.toFixed(1)}% completado</span>
                                    <span className="Remaining-Text Orange">
                                        {remaining > 0 ? `${formatCurrency(remaining)} faltante` : 'Completado'}
                                    </span>
                                </div>

                                <div className="Goal-Date-Row">
                                    <span className="Date-Text">
                                        {goal.deadline ? `📅 ${new Date(goal.deadline).toLocaleDateString('es-CL')}` : 'Sin fecha'}
                                    </span>
                                    {isOverdue && !isCompleted && <span className="Status-Text Red">Vencido</span>}
                                    {isCompleted && <span className="Status-Text Green" style={{ color: '#0f9d58' }}>Completado</span>}
                                </div>

                                <div className="Goal-Actions">
                                    <button className="Btn-Add-Funds" onClick={() => handleAddFunds(goal._id)}>
                                        <DollarSign size={16} /> Agregar Fondos
                                    </button>
                                    <button className="Btn-Icon-Action" onClick={() => handleEdit(goal)}>
                                        <Edit2 size={16} /> Editar
                                    </button>
                                    <button 
                                        className="Btn-Icon-Action Delete" 
                                        onClick={() => handleDelete(goal._id)}
                                    >
                                        <Trash2 size={16} /> Eliminar
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Modal for New/Edit Goal */}
                {showModal && (
                    <div className="Modal-Overlay">
                        <div className="Modal-Content">
                            <h3>{editingId ? 'Editar Meta' : 'Nueva Meta'}</h3>
                            <form onSubmit={handleSaveGoal}>
                                <div className="Form-Group">
                                    <label>Nombre de la Meta</label>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        value={formData.name} 
                                        onChange={handleInputChange} 
                                        required 
                                        placeholder="Ej: Vacaciones"
                                    />
                                </div>
                                <div className="Form-Group">
                                    <label>Monto Objetivo ($)</label>
                                    <input 
                                        type="number" 
                                        name="targetAmount" 
                                        value={formData.targetAmount} 
                                        onChange={handleInputChange} 
                                        required 
                                        min="1"
                                    />
                                </div>
                                <div className="Form-Group">
                                    <label>Monto Actual ($)</label>
                                    <input 
                                        type="number" 
                                        name="currentAmount" 
                                        value={formData.currentAmount} 
                                        onChange={handleInputChange} 
                                        min="0"
                                    />
                                </div>
                                <div className="Form-Group">
                                    <label>Fecha Límite</label>
                                    <input 
                                        type="date" 
                                        name="deadline" 
                                        value={formData.deadline} 
                                        onChange={handleInputChange} 
                                    />
                                </div>
                                <div className="Form-Group">
                                    <label>Prioridad</label>
                                    <select name="priority" value={formData.priority || 'Media'} onChange={handleInputChange}>
                                        <option value="Alta">Alta</option>
                                        <option value="Media">Media</option>
                                        <option value="Baja">Baja</option>
                                    </select>
                                </div>
                                <div className="Modal-Actions">
                                    <button type="button" className="Btn-Cancel" onClick={() => setShowModal(false)}>Cancelar</button>
                                    <button type="submit" className="Btn-Submit">
                                        {editingId ? 'Guardar Cambios' : 'Crear Meta'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}