import { useEffect, useState } from 'react';
import './Categoria.css';
import NavBar from '../Componentes/navBar/navBar';
import { 
    ArrowUpCircle, ArrowDownCircle, Plus, Edit2, Trash2, 
    Briefcase, Monitor, TrendingUp, ShoppingCart, Home, Pizza, Car, Film, Zap, Heart, Book, ShoppingBag, 
    HelpCircle, Plane, DollarSign, Smartphone, Coffee, Camera, Music, Gift, Wrench
} from 'lucide-react';

interface Category {
    _id: string;
    name: string;
    type: 'Ingreso' | 'Gasto';
    icon?: string;
    color?: string;
}

interface CategoryStats {
    total: number;
    incomeCount: number;
    expenseCount: number;
}

const COLORS = [
    '#00C49F', // Jade
    '#2563EB', // Blue
    '#8B5CF6', // Purple
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#EC4899', // Pink
    '#06B6D4', // Cyan
    '#3B82F6', // Light Blue
    '#10B981', // Emerald
    '#6366F1', // Indigo
    '#F97316', // Orange
    '#A855F7', // Violet
];

const ICONS_MAP: { [key: string]: any } = {    'briefcase': Briefcase,
    'monitor': Monitor,
    'trending-up': TrendingUp,
    'shopping-cart': ShoppingCart,
    'home': Home,
    'pizza': Pizza,
    'car': Car,
    'film': Film,
    'zap': Zap,
    'heart': Heart,
    'book': Book,
    'shopping-bag': ShoppingBag,
    'plane': Plane,
    'dollar-sign': DollarSign,
    'smartphone': Smartphone,
    'coffee': Coffee,
    'camera': Camera,
    'music': Music,
    'gift': Gift,
    'tool': Wrench // Mapped 'tool' key to Wrench component
};

// Helper to render icon component dynamically
const renderIcon = (iconName: string, size = 24, color = "#555") => {
    const IconComponent = ICONS_MAP[iconName] || HelpCircle;
    return <IconComponent size={size} color={color} />;
};

