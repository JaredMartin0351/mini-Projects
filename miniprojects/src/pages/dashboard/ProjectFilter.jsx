const filterList = [
    'all',
    'completed',
    'mine',
    'development',
    'design',
    'marketing',
    'sales',
  ];
  
  export default function ProjectFilter({ currentFilter, changeFilter }) {
    const handleClick = (newFilter) => {
      changeFilter(newFilter);
    };
  
    return (
      <div className="project-filter">
        <nav>
          <p>Filter by:</p>
          {filterList.map((filter) => (
            <button
              key={filter}
              onClick={() => handleClick(filter)}
              className={currentFilter === filter ? 'active' : ''}>
              {filter}
            </button>
          ))}
        </nav>
      </div>
    );
  }
  