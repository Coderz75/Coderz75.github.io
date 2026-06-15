// ── Copy email ────────────────────────────────────────────────────────────────
function copyEmail() {
    navigator.clipboard.writeText('n.syed.dev@gmail.com');
    const btn = document.getElementById('copy-btn');
    btn.textContent = '✓ Copied!';
    setTimeout(() => {
        btn.innerHTML = '';
        const icon = document.createElement('i');
        icon.setAttribute('data-lucide', 'copy');
        icon.className = 'w-4 h-4 mr-2';
        btn.appendChild(icon);
        btn.appendChild(document.createTextNode(' Copy Email'));
        lucide.createIcons();
    }, 2000);
}

// ── Mobile menu toggle ────────────────────────────────────────────────────────
document.getElementById('mobile-menu-btn').addEventListener('click', () => {
    document.getElementById('mobile-menu').classList.toggle('hidden');
});

// ── Navbar shrink + active nav link on scroll ─────────────────────────────────
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.classList.add('bg-slate-950/80', 'backdrop-blur-md', 'py-3', 'border-slate-900');
        nav.classList.remove('py-4', 'border-transparent');
    } else {
        nav.classList.remove('bg-slate-950/80', 'backdrop-blur-md', 'py-3', 'border-slate-900');
        nav.classList.add('py-4', 'border-transparent');
    }

    let current = '';
    document.querySelectorAll('section').forEach(section => {
        if (pageYOffset >= section.offsetTop - 100) {
            current = section.getAttribute('id');
        }
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
});

// ── Reveal animations ─────────────────────────────────────────────────────────
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ── Projects ──────────────────────────────────────────────────────────────────
async function renderProjects(filter = 'All') {
    let projects;
    try {
        const res = await fetch('projects/index_proj.json');
        projects = await res.json();
    } catch {
        console.warn('No projects/index_proj.json found');
        return;
    }

    const allTags = ['All', ...new Set(projects.flatMap(p => [...(p.tags || []), ...(p.tech || [])]))];

    const filterContainer = document.getElementById('project-filters');
    filterContainer.innerHTML = '';
    allTags.forEach(tag => {
        const btn = document.createElement('button');
        btn.textContent = tag;
        btn.className = 'px-4 py-1.5 rounded-full text-xs font-medium border transition-all ' +
            (filter === tag
                ? 'bg-indigo-500 border-indigo-500 text-white'
                : 'border-slate-800 text-slate-400 hover:border-slate-600');
        btn.addEventListener('click', () => renderProjects(tag));
        filterContainer.appendChild(btn);
    });

    const filtered = filter === 'All'
        ? projects
        : projects.filter(p => [...(p.tags || []), ...(p.tech || [])].includes(filter));

    const grid = document.getElementById('projects-grid');
    grid.innerHTML = '';

    filtered.forEach(p => {
        const readMoreHref = p.customLink || ('post.html#project-' + p.slug);
        const isExternal = p.customLink && p.customLink.startsWith('http');
        const combinedBadges = [...new Set([...(p.tech || []), ...(p.tags || [])])];

        const card = document.createElement('div');
        card.className = 'group relative z-0 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300' +
            (p.featured ? ' md:col-span-2' : '');

        const imgWrap = document.createElement('div');
        imgWrap.className = 'h-64 overflow-hidden';
        const img = document.createElement('img');
        img.src = p.image;
        img.alt = p.title;
        img.className = 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-500';
        imgWrap.appendChild(img);

        const body = document.createElement('div');
        body.className = 'p-8';

        const badges = document.createElement('div');
        badges.className = 'flex flex-wrap items-center gap-2 mb-4';
        combinedBadges.forEach((item, i) => {
            const span = document.createElement('span');
            span.textContent = item;
            span.className = 'text-[10px] font-mono text-indigo-400 uppercase';
            badges.appendChild(span);
            if (i < combinedBadges.length - 1) {
                const dot = document.createElement('span');
                dot.textContent = '•';
                dot.className = 'text-[10px] text-slate-500';
                badges.appendChild(dot);
            }
        });

        const title = document.createElement('h3');
        title.textContent = p.title;
        title.className = 'text-2xl font-bold mb-3 group-hover:text-indigo-400 transition-colors';

        const desc = document.createElement('p');
        desc.textContent = p.description;
        desc.className = 'text-slate-400 mb-6 line-clamp-2';

        const linksRow = document.createElement('div');
        linksRow.className = 'flex space-x-4 items-center';

        const iconsWrap = document.createElement('div');
        iconsWrap.className = 'flex space-x-4 items-center relative z-20';

        const ghLink = document.createElement('a');
        ghLink.href = p.github;
        ghLink.target = '_blank';
        ghLink.rel = 'noopener noreferrer';
        ghLink.className = 'text-slate-300 hover:text-white';
        ghLink.setAttribute('aria-label', 'GitHub');
        ghLink.innerHTML = '<i data-lucide="github" class="w-5 h-5"></i>';
        iconsWrap.appendChild(ghLink);

        if (p.demo) {
            const demoLink = document.createElement('a');
            demoLink.href = p.demo;
            demoLink.target = '_blank';
            demoLink.rel = 'noopener noreferrer';
            demoLink.className = 'text-slate-300 hover:text-white';
            demoLink.setAttribute('aria-label', 'Demo');
            demoLink.innerHTML = '<i data-lucide="external-link" class="w-5 h-5"></i>';
            iconsWrap.appendChild(demoLink);
        }

        const readMore = document.createElement('a');
        readMore.href = readMoreHref;
        if (isExternal) { readMore.target = '_blank'; readMore.rel = 'noopener noreferrer'; }
        readMore.className = 'ml-auto text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-1 transition-colors after:absolute after:inset-0 after:z-10';
        readMore.innerHTML = 'See More <i data-lucide="arrow-right" class="w-4 h-4"></i>';

        linksRow.appendChild(iconsWrap);
        linksRow.appendChild(readMore);
        body.appendChild(badges);
        body.appendChild(title);
        body.appendChild(desc);
        body.appendChild(linksRow);
        card.appendChild(imgWrap);
        card.appendChild(body);
        grid.appendChild(card);
    });

    lucide.createIcons();
}