export default function Categoria() {
    const [stats, setStats] = useState<CategoryStats>({ total: 0, incomeCount: 0, expenseCount: 0 });
    const [categories, setCategories] = useState<Category[]>([]);
    const [transactionCounts, setTransactionCounts] = useState<{[key: string]: number}>({});
    
    // Form State
    const [showForm, setShowForm] = useState(false);
    const [newCategory, setNewCategory] = useState({
        name: '',
        type: 'Gasto' as 'Ingreso' | 'Gasto',
        color: COLORS[0],
        icon: 'home'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const catResponse = await fetch('/api/categories');
            if (!catResponse.ok) throw new Error('Error fetching categories');
            const catData: Category[] = await catResponse.json();
            setCategories(catData);
            
            const incomeCount = catData.filter(cat => cat.type === 'Ingreso').length;
            const expenseCount = catData.filter(cat => cat.type === 'Gasto').length;
            
            setStats({
                total: catData.length,
                incomeCount,
                expenseCount
            });

            const transResponse = await fetch('/api/transactions');
            if (transResponse.ok) {
                const transData: any[] = await transResponse.json();
                const counts: {[key: string]: number} = {};
                transData.forEach((t) => {
                    const catId = typeof t.categoryId === 'object' && t.categoryId !== null 
                        ? t.categoryId._id 
                        : t.categoryId;
                    if (catId) counts[catId] = (counts[catId] || 0) + 1;
                });
                setTransactionCounts(counts);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCategory)
            });

            if (response.ok) {
                setShowForm(false);
                setNewCategory({ name: '', type: 'Gasto', color: COLORS[0], icon: 'home' });
                fetchData(); // Refresh list
            } else {
                alert('Error al crear categoría');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('¿Estás seguro de eliminar esta categoría?')) return;
        try {
            const response = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
            if (response.ok) {
                setCategories(categories.filter(c => c._id !== id));
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <NavBar />
            <div className="CategoryPage-Container">
                {/* Summary Cards */}
                <div className="CategoryPage-Cards-Grid Container">
                    <div className="CategoryPage-Summary-Card">
                        <h3>Total Categorías</h3>
                        <p className="CategoryPage-Card-Amount CategoryPage-Text-Blue">{stats.total}</p>
                    </div>

                    <div className="CategoryPage-Summary-Card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                            <ArrowUpCircle size={20} color="#32cd32" />
                            <h3 style={{ margin: 0 }}>Ingresos</h3>
                        </div>
                        <p className="CategoryPage-Card-Amount CategoryPage-Text-Green">{stats.incomeCount}</p>
                        <span className="CategoryPage-Card-Subtext">categorías de ingresos</span>
                    </div>

                    <div className="CategoryPage-Summary-Card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                            <ArrowDownCircle size={20} color="#ff4500" />
                            <h3 style={{ margin: 0 }}>Gastos</h3>
                        </div>
                        <p className="CategoryPage-Card-Amount CategoryPage-Text-Red">{stats.expenseCount}</p>
                        <span className="CategoryPage-Card-Subtext">categorías de gastos</span>
                    </div>
                </div>

                {/* Add Category Form Section */}
                {showForm && (
                     <div className="CategoryPage-Form-Container Container">
                        <h3>Agregar Nueva Categoría</h3>
                        <form onSubmit={handleCreateCategory}>
                            <div className="Form-Row">
                                <div className="Form-Group" style={{ flex: 2 }}>
                                    <label>Nombre de la Categoría</label>
                                    <input 
                                        type="text" 
                                        placeholder="Ej. Restaurantes" 
                                        value={newCategory.name}
                                        onChange={e => setNewCategory({...newCategory, name: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="Form-Group" style={{ flex: 1 }}>
                                    <label>Tipo</label>
                                    <select 
                                        value={newCategory.type} 
                                        onChange={e => setNewCategory({...newCategory, type: e.target.value as any})}
                                    >
                                        <option value="Gasto">Gasto</option>
                                        <option value="Ingreso">Ingreso</option>
                                    </select>
                                </div>
                            </div>

                            <div className="Form-Row">
                                <div className="Form-Group">
                                    <label>Color</label>
                                    <div className="Color-Picker">
                                        {COLORS.map(color => (
                                            <div 
                                                key={color} 
                                                className={`Color-Circle ${newCategory.color === color ? 'Selected' : ''}`}
                                                style={{ backgroundColor: color }}
                                                onClick={() => setNewCategory({...newCategory, color})}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="Form-Group">
                                    <label>Icono</label>
                                    <div className="Icon-Picker">
                                        {Object.keys(ICONS_MAP).map(iconName => (
                                            <div 
                                                key={iconName}
                                                className={`Icon-Item ${newCategory.icon === iconName ? 'Selected' : ''}`}
                                                onClick={() => setNewCategory({...newCategory, icon: iconName})}
                                            >
                                                {renderIcon(iconName, 18, "#555")}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="Form-Actions">
                                <button type="submit" className="Btn-Submit">Agregar Categoría</button>
                                <button type="button" className="Btn-Cancel" onClick={() => setShowForm(false)}>Cancelar</button>
                            </div>
                        </form>
                     </div>
                )}

                {/* Main Content: Header & Grid */}
                <div className="CategoryPage-Content Container">
                    <div className="CategoryPage-Header">
                        <div className="CategoryPage-Title-Section">
                            <h2>Categorías</h2>
                            <div className="CategoryPage-Filter">
                                <span>Todas</span>
                            </div>
                        </div>
                        <button className="CategoryPage-Btn-New" onClick={() => setShowForm(true)}>
                            <Plus size={16} /> Nueva Categoría
                        </button>
                    </div>

                    <div className="CategoryPage-List-Grid">
                        {categories.map((category) => (
                            <div key={category._id} className="CategoryPage-Item-Card">
                                <div className="CategoryPage-Item-Header">
                                    <div 
                                        className="CategoryPage-Icon-Wrapper" 
                                        style={{ backgroundColor: category.color ? `${category.color}20` : '#f5f5f5' }}
                                    >
                                        {renderIcon(category.icon || 'help-circle', 24, category.color || "#555")}
                                    </div>
                                    <div className="CategoryPage-Item-Info">
                                        <h4>{category.name}</h4>
                                        <span>{transactionCounts[category._id] || 0} transacciones</span>
                                    </div>
                                    <div className={`CategoryPage-Type-Badge ${category.type === 'Ingreso' ? 'Income' : 'Expense'}`}>
                                        {category.type === 'Ingreso' 
                                            ? <ArrowUpCircle size={14} /> 
                                            : <ArrowDownCircle size={14} />
                                        }
                                        {category.type}
                                    </div>
                                </div>
                                <div className="CategoryPage-Item-Actions">
                                    <button className="CategoryPage-Btn-Action Edit"><Edit2 size={14} /> Editar</button>
                                    <button className="CategoryPage-Btn-Action Delete" onClick={() => handleDelete(category._id)}><Trash2 size={14} /> Eliminar</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}