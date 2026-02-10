"use client";

/**
 * Sidebar — terminal file-tree aesthetic.
 */
export default function Sidebar({
  user,
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
  onOpenProfile,
  onSignOut,
}) {
  const displayName = user?.user_metadata?.display_name || user?.email;
  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-title">sessions/</span>
        <button className="sidebar-new-button" onClick={onNew} title="Nouvelle session">
          [+]
        </button>
      </div>

      <div className="sidebar-conversations">
        {conversations.length === 0 ? (
          <p className="sidebar-empty">-- empty --</p>
        ) : (
          conversations.map((conv, index) => (
            <div
              key={conv.id}
              className={`sidebar-conversation ${conv.id === activeId ? "sidebar-conversation-active" : ""}`}
              onClick={() => onSelect(conv.id)}
            >
              <div className="sidebar-conversation-info">
                <span className="sidebar-conversation-index">{String(index).padStart(2, "0")}</span>
                <span className="sidebar-conversation-title">{conv.title}</span>
              </div>
              <button
                className="sidebar-delete-button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(conv.id);
                }}
                title="rm"
              >
                rm
              </button>
            </div>
          ))
        )}
      </div>

      <div className="sidebar-footer">
        <button className="sidebar-user-button" onClick={onOpenProfile}>
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="sidebar-avatar" />
          ) : (
            <span className="sidebar-avatar-fallback">
              {displayName.charAt(0).toUpperCase()}
            </span>
          )}
          <span className="sidebar-user-name">{displayName}</span>
        </button>
        <button className="sidebar-signout-button" onClick={onSignOut} title="exit">
          exit
        </button>
      </div>
    </aside>
  );
}
