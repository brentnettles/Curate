<div className="collections-page">
<h1>Collections</h1>
<button onClick={() => setShowScavengerHunt(!showScavengerHunt)}>
    {showScavengerHunt ? 'Hide Scavenger Hunt' : 'Show Scavenger Hunt'}
</button>
<button onClick={() => setShowManageCollections(!showManageCollections)}>
    {showManageCollections ? 'Hide Manage Collections' : 'Manage Collections'}
</button>

{showScavengerHunt && <ScavengerHunt />}
{showManageCollections && <ManageCollections onClose={() => setShowManageCollections(false)} />}

<ul className="collections-selector">
    <li onClick={() => handleSelectCollection('All')}
        className={selectedCollection === 'All' ? 'active' : ''}>
        All Artworks
    </li>
    {collections.map(col => (
        <li key={col.id} className={selectedCollection === col.name ? 'active' : ''}>
            <span onClick={() => handleSelectCollection(col.name)}>{col.name}</span>
            <button onClick={() => handleDeleteCollection(col.id)}>🗑️</button>
        </li>
    ))}
</ul>