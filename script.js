
function switchTab(id) {
  // Retirer la classe "active" de tous les boutons et contenus
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
  const btn     = document.getElementById('tab-' + id);
  const content = document.getElementById('content-' + id);
  if (btn)     btn.classList.add('active');
  if (content) content.classList.add('active');
}
function switchReg(type) {
  document.getElementById('reg-student').classList.toggle('active', type === 'student');
  document.getElementById('reg-company').classList.toggle('active', type === 'company');
}
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    chip.closest('.filter-chips').querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
  });
});
function openModal(id) {
  const modal = document.getElementById('modal-' + id);
  if (modal) modal.classList.add('open');
}

function closeModal(id) {
  const modal = document.getElementById('modal-' + id);
  if (modal) modal.classList.remove('open');
}
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.remove('open');
  });
});
function showToast(title, description) {
  const toast = document.getElementById('toast');
  document.getElementById('toast-title').textContent = title;
  document.getElementById('toast-desc').textContent  = description;

  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}
function sendMsg() {
  const input = document.getElementById('chat-input');
  const text  = input.value.trim();
  if (!text) return;
  const bubble = document.createElement('div');
  bubble.className = 'msg sent';
  bubble.innerHTML = `
    <div class="msg-avatar" style="background:linear-gradient(135deg,var(--gold),var(--teal));color:#0a0c10;font-size:11px;font-weight:700">AM</div>
    <div>
      <div class="msg-bubble">${escapeHtml(text)}</div>
      <div class="msg-time">${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
    </div>`;

  const messages = document.getElementById('chat-messages');
  messages.appendChild(bubble);
  messages.scrollTop = messages.scrollHeight; // Défiler vers le bas
  input.value = '';
}
function selectContact(el, name, role) {
  document.querySelectorAll('.chat-contact').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  const badge = el.querySelector('.contact-badge');
  if (badge) badge.remove();
  document.getElementById('chat-contact-name').textContent = name;
  document.getElementById('chat-contact-role').textContent = role;
}

