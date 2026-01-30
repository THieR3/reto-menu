// Attendre que le document soit chargé
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const platId = params.get('id');

    // Vérifier si on est sur la page d'accueil ou de détail
    if (document.getElementById('menu-container')) {
        initAccueil();
    } else if (platId) {
        initDetail(platId);
    }
});

// --- FONCTION PAGE ACCUEIL ---
async function initAccueil() {
    const container = document.getElementById('menu-container');
    try {
        const response = await fetch('menu.json');
        const menuData = await response.json();

        // Fonction pour filtrer et afficher
        window.filterMenu = (categorie, bouton) => {
            // Gérer l'apparence des boutons
            document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
            bouton.classList.add('active');

            // Filtrer les données
            const filtered = menuData.filter(item => item.categorie === categorie);

            // Générer le HTML
            container.innerHTML = filtered.map(item => `
                <a href="detail-plat.html?id=${item.id}" class="card">
                    <div class="card-img-placeholder">3D</div>
                    <div class="info">
                        <div style="display:flex; justify-content:space-between">
                            <strong>${item.nom}</strong>
                            <span style="color:#e67e22">${item.prix}</span>
                        </div>
                        <p style="font-size:12px; color:gray; margin:5px 0 0 0">${item.desc}</p>
                    </div>
                </a>
            `).join('');
        };

        // Afficher les entrées par défaut au démarrage
        filterMenu('Entrée', document.querySelector('.cat-btn.active'));

    } catch (error) {
        console.error("Erreur de chargement du JSON :", error);
    }
}

// --- FONCTION PAGE DÉTAIL ---
async function initDetail(id) {
    try {
        const response = await fetch('menu.json');
        const menuData = await response.json();
        const plat = menuData.find(p => p.id === id);

        if (!plat) return;

        // Remplissage des textes
        document.getElementById('title').innerText = plat.nom;
        document.getElementById('price').innerText = plat.prix;
        document.getElementById('description').innerText = plat.desc;
        
        // Chargement du modèle 3D
        const viewer = document.getElementById('viewer');
        viewer.src = plat.modele3D;

        // Génération des avis avec étoiles
        const revContainer = document.getElementById('reviews-container');
        if (plat.avis && plat.avis.length > 0) {
            revContainer.innerHTML = plat.avis.map(a => `
                <div class="review">
                    <div style="display:flex; justify-content:space-between">
                        <strong>${a.u}</strong>
                        <span style="color:#f1c40f">${"★".repeat(a.n)}${"☆".repeat(5-a.n)}</span>
                    </div>
                    <p style="margin:5px 0 0 0; font-size:14px; color:#444;">${a.t}</p>
                </div>
            `).join('');
        } else {
            revContainer.innerHTML = "<p style='color:gray'>Aucun avis pour le moment.</p>";
        }

    } catch (error) {
        console.error("Erreur page détail :", error);
    }
}