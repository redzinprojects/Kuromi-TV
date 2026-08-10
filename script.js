document.addEventListener('DOMContentLoaded', async () => {
            // ==========================================
            // ⚙️ CONFIGURAÇÃO CENTRALIZADA DA CRISÁLIDA
            // ==========================================
            const tvConfig = {
    enabled: true,
    baseUrl: "https://sinalpublicoetv.vercel.app",
                categorias: [
                    {
                        nome: "Canais Abertos",
                        canais: [
                            { id: "globorj", nome: "Globo RJ" },
                            { id: "globosp", nome: "Globo SP" },
                            { id: "globomg", nome: "Globo MG" },
                            { id: "globope", nome: "Globo PE" },
                            { id: "globopb", nome: "Globo PB" },
                            { id: "globors", nome: "Globo RS" },
                            { id: "globoes", nome: "Globo ES" },
                            { id: "globoam", nome: "Globo AM" },
                            { id: "globoce", nome: "Globo CE" },
                            { id: "sbt", nome: "SBT" },
                            { id: "sbtsp", nome: "SBT SP" },
                            { id: "sbtrj", nome: "SBT RJ" },
                            { id: "record", nome: "Record TV" },
                            { id: "band", nome: "Band" }
                        ]
                    },
                    {
                        nome: "Notícias",
                        canais: [
                            { id: "globonews", nome: "GloboNews" },
                            { id: "sbtnews", nome: "SBT NEWS" },
                            { id: "bandnews", nome: "BandNews" },
                            { id: "cnnbrasil", nome: "CNN Brasil" },
                            { id: "jovempan", nome: "Jovem Pan News" }
                        ]
                    },
                    {
                        nome: "Esportes",
                        canais: [
                            { id: "sportv", nome: "SporTV" },
                            { id: "sportv2", nome: "SporTV 2" },
                            { id: "sportv3", nome: "SporTV 3" },
                            { id: "espn", nome: "ESPN" },
                            { id: "espn2", nome: "ESPN 2" },
                            { id: "espn3", nome: "ESPN 3" },
                            { id: "espn4", nome: "ESPN 4" },
                            { id: "premiere", nome: "Premiere" },
                            { id: "combate", nome: "Combate" },
                            { id: "cazetv", nome: "Cazé TV" },
                            { id: "bandsports", nome: "Band Sports" }
                        ]
                    },
                    {
                        nome: "Filmes e Séries",
                        canais: [
                            { id: "telecine", nome: "Telecine" },
                            { id: "telecinepremium", nome: "Telecine Premium" },
                            { id: "telecinepipoca", nome: "Telecine Pipoca" },
                            { id: "telecineaction", nome: "Telecine Action" },
                            { id: "universal", nome: "Universal TV" },
                            { id: "studiouniversal", nome: "Studio Universal" },
                            { id: "megapix", nome: "Megapix" },
                            { id: "amc", nome: "AMC" },
                            { id: "paramount", nome: "Paramount Network" },
                            { id: "axn", nome: "AXN" },
                            { id: "syfy", nome: "Syfy" }
                        ]
                    },
                    {
                        nome: "Infantil",
                        canais: [
                            { id: "gloob", nome: "Gloob" },
                            { id: "gloobinho", nome: "Gloobinho" },
                            { id: "nickelodeon", nome: "Nickelodeon" },
                            { id: "nickjr", nome: "Nick Jr." },
                            { id: "cartoonnetwork", nome: "Cartoon Network" },
                            { id: "discoverykids", nome: "Discovery Kids" },
                            { id: "ratimbum", nome: "Rá-Tim-Bum" }
                        ]
                    },
                    {
                        nome: "Documentários e Cultura",
                        canais: [
                            { id: "canalbrasil", nome: "Canal Brasil" },
                            { id: "arte1", nome: "Arte 1" },
                            { id: "discovery", nome: "Discovery Channel" },
                            { id: "history", nome: "History Channel" },
                            { id: "animalplanet", nome: "Animal Planet" },
                            { id: "natgeo", nome: "National Geographic" }
                        ]
                    },
                    {
                        nome: "Variedades e Música",
                        canais: [
                            { id: "multishow", nome: "Multishow" },
                            { id: "gnt", nome: "GNT" },
                            { id: "bis", nome: "BIS" },
                            { id: "mtv", nome: "MTV" }
                        ]
                    }
                ]
            };

            // --- CONSTANTES E ELEMENTOS DO DOM ---
            const mainContent = document.getElementById('main-content');
            const authContainer = document.getElementById('auth-container');
            const rechargeContainer = document.getElementById('recharge-container');
            
            const loginForm = document.getElementById('login-form');
            const registerForm = document.getElementById('register-form');
            const rechargeForm = document.getElementById('recharge-form');
            const redeemForm = document.getElementById('redeem-form'); 
            
            const showRegisterLink = document.getElementById('show-register');
            const showLoginLink = document.getElementById('show-login');
            
            const rechargeLogoutButton = document.getElementById('recharge-logout-button'); 
            const settingsIcon = document.getElementById('settings-icon');
            const accountMenu = document.getElementById('account-menu');
            const menuLogoutButton = document.getElementById('menu-logout');
            const menuDeleteButton = document.getElementById('menu-delete-account');
            const menuRedeemCodeButton = document.getElementById('menu-redeem-code'); 
            const closeRedeemModalButton = document.getElementById('close-redeem-modal'); 
            
            const redeemCodeModal = document.getElementById('redeem-code-modal'); 
            const modalOverlay = document.getElementById('modal-overlay'); 

            const loginMessage = document.getElementById('login-message');
            const registerMessage = document.getElementById('register-message');
            const rechargeMessage = document.getElementById('recharge-message');
            const redeemMessage = document.getElementById('redeem-message'); 

            const userSession = document.getElementById('user-session');
            const welcomeMessage = document.getElementById('welcome-message');

            const player = document.getElementById('tv-player');
            const currentChannelDisplay = document.getElementById('current-channel');
            const playerContainer = document.querySelector('.player-container');
            const dynamicChannelsContainer = document.getElementById('dynamic-channels-container');

            // --- CÓDIGOS DE RECARGA ---
            let rechargeData = { VALID_CODES: {}, MS_PER_DAY: 0 }; 
            
            const loadRechargeCodes = async () => {
                try {
                    const response = await fetch('codes.json');
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    const data = await response.json();
                    return { 
                        VALID_CODES: data.VALID_CODES || {},
                        MS_PER_DAY: data.MS_PER_DAY || 0 
                    };
                } catch (error) {
                    console.error('Falha ao carregar códigos de recarga:', error);
                    rechargeMessage.textContent = 'Erro ao carregar dados de recarga. Tente novamente mais tarde.';
                    rechargeMessage.style.color = 'var(--accent-color)';
                    return { VALID_CODES: {}, MS_PER_DAY: 0 };
                }
            };

            rechargeData = await loadRechargeCodes();

            // --- FUNÇÕES DE CONTROLE DE TELA E SESSÃO ---
            const showScreen = (screenName) => {
                mainContent.classList.add('hidden');
                authContainer.classList.add('hidden');
                rechargeContainer.classList.add('hidden');
                accountMenu.classList.add('hidden'); 
                redeemCodeModal.classList.add('hidden'); 
                modalOverlay.classList.add('hidden'); 

                if (screenName === 'auth') document.getElementById('auth-container').classList.remove('hidden');
                else if (screenName === 'recharge') document.getElementById('recharge-container').classList.remove('hidden');
                else if (screenName === 'main') document.getElementById('main-content').classList.remove('hidden');
            };

            const logoutSession = () => {
                localStorage.removeItem('kuromi_tv_currentUser');
                if(refreshInterval) clearInterval(refreshInterval);
                loginForm.reset();
                loginMessage.textContent = '';
                showScreen('auth');
            };

            const deleteAccount = () => {
                const currentUser = localStorage.getItem('kuromi_tv_currentUser');
                if (confirm(`Tem certeza que deseja DELETAR a conta "${currentUser}"? Esta ação é irreversível.`)) {
                    const users = JSON.parse(localStorage.getItem('kuromi_tv_users')) || {};
                    delete users[currentUser];
                    localStorage.setItem('kuromi_tv_users', JSON.stringify(users));
                    alert("Conta deletada com sucesso.");
                    logoutSession();
                }
            };

            const checkSession = () => {
                const currentUser = localStorage.getItem('kuromi_tv_currentUser');
                if (!currentUser) {
                    showScreen('auth');
                    return;
                }
                
                const users = JSON.parse(localStorage.getItem('kuromi_tv_users')) || {};
                const userData = users[currentUser];

                if (userData && userData.accessExpires && userData.accessExpires > Date.now()) {
                    welcomeMessage.textContent = `Olá, ${currentUser}!`;
                    userSession.classList.remove('hidden');
                    showScreen('main');
                    startRefreshTimer();
                } else {
                    showScreen('recharge');
                }
            };
            
            const processRechargeCode = (code, currentUser, messageElement, isRechargeScreen = false) => {
                const users = JSON.parse(localStorage.getItem('kuromi_tv_users'));
                const userData = users[currentUser];
                const validCodes = rechargeData.VALID_CODES;
                const MS_PER_DAY = rechargeData.MS_PER_DAY; 

                if (!validCodes[code]) {
                    messageElement.textContent = 'Código de recarga inválido!';
                    messageElement.style.color = 'var(--accent-color)';
                    return; 
                }
                if (userData.usedCodes && userData.usedCodes.includes(code)) {
                    messageElement.textContent = 'Este código já foi utilizado por você!';
                    messageElement.style.color = 'var(--accent-color)';
                    return; 
                }

                const durationInDays = validCodes[code]; 
                const durationInMs = durationInDays * MS_PER_DAY; 
                const startTime = (userData.accessExpires && userData.accessExpires > Date.now()) ? userData.accessExpires : Date.now();
                
                userData.accessExpires = startTime + durationInMs;
                if (!userData.usedCodes) userData.usedCodes = [];
                userData.usedCodes.push(code);

                localStorage.setItem('kuromi_tv_users', JSON.stringify(users));
                messageElement.textContent = `Código ativado! Adicionado ${durationInDays} dia(s) de acesso.`;
                messageElement.style.color = 'lightgreen';
                
                if (isRechargeScreen) {
                    setTimeout(() => checkSession(), 1500);
                } else {
                    setTimeout(() => {
                        redeemCodeModal.classList.add('hidden');
                        modalOverlay.classList.add('hidden');
                        redeemForm.reset();
                        redeemMessage.textContent = '';
                    }, 2000);
                }
            };
            
            // --- EVENT LISTENERS DE AUTENTICAÇÃO E RECARGA ---
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const username = document.getElementById('register-username').value;
                const password = document.getElementById('register-password').value;
                const users = JSON.parse(localStorage.getItem('kuromi_tv_users')) || {};

                if (users[username]) {
                    registerMessage.textContent = 'Este usuário já existe!';
                    registerMessage.style.color = 'var(--accent-color)';
                } else {
                    users[username] = { password: password, accessExpires: null, usedCodes: [] };
                    localStorage.setItem('kuromi_tv_users', JSON.stringify(users));
                    registerMessage.textContent = 'Conta criada! Faça o login.';
                    registerMessage.style.color = 'lightgreen';
                    setTimeout(() => showLoginLink.click(), 2000);
                }
            });

            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const username = document.getElementById('login-username').value;
                const password = document.getElementById('login-password').value;
                const users = JSON.parse(localStorage.getItem('kuromi_tv_users')) || {};
                const userData = users[username];

                if (userData && userData.password === password) {
                    localStorage.setItem('kuromi_tv_currentUser', username);
                    checkSession();
                } else {
                    loginMessage.textContent = 'Usuário ou senha incorretos!';
                }
            });

            rechargeLogoutButton.addEventListener('click', logoutSession);
            menuLogoutButton.addEventListener('click', logoutSession);
            
            settingsIcon.addEventListener('click', (e) => {
                e.stopPropagation(); 
                accountMenu.classList.toggle('hidden');
            });

            menuDeleteButton.addEventListener('click', deleteAccount);
            
            menuRedeemCodeButton.addEventListener('click', () => {
                accountMenu.classList.add('hidden'); 
                redeemCodeModal.classList.remove('hidden');
                modalOverlay.classList.remove('hidden');
                redeemForm.reset();
                redeemMessage.textContent = '';
            });

            closeRedeemModalButton.addEventListener('click', () => {
                redeemCodeModal.classList.add('hidden');
                modalOverlay.classList.add('hidden');
            });

            document.addEventListener('click', (e) => {
                if (!accountMenu.classList.contains('hidden') && !e.target.closest('#user-session')) {
                    accountMenu.classList.add('hidden');
                }
                if (!redeemCodeModal.classList.contains('hidden') && e.target.id === 'modal-overlay') {
                    redeemCodeModal.classList.add('hidden');
                    modalOverlay.classList.add('hidden');
                }
            });

            rechargeForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const code = document.getElementById('recharge-code').value.toUpperCase();
                const currentUser = localStorage.getItem('kuromi_tv_currentUser');
                processRechargeCode(code, currentUser, rechargeMessage, true);
            });
            
            redeemForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const code = document.getElementById('redeem-code').value.toUpperCase();
                const currentUser = localStorage.getItem('kuromi_tv_currentUser');
                processRechargeCode(code, currentUser, redeemMessage, false);
            });

            showRegisterLink.addEventListener('click', () => {
                document.getElementById('login-form-container').classList.add('hidden');
                document.getElementById('register-form-container').classList.remove('hidden');
            });
            showLoginLink.addEventListener('click', () => {
                document.getElementById('register-form-container').classList.add('hidden');
                document.getElementById('login-form-container').classList.remove('hidden');
            });

            // ==========================================
            // 📺 LÓGICA DINÂMICA DE CANAIS (CRISÁLIDA)
            // ==========================================
            const renderChannels = () => {
                if (!tvConfig.enabled) {
                    dynamicChannelsContainer.innerHTML = '<p style="text-align:center; color: var(--accent-color); font-size: 1.2em; padding: 20px;">🚫 Sistema de canais temporariamente desativado pela administração.</p>';
                    return;
                }

                dynamicChannelsContainer.innerHTML = tvConfig.categorias.map(cat => `
                    <div class="channel-category">
                        <h2>${cat.nome}</h2>
                        <div class="channel-buttons">
                            ${cat.canais.map(canal => `
                                <button class="channel-button" data-channel="${canal.id}" data-name="${canal.nome}">
                                    ${canal.nome}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                `).join('');
            };

            // Event Delegation para os botões de canal (mais performático que forEach)
            dynamicChannelsContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('channel-button')) {
                    const channelId = e.target.getAttribute('data-channel');
                    const channelName = e.target.getAttribute('data-name');
                    
                    player.src = `${tvConfig.baseUrl}/?id=${channelId}`;
                    
                    currentChannelDisplay.textContent = `Canal Atual: ${channelName}`;
                    openFullscreen(playerContainer);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    startRefreshTimer();
                }
            });

            // ➕ ativar canal também com ENTER no controle remoto (D-pad)
            dynamicChannelsContainer.addEventListener('keydown', (e) => {
                if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('channel-button')) {
                    e.preventDefault();
                    e.target.click();
                }
            });

            const openFullscreen = (elem) => {
                if (elem.requestFullscreen) elem.requestFullscreen();
                else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen(); /* Safari */
                else if (elem.msRequestFullscreen) elem.msRequestFullscreen(); /* IE11 */
            };
            
            let refreshInterval;
            const REFRESH_INTERVAL_MS = 10 * 60 * 1000; // 10 minutos

            const refreshPlayer = () => {
                console.log(`Atualizando o player (${new Date().toLocaleTimeString()}) para manter a conexão estável.`);
                const currentUser = localStorage.getItem('kuromi_tv_currentUser');
                const users = JSON.parse(localStorage.getItem('kuromi_tv_users')) || {};
                const userData = users[currentUser];
                
                if (userData && userData.accessExpires && userData.accessExpires > Date.now()) {
                    player.src = player.src; // Recarrega o iFrame
                } else {
                    clearInterval(refreshInterval);
                    checkSession();
                }
            };

            const startRefreshTimer = () => {
                if (refreshInterval) clearInterval(refreshInterval);
                refreshInterval = setInterval(refreshPlayer, REFRESH_INTERVAL_MS);
            };

            // ==========================================
            // ➕ NAVEGAÇÃO POR SETAS (controle remoto / D-pad de qualquer TV)
            // Não interfere nos campos de texto; só age sobre elementos visíveis.
            // ==========================================
            document.addEventListener('keydown', (e) => {
                const navKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
                if (navKeys.indexOf(e.key) === -1) return;

                const active = document.activeElement;
                const tag = (active && active.tagName) || '';
                if (tag === 'INPUT' || tag === 'TEXTAREA') return; // deixa digitar

                let focusables = Array.prototype.slice.call(
                    document.querySelectorAll('button:not([disabled]), a, input, .channel-button')
                ).filter(el => el.offsetParent !== null); // só visíveis

                if (!focusables.length) return;

                let idx = focusables.indexOf(active);
                if (idx === -1) { focusables[0].focus(); e.preventDefault(); return; }

                let n = idx;
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = idx + 1;
                if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   n = idx - 1;

                if (n >= 0 && n < focusables.length) {
                    focusables[n].focus();
                    e.preventDefault();
                }
            });
            
            // --- INICIALIZAÇÃO ---
            renderChannels(); // Renderiza a grade de canais
            checkSession();
        });

        // ==========================================
        // ➕ REGISTRO DO SERVICE WORKER (app nativo / offline)
        // TVs antigas sem suporte continuam funcionando normalmente.
        // ==========================================
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function () {
                navigator.serviceWorker.register('sw.js')
                    .then(function (reg) { console.log('[KUROMI TV] SW ativo:', reg.scope); })
                    .catch(function (err) { console.warn('[KUROMI TV] SW não suportado:', err); });
            });
                             }