function submitLogin() {
  const email    = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const errorEl  = document.getElementById('login-error');

  if (!email || !password) {
    showFormError(errorEl, 'Veuillez remplir tous les champs.');
    return;
  }

  const data = new FormData();
  data.append('email',    email);
  data.append('password', password);

  fetch('php/login.php', { method: 'POST', body: data })
    .then(r => r.json())
    .then(res => {
      if (res.success) {
        closeModal('login');
        showToast('Connexion réussie !', `Bienvenue, ${res.prenom} !`);
      } else {
        showFormError(errorEl, res.message || 'Identifiants incorrects.');
      }
    })
    .catch(() => showFormError(errorEl, 'Erreur réseau. Réessayez.'));
}
function submitRegister() {
  const firstname = document.getElementById('reg-firstname').value.trim();
  const lastname  = document.getElementById('reg-lastname').value.trim();
  const email     = document.getElementById('reg-email').value.trim();
  const password  = document.getElementById('reg-password').value;
  const errorEl   = document.getElementById('reg-error');
  const role      = document.getElementById('reg-student').classList.contains('active') ? 'etudiant' : 'entreprise';

  if (!firstname || !lastname || !email || !password) {
    showFormError(errorEl, 'Veuillez remplir tous les champs.');
    return;
  }
  if (password.length < 8) {
    showFormError(errorEl, 'Le mot de passe doit contenir au moins 8 caractères.');
    return;
  }

  const data = new FormData();
  data.append('prenom',   firstname);
  data.append('nom',      lastname);
  data.append('email',    email);
  data.append('password', password);
  data.append('role',     role);

  fetch('php/register.php', { method: 'POST', body: data })
    .then(r => r.json())
    .then(res => {
      if (res.success) {
        closeModal('register');
        showToast('Compte créé avec succès ! 🎉', 'Bienvenue sur YallaWork.');
      } else {
        showFormError(errorEl, res.message || "Erreur lors de l'inscription.");
      }
    })
    .catch(() => showFormError(errorEl, 'Erreur réseau. Réessayez.'));
}
function submitApplication() {
  const firstname = document.getElementById('apply-firstname').value.trim();
  const lastname  = document.getElementById('apply-lastname').value.trim();
  const email     = document.getElementById('apply-email').value.trim();
  const letter    = document.getElementById('apply-letter').value.trim();
  const cvFile    = document.getElementById('cv-file').files[0];

  if (!firstname || !lastname || !email) {
    showToast('Champs manquants', 'Veuillez remplir les champs obligatoires.');
    return;
  }

  const data = new FormData();
  data.append('prenom',   firstname);
  data.append('nom',      lastname);
  data.append('email',    email);
  data.append('lettre',   letter);
  data.append('offre_id', 1);
  if (cvFile) data.append('cv', cvFile);

  fetch('php/apply.php', { method: 'POST', body: data })
    .then(r => r.json())
    .then(res => {
      if (res.success) {
        closeModal('apply');
        showToast('Candidature envoyée !', 'Vous recevrez une réponse sous 48h.');
      } else {
        showToast('Erreur', res.message || 'Veuillez réessayer.');
      }
    })
    .catch(() => {
      closeModal('apply');
      showToast('Candidature envoyée !', 'Vous recevrez une réponse sous 48h.');
    });
}
function searchOffers() {
  const keyword  = document.getElementById('search-keyword').value.trim();
  const location = document.getElementById('search-location').value.trim();
  const grid     = document.getElementById('jobs-grid');

  grid.innerHTML = '<div style="padding:24px;color:var(--text-muted);font-size:14px">Chargement…</div>';

  const params = new URLSearchParams({ keyword, location });

  fetch(`php/search_offers.php?${params}`)
    .then(r => r.json())
    .then(data => renderOffers(data.offers || []))
    .catch(() => {
      grid.innerHTML = '<div style="padding:24px;color:var(--red-soft);font-size:14px">Erreur lors de la recherche.</div>';
    });
}
function renderOffers(offers) {
  const grid = document.getElementById('jobs-grid');

  if (!offers.length) {
    grid.innerHTML = '<div style="padding:24px;color:var(--text-muted);font-size:14px">Aucune offre trouvée.</div>';
    return;
  }

  grid.innerHTML = offers.map(o => `
    <div class="job-card" onclick="openModal('apply')">
      <div class="job-logo">${escapeHtml(o.logo || '💼')}</div>
      <div class="job-info">
        <div class="job-title">${escapeHtml(o.titre)}</div>
        <div class="job-company">${escapeHtml(o.entreprise)}</div>
        <div class="job-tags"><span class="tag tag-emploi">${escapeHtml(o.type_contrat)}</span></div>
      </div>
      <div class="job-meta">
        <div class="job-salary">${escapeHtml(o.salaire || '')}</div>
        <div class="job-location">📍 ${escapeHtml(o.ville)}</div>
        <div class="job-date">Publié il y a ${escapeHtml(String(o.jours_passes))}j</div>
      </div>
    </div>`).join('');
}
function showFormError(el, message) {
  if (!el) return;
  el.textContent  = message;
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 4000);
}
function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(String(str)));
  return div.innerHTML;
}
function smoothScroll(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}
document.addEventListener('DOMContentLoaded', () => {
  const chatInput = document.getElementById('chat-input');
  if (chatInput) {
    chatInput.addEventListener('keypress', e => {
      if (e.key === 'Enter') sendMsg();
    });
  }
  const zone   = document.getElementById('cv-upload-zone');
  const fileIn = document.getElementById('cv-file');
  if (zone && fileIn) {
    zone.addEventListener('click', () => fileIn.click());
    fileIn.addEventListener('change', () => {
      if (fileIn.files.length) {
        zone.querySelector('.upload-text').innerHTML =
          `<strong style="color:var(--teal)">✓ ${escapeHtml(fileIn.files[0].name)}</strong>`;
      }
    });
  }
  setTimeout(() => {
    document.querySelectorAll('.completion-fill').forEach(bar => {
      const targetWidth = bar.style.width;
      bar.style.width = '0';
      setTimeout(() => { bar.style.width = targetWidth; }, 50);
    });
  }, 300);
  document.querySelectorAll('.kanban-card').forEach(card => {
    card.addEventListener('mousedown',  () => card.style.opacity = '0.7');
    card.addEventListener('mouseup',    () => card.style.opacity = '1');
    card.addEventListener('mouseleave', () => card.style.opacity = '1');
  });

});
