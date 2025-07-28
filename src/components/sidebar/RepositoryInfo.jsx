import "./ReposirotyInfo.css"

export default function RepositoryInfo({ repositories, activeRepoId, onRepoClick }) {
    return (
        <div className="menu">
            {repositories.map((repo) => (
                <a
                    key={repo.id}
                    onClick={() => onRepoClick(repo.id)}
                    className={`menu-item ${activeRepoId === repo.id ? "active" : ""}`}
                >
                    {repo.name}
                </a>
            ))}
        </div>
    );
}