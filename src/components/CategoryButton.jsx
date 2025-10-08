const CategoryButton = ({ category, onClick, isActive }) => {
    return (
        <button
            onClick={() => onClick(category)}
            className={`category-button ${isActive ? 'active' : 'inactive'}`}
        >
            {category}
        </button>
    )
}

export default CategoryButton;