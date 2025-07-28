import "./UserInfo.css"
ß
export default function UserInfo({ user }) {
    return (
        <div className="profile">
            <img src={user.avatar} alt="avatar" className="avatar" />
            <div className="user-info">
                <strong>{user.name}</strong>
                <div className="email">{user.email}</div>
            </div>
        </div>
    );
}