// ── Blog posts ────────────────────────────────────────────────────────────────
async function renderBlog() {
    let posts;
    try {
        const res = await fetch('posts/index.json');
        posts = await res.json();
    } catch {
        console.warn('No posts/index.json found');
        return;
    }
    if (!posts.length) return;

    const section = document.getElementById('blog');
    const heading = document.createElement('h2');
    heading.textContent = 'Writing';
    heading.className = 'text-3xl font-bold mb-12';
    section.appendChild(heading);

    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl';

    posts.forEach(post => {
        const card = document.createElement('a');
        card.href = 'post.html#' + post.slug;
        card.className = 'group block bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300';

        const inner = document.createElement('div');
        inner.className = 'p-8';

        const tagsRow = document.createElement('div');
        tagsRow.className = 'flex flex-wrap items-center gap-2 mb-4';
        post.tags.forEach((t, i) => {
            const span = document.createElement('span');
            span.textContent = t;
            span.className = 'text-[10px] font-mono text-indigo-400 uppercase tracking-widest';
            tagsRow.appendChild(span);
            if (i < post.tags.length - 1) {
                const dot = document.createElement('span');
                dot.textContent = '•';
                dot.className = 'text-[10px] text-slate-500';
                tagsRow.appendChild(dot);
            }
        });

        const titleEl = document.createElement('h3');
        titleEl.textContent = post.title;
        titleEl.className = 'text-xl font-bold mb-3 group-hover:text-indigo-400 transition-colors';

        const summary = document.createElement('p');
        summary.textContent = post.summary;
        summary.className = 'text-slate-400 text-sm mb-6 line-clamp-2';

        const footer = document.createElement('div');
        footer.className = 'flex items-center justify-between';

        const date = document.createElement('span');
        date.textContent = post.date;
        date.className = 'text-slate-600 text-xs font-mono';

        const readMore = document.createElement('span');
        readMore.className = 'text-indigo-400 text-sm flex items-center gap-1 group-hover:gap-2 transition-all';
        readMore.innerHTML = 'Read <i data-lucide="arrow-right" class="w-4 h-4"></i>';

        footer.appendChild(date);
        footer.appendChild(readMore);
        inner.appendChild(tagsRow);
        inner.appendChild(titleEl);
        inner.appendChild(summary);
        inner.appendChild(footer);
        card.appendChild(inner);
        grid.appendChild(card);
    });

    section.appendChild(grid);
    lucide.createIcons();
}

// ── Boot ──────────────────────────────────────────────────────────────────────
renderProjects('All');
renderBlog();
lucide.createIcons();