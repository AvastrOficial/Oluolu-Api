 // Elementos de las vistas
        const views = {
            main: document.getElementById("view-main"),
            olvery: document.getElementById("view-olvery"),
            settings: document.getElementById("view-settings")
        };

        // Elementos de navegación
        const historyBtn = document.getElementById("history-btn");
        const profileBtn = document.getElementById("profile-btn");
        const backFromOlveryBtn = document.getElementById("back-from-olvery");
        const backFromSettingsBtn = document.getElementById("back-from-settings");

        // Elementos principales
        const container = document.getElementById("blog-container");
        const loadMoreBtn = document.getElementById("load-more");
        const refreshBtn = document.getElementById("refresh-btn");
        const viewAllBtn = document.getElementById("view-all");
        const viewImagesBtn = document.getElementById("view-images");
        const viewVideosBtn = document.getElementById("view-videos");
        const clearCacheBtn = document.getElementById("clear-cache");
        const clearHistoryBtn = document.getElementById("clear-history");
        const updateNotification = document.getElementById("update-notification");
        const showNewContentBtn = document.getElementById("show-new-content");
        const olveryContainer = document.getElementById("olvery-container");
        const settingsClearCacheBtn = document.getElementById("settings-clear-cache");
        const settingsClearHistoryBtn = document.getElementById("settings-clear-history");

        // URLs para diferentes tipos de contenido
        const baseUrlAll = "https://api2.oluolu.io/f/v1/blogs?type=recommend&size=30";
        const baseUrlVideos = "https://api2.oluolu.io/f/v1/blogs?type=recommend&rcmdBlogLabel=video&size=30";
        const baseUrlImages = "https://api2.oluolu.io/f/v1/blogs?type=recommend&rcmdBlogLabel=image&size=30";
        const baseUrlMusic = "https://api2.oluolu.io/f/v1/blogs?type=recommend&rcmdBlogLabel=music&size=30";
        
        let nextPageToken = null;
        let currentFilter = 'all';
        let cachedPosts = [];
        let newPostsAvailable = false;
        let loadedPostIds = new Set(); // Para evitar duplicados

        // Headers completos como solicitaste
        const apiHeaders = {
            "Accept-Language": "es-MX,es;q=0.9,es-419;q=0.8,en-US;q=0.7,en;q=0.6,es-US;q=0.5",
            "appplatform": "3",
            "apptype": "OluOluApp",
            "appversion": "0.0.1",
            "connection": "keep-alive",
            "contentlanguages": "es",
            "contentregion": "5",
            "countrycode": "US"
        };

        // Función para crear proxy URL - método alternativo
        function createProxyUrl(targetUrl) {
            // Intentamos diferentes métodos de proxy
            const proxies = [
                `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`,
                `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`,
                `https://cors-anywhere.herokuapp.com/${targetUrl}`,
                targetUrl // Intentar directo como última opción
            ];
            return proxies;
        }

        // Datos de ejemplo para cuando la API falle
        const samplePosts = [
            {
                id: "1",
                title: "Hermoso paisaje montañoso",
                content: "Un increíble paisaje de montañas al atardecer en los Andes.",
                mediaList: [{
                    resourceList: [{
                        type: "image",
                        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                    }]
                }],
                author: {
                    nickname: "AventureroMX",
                    uid: "123456789"
                }
            }
        ];

        // Inicializar almacenamiento local
        function initializeStorage() {
            if (!localStorage.getItem('cloverspace_cache')) {
                localStorage.setItem('cloverspace_cache', JSON.stringify([]));
            }
            if (!localStorage.getItem('cloverspace_history')) {
                localStorage.setItem('cloverspace_history', JSON.stringify([]));
            }
            if (!localStorage.getItem('cloverspace_last_update')) {
                localStorage.setItem('cloverspace_last_update', new Date().toISOString());
            }
        }

        // Guardar posts en caché
        function saveToCache(posts) {
            const existingCache = JSON.parse(localStorage.getItem('cloverspace_cache') || '[]');
            const newPosts = posts.filter(newPost => 
                !existingCache.some(cachedPost => cachedPost.id === newPost.id)
            );
            
            const updatedCache = [...existingCache, ...newPosts];
            localStorage.setItem('cloverspace_cache', JSON.stringify(updatedCache));
            return updatedCache;
        }

        // Cargar desde caché
        function loadFromCache() {
            const cache = JSON.parse(localStorage.getItem('cloverspace_cache') || '[]');
            return cache.length > 0 ? cache : samplePosts;
        }

        // Función para cambiar de vista
        function switchView(targetView) {
            // Ocultar todas las vistas
            Object.values(views).forEach(view => {
                view.classList.remove('active');
            });
            
            // Mostrar la vista objetivo
            views[targetView].classList.add('active');
            
            // Si estamos cambiando a Olvery, cargar el historial
            if (targetView === 'olvery') {
                loadOlveryContent();
            }
        }

        // Función para cargar contenido en Olvery
        function loadOlveryContent() {
            olveryContainer.innerHTML = '';
            
            // Obtener historial de visualizaciones
            const history = JSON.parse(localStorage.getItem('cloverspace_history') || '[]');
            
            if (history.length === 0) {
                olveryContainer.innerHTML = '<p style="text-align: center; padding: 40px; color: var(--light-text);">No hay historial de visualizaciones</p>';
                return;
            }
            
            // Mostrar las últimas 20 visualizaciones
            const recentHistory = history.slice(-20).reverse();
            
            recentHistory.forEach(item => {
                const card = document.createElement("div");
                card.className = "olvery-card";
                
                const mediaHTML = item.mediaUrl ? 
                    `<img src="${item.mediaUrl}" alt="${item.title}" loading="lazy">` :
                    `<div class="image-placeholder">Sin imagen</div>`;
                
                // Obtener iniciales para el avatar
                const initials = item.author.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
                
                card.innerHTML = `
                    ${mediaHTML}
                    <div class="olvery-card-content">
                        <h3>${item.title || "Sin título"}</h3>
                        <p>${item.content || "Sin descripción"}</p>
                        <div class="olvery-profile">
                            <div class="author-avatar">${initials}</div>
                            <span>${item.author}</span>
                        </div>
                    </div>
                `;
                
                olveryContainer.appendChild(card);
            });
        }

        // Función mejorada para cargar blogs
        async function loadBlogs(useCache = true) {
            // Mostrar indicador de carga
            loadMoreBtn.disabled = true;
            loadMoreBtn.textContent = "Cargando...";
            container.innerHTML = '<div class="loading"></div>';

            // Intentar cargar desde caché primero si se solicita
            if (useCache) {
                const cachedPosts = loadFromCache();
                if (cachedPosts.length > 0) {
                    displayPosts(cachedPosts);
                    loadMoreBtn.disabled = false;
                    loadMoreBtn.textContent = "Cargar más";
                    return;
                }
            }

            try {
                // Seleccionar URL basada en el filtro actual
                let baseUrl;
                switch(currentFilter) {
                    case 'videos':
                        baseUrl = baseUrlVideos;
                        break;
                    case 'images':
                        baseUrl = baseUrlImages;
                        break;
                    default:
                        baseUrl = baseUrlAll;
                }
                
                let url = baseUrl;
                if (nextPageToken) {
                    url += `&pageToken=${encodeURIComponent(nextPageToken)}`;
                }

                // Intentar diferentes métodos de conexión
                let success = false;
                const proxyUrls = createProxyUrl(url);

                for (let proxyUrl of proxyUrls) {
                    try {
                        console.log('Intentando con proxy:', proxyUrl);
                        
                        const response = await fetch(proxyUrl, {
                            method: 'GET',
                            headers: proxyUrl.includes('corsproxy.io') || proxyUrl.includes('cors-anywhere') ? apiHeaders : {},
                            mode: 'cors'
                        });

                        if (!response.ok) {
                            console.log('Proxy falló, intentando siguiente...');
                            continue;
                        }

                        let data;
                        if (proxyUrl.includes('allorigins.win')) {
                            data = await response.json();
                            data = JSON.parse(data.contents);
                        } else {
                            data = await response.json();
                        }

                        const posts = data.list || [];
                        console.log('Posts recibidos:', posts.length);

                        if (posts.length === 0 && !nextPageToken) {
                            throw new Error('No se encontró contenido');
                        }

                        nextPageToken = data.pagination?.nextPageToken || null;
                        
                        // Procesar y mostrar posts
                        const postsWithIds = posts.map(post => ({
                            ...post,
                            id: post.id || `${post.title}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                            mediaType: post.mediaList?.[0]?.resourceList?.[0]?.type || post.mediaList?.[0]?.type || "image",
                            hasImage: !!(post.mediaList?.[0]?.resourceList?.[0]?.url || post.mediaList?.[0]?.baseUrl),
                            hasVideo: (post.mediaList?.[0]?.resourceList?.[0]?.type === 'video' || post.mediaList?.[0]?.type === 'video')
                        }));

                        saveToCache(postsWithIds);
                        displayPosts(postsWithIds);
                        
                        success = true;
                        break;

                    } catch (error) {
                        console.log('Error con proxy:', proxyUrl, error);
                        continue;
                    }
                }

                if (!success) {
                    throw new Error('Todos los métodos de conexión fallaron');
                }

                loadMoreBtn.disabled = !nextPageToken;
                loadMoreBtn.textContent = nextPageToken ? "Cargar más" : "No hay más contenido";

            } catch (error) {
                console.error("Error al cargar contenido:", error);
                
                // Mostrar datos de ejemplo
                const cachedPosts = loadFromCache();
                displayPosts(cachedPosts);
                
                // Mostrar mensaje de error informativo
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.innerHTML = `
                    <h3>⚠️ Problema de conexión</h3>
                    <p>No se pudo cargar contenido nuevo. Mostrando contenido almacenado.</p>
                    <p><small>Error: ${error.message}</small></p>
                    <button class="retry-button" onclick="loadBlogs(false)">Reintentar conexión</button>
                `;
                container.appendChild(errorDiv);
                
                loadMoreBtn.disabled = false;
                loadMoreBtn.textContent = "Reintentar carga";
            }
        }

        // Mostrar posts
        function displayPosts(posts) {
            // Si estamos cargando más contenido, no limpiar el contenedor
            if (nextPageToken) {
                // Filtrar posts para evitar duplicados
                const newPosts = posts.filter(post => !loadedPostIds.has(post.id));
                if (newPosts.length === 0) {
                    loadMoreBtn.disabled = true;
                    loadMoreBtn.textContent = "No hay más contenido";
                    return;
                }
                renderPosts(newPosts);
                return;
            }
            
            // Si es una carga nueva, limpiar el contenedor y el set de IDs
            container.innerHTML = '';
            loadedPostIds.clear();
            renderPosts(posts);
        }

        // Función auxiliar para renderizar posts
        function renderPosts(posts) {
            // Filtrar posts según el filtro actual
            let filteredPosts = posts.filter(post => {
                if (currentFilter === 'all') return true;
                if (currentFilter === 'images') return post.mediaType !== 'video' && post.hasImage;
                if (currentFilter === 'videos') return post.hasVideo;
                return true;
            });

            if (filteredPosts.length === 0) {
                container.innerHTML = '<p style="text-align: center; padding: 40px; color: var(--light-text);">No hay contenido disponible con este filtro</p>';
                return;
            }

            filteredPosts.forEach(post => {
                // Evitar duplicados
                if (loadedPostIds.has(post.id)) return;
                loadedPostIds.add(post.id);
                
                const title = post.title || "";
                const content = post.content || "";

                const media = post.mediaList?.[0];
                const mediaType = media?.resourceList?.[0]?.type || media?.type || "";
                const mediaUrl = media?.resourceList?.[0]?.url || media?.baseUrl || null;
                const posterUrl = media?.cover?.resourceList?.[0]?.url || "";

                const author = post.author || {};
                const nickname = author.nickname || "Desconocido";
                const uid = BigInt(author.uid || 0).toString();

                const card = document.createElement("div");
                card.className = "card";
                if (currentFilter === 'images') {
                    card.classList.add('image-only');
                } else if (currentFilter === 'videos') {
                    card.classList.add('video-only');
                }
                card.dataset.postId = post.id;

                // Guardar en historial al hacer clic
                card.addEventListener('click', () => {
                    addToHistory({
                        id: post.id,
                        title: title,
                        content: content,
                        mediaUrl: mediaUrl,
                        author: nickname
                    });
                });

                let mediaHTML = "";
                if (mediaUrl) {
                    if (mediaType === "video" || post.hasVideo) {
                        mediaHTML = `
                            <div class="card-media">
                                <div class="content-badge">VIDEO</div>
                                <video controls preload="metadata" ${posterUrl ? `poster="${posterUrl}"` : ""}>
                                    <source src="${mediaUrl}" type="video/mp4">
                                    Tu navegador no soporta videos.
                                </video>
                            </div>
                        `;
                    } else {
                        mediaHTML = `
                            <div class="card-media">
                                <div class="content-badge">IMAGEN</div>
                                <img src="${mediaUrl}" alt="${title}" loading="lazy">
                            </div>
                        `;
                    }
                } else {
                    mediaHTML = `
                        <div class="card-media">
                            <div class="image-placeholder">
                                Sin contenido multimedia
                            </div>
                        </div>
                    `;
                }

                const titleHTML = title ? `<h3>${title}</h3>` : "";
                const descHTML = content ? `<p>${content}</p>` : "";

                // Obtener iniciales para el avatar
                const initials = nickname.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

                const authorHTML = `
                    <div class="author">
                        <div class="author-info">
                            <div class="author-avatar">${initials}</div>
                            <span>${nickname}</span>
                        </div>
                        <div>
                            <button onclick="event.stopPropagation(); window.open('https://clover.social/user/${uid}', '_blank')">Ver perfil</button>
                        </div>
                    </div>
                `;

                card.innerHTML = `${mediaHTML}<div class="card-content">${titleHTML}${descHTML}${authorHTML}</div>`;
                container.appendChild(card);
            });
        }

        // Agregar al historial
        function addToHistory(post) {
            const history = JSON.parse(localStorage.getItem('cloverspace_history') || '[]');
            
            // Evitar duplicados en el historial
            const existingIndex = history.findIndex(item => item.id === post.id);
            if (existingIndex !== -1) {
                history.splice(existingIndex, 1);
            }
            
            // Agregar al historial
            history.push({
                ...post,
                viewedAt: new Date().toISOString()
            });
            
            // Mantener solo los últimos 50 elementos
            if (history.length > 50) {
                history.splice(0, history.length - 50);
            }
            
            localStorage.setItem('cloverspace_history', JSON.stringify(history));
        }

        // Filtrar contenido
        function filterContent(filter) {
            currentFilter = filter;
            
            // Actualizar botones activos
            viewAllBtn.classList.toggle('active', filter === 'all');
            viewImagesBtn.classList.toggle('active', filter === 'images');
            viewVideosBtn.classList.toggle('active', filter === 'videos');
            
            // Recargar posts con el filtro aplicado
            nextPageToken = null;
            loadBlogs(true);
        }

        // Inicializar la aplicación
        function init() {
            initializeStorage();
            loadBlogs(true);
            
            // Establecer vista activa
            switchView('main');
        }

        // Event Listeners
        loadMoreBtn.addEventListener("click", () => loadBlogs(false));
        refreshBtn.addEventListener("click", () => {
            newPostsAvailable = false;
            updateNotification.classList.remove('show');
            nextPageToken = null;
            loadBlogs(false);
        });
        
        viewAllBtn.addEventListener("click", () => filterContent('all'));
        viewImagesBtn.addEventListener("click", () => filterContent('images'));
        viewVideosBtn.addEventListener("click", () => filterContent('videos'));
        
        clearCacheBtn.addEventListener("click", () => {
            localStorage.setItem('cloverspace_cache', JSON.stringify([]));
            alert('Caché limpiado correctamente');
            container.innerHTML = '';
            loadBlogs(false);
        });
        
        clearHistoryBtn.addEventListener("click", () => {
            localStorage.setItem('cloverspace_history', JSON.stringify([]));
            alert('Historial limpiado correctamente');
        });
        
        showNewContentBtn.addEventListener("click", () => {
            updateNotification.classList.remove('show');
            newPostsAvailable = false;
            nextPageToken = null;
            loadBlogs(false);
        });

        // Navegación entre vistas
        historyBtn.addEventListener("click", (e) => {
            e.preventDefault();
            switchView('olvery');
        });
        
        profileBtn.addEventListener("click", (e) => {
            e.preventDefault();
            switchView('settings');
        });
        
        backFromOlveryBtn.addEventListener("click", (e) => {
            e.preventDefault();
            switchView('main');
        });
        
        backFromSettingsBtn.addEventListener("click", (e) => {
            e.preventDefault();
            switchView('main');
        });
        
        settingsClearCacheBtn.addEventListener("click", () => {
            localStorage.setItem('cloverspace_cache', JSON.stringify([]));
            alert('Caché limpiado correctamente');
        });
        
        settingsClearHistoryBtn.addEventListener("click", () => {
            localStorage.setItem('cloverspace_history', JSON.stringify([]));
            alert('Historial limpiado correctamente');
        });

        // Inicializar la aplicación
        init();
