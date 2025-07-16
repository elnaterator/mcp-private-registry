import './index.css';
import { renderServerList, searchServers, resetServers, fetchServers } from './components/ServerList';
import { SearchBar } from './components/SearchBar';
import { PublishForm } from './components/PublishForm';
import { API_BASE_URL } from './config';
import { marked } from 'marked';
(window as any).fetchServers = fetchServers;

const app = document.querySelector<HTMLDivElement>('#app');

function renderHome() {
  return `
    <section>
      ${SearchBar((query: string) => {
        if (query) {
          searchServers(query);
        } else {
          resetServers();
          renderServerList();
        }
      })}
    </section>
    <section>
      <div id='server-list' class='p-4'></div>
    </section>
  `;
}

function renderPublish() {
  return `
    <section>
      ${PublishForm()}
    </section>
  `;
}

function renderServerDetailsPage() {
  return `<section id='server-details-page' class='p-4'>Loading server details...</section>`;
}

function renderPage() {
  if (!app) return;
  const hash = window.location.hash;
  let mainContent = '';
  if (hash === '#/publish') {
    mainContent = renderPublish();
  } else if (hash.startsWith('#/server/')) {
    mainContent = renderServerDetailsPage();
  } else {
    mainContent = renderHome();
  }
  app.innerHTML = `
    <header class='bg-gray-900 text-white p-4 mb-4 flex items-center justify-between'>
      <h1 class='text-2xl font-bold'>Enterprise MCP Registry</h1>
      <nav>
        <a href='#/' class='mr-4 hover:underline'>Home</a>
        <a href='#/publish' class='bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition'>Publish</a>
      </nav>
    </header>
    <main class='max-w-5xl mx-auto space-y-6 bg-gray-50 min-h-screen p-4'>
      ${mainContent}
    </main>
  `;
  if (hash !== '#/publish' && !hash.startsWith('#/server/')) {
    renderServerList();
    setTimeout(() => setupServerListWithRouting(), 500);
  }
  if (hash.startsWith('#/server/')) {
    const id = hash.replace('#/server/', '');
    fetchServerDetails(id);
  }
}

function setupServerListWithRouting() {
  const container = document.getElementById('server-list');
  if (!container) return;
  container.addEventListener('click', (e) => {
    const card = (e.target as HTMLElement).closest('[data-server-id]');
    if (!card) return;
    const id = card.getAttribute('data-server-id');
    if (id) {
      window.location.hash = `#/server/${id}`;
    }
  });
}

async function fetchServerDetails(id: string) {
  const detailsSection = document.getElementById('server-details-page');
  if (!detailsSection) return;
  try {
    const res = await fetch(`${API_BASE_URL}/servers/${id}`);
    if (!res.ok) throw new Error('Failed to fetch server details');
    const data = await res.json();
    detailsSection.innerHTML = renderServerDetailsData(data);
    
    // Try to fetch README from repository
    if (data.repository && data.repository.url) {
      try {
        let readmeUrl = '';
        if (data.repository.source.toLowerCase() === 'github') {
          // Convert GitHub URL to raw GitHub URL
          const githubUrl = data.repository.url;
          const match = githubUrl.match(/https:\/\/github\.com\/([^\/]+\/[^\/]+)/);
          if (match) {
            readmeUrl = `https://raw.githubusercontent.com/${match[1]}/main/README.md`;
          }
        } else {
          // For other sources, try appending /README.md
          readmeUrl = `${data.repository.url}/README.md`;
        }
        
        if (readmeUrl) {
          const readmeRes = await fetch(readmeUrl);
          if (readmeRes.ok) {
            const readmeText = await readmeRes.text();
            const readmeSection = document.getElementById('readme-section');
            if (readmeSection) {
              readmeSection.innerHTML = renderReadme(readmeText);
            }
          }
        }
      } catch (readmeErr) {
        // Silently skip if README is not available
        console.log('README not available:', readmeErr);
      }
    }
  } catch (err: any) {
    detailsSection.innerHTML = `<div class='text-red-600'>Error: ${err.message}</div>`;
  }
}

function renderReadme(readmeText: string) {
  // Use marked library for proper markdown rendering
  const html = marked(readmeText);
  
  return `
    <div class="mt-8">
      <h3 class="text-lg font-semibold mb-3 flex items-center gap-2">
        <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        README
      </h3>
      <div class="bg-white rounded-lg border p-6 max-w-none">
        <div class="markdown-content">
          ${html}
        </div>
      </div>
    </div>
  `;
}

function renderServerDetailsData(data: any) {
  // Split name into namespace/serverName
  let namespace = '', serverName = data.name;
  const idx = data.name.indexOf('/');
  if (idx !== -1) {
    namespace = data.name.slice(0, idx);
    serverName = data.name.slice(idx + 1);
  }
  return `
    <div class='mb-4'>
      <button onclick="window.location.hash='#/'" class='mb-4 text-blue-600 underline flex items-center gap-1'>
        <svg class='w-4 h-4 inline-block' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M15 19l-7-7 7-7'/></svg>
        Back to list
      </button>
      <div class='bg-white rounded-2xl shadow-md p-8 grid grid-cols-1 md:grid-cols-3 gap-8 border border-gray-100'>
        <!-- Left column -->
        <div class='md:col-span-2'>
          <div class='mb-2'>
            <span class='font-extrabold text-3xl text-gray-900'>${serverName}</span>
            <span class='block text-xs text-gray-400 mt-1 mb-2'>${namespace}</span>
          </div>
          <div class='mb-4 text-gray-700 text-lg'>${data.description}</div>
          <div class='mt-8 text-gray-400 italic'>More information coming soon...</div>
        </div>
        <!-- Right column -->
        <div class='flex flex-col gap-4'>
          <div class='flex items-center gap-2'>
            <svg class='w-5 h-5 text-blue-500' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M16 12a4 4 0 1 0-8 0 4 4 0 0 0 8 0z'/><path stroke-linecap='round' stroke-linejoin='round' d='M12 16v6m8-6a8 8 0 1 1-16 0 8 8 0 0 1 16 0z'/></svg>
            <a href='${data.repository.url}' target='_blank' class='text-blue-600 underline font-medium hover:text-blue-800 transition'>${data.repository.source}</a>
          </div>
          <div class='flex items-center gap-2'>
            <svg class='w-5 h-5 text-green-500' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M12 8v4l3 3'/><circle cx='12' cy='12' r='10' stroke='currentColor' stroke-width='2' fill='none'/></svg>
            <span class='font-mono text-sm'>${data.version_detail.version}</span>
          </div>
          <div class='flex items-center gap-2'>
            <svg class='w-5 h-5 text-gray-400' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><rect width='20' height='14' x='2' y='5' rx='2' stroke='currentColor' stroke-width='2' fill='none'/><path stroke-linecap='round' stroke-linejoin='round' d='M8 9h8'/></svg>
            <span class='text-xs text-gray-500'>ID: ${data.id}</span>
          </div>
          <div class='flex items-center gap-2'>
            <svg class='w-5 h-5 text-yellow-500' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M12 8v4l3 3'/><circle cx='12' cy='12' r='10' stroke='currentColor' stroke-width='2' fill='none'/></svg>
            <span class='text-xs text-gray-500'>Release: ${data.version_detail.release_date}</span>
          </div>
          <div class='flex items-center gap-2'>
            <svg class='w-5 h-5 text-purple-500' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10' stroke='currentColor' stroke-width='2' fill='none'/><path stroke-linecap='round' stroke-linejoin='round' d='M9 12l2 2 4-4'/></svg>
            <span class='text-xs text-gray-500'>Latest: ${data.version_detail.is_latest ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </div>
      <div class='mt-8'>
        <div class='mb-2 font-semibold text-lg flex items-center gap-2'>
          <svg class='w-6 h-6 text-blue-500' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M9 17v-2a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v2'/><circle cx='9' cy='7' r='4' stroke='currentColor' stroke-width='2' fill='none'/></svg>
          Agent Integration & Configuration
        </div>
        <div class='mb-4 text-gray-600'>
          To use this MCP server from your AI agent, install the package(s) below and provide the required environment variables. These variables are needed for authentication and proper operation.
        </div>
        <ul class='list-disc ml-6'>
          ${(data.packages || []).map((pkg: any) => `
            <li class='mb-4'>
              <div class='font-semibold text-base flex items-center gap-2'>
                ${getRegistryIcon(pkg.registry_name)}
                ${pkg.registry_name}: <span class='font-mono'>${pkg.name}</span> <span class='text-xs text-gray-400'>(v${pkg.version})</span>
              </div>
              ${(pkg.environment_variables && pkg.environment_variables.length > 0) ? `
                <div class='mt-2 ml-2 text-sm text-gray-700'>
                  <div class='mb-1 font-medium flex items-center gap-1'>
                    <svg class='w-4 h-4 text-yellow-500' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M13 16h-1v-4h-1m1-4h.01'/><circle cx='12' cy='12' r='10' stroke='currentColor' stroke-width='2' fill='none'/></svg>
                    Required Environment Variables:
                  </div>
                  <ul class='list-disc ml-6'>
                    ${pkg.environment_variables.map((env: any) => `
                      <li class='mb-1'><span class='font-mono text-blue-700'>${env.name}</span>: <span class='text-gray-600'>${env.description}</span></li>
                    `).join('')}
                  </ul>
                </div>
              ` : `<div class='mt-2 ml-2 text-sm text-gray-400 italic'>No environment variables required.</div>`}
            </li>
          `).join('')}
        </ul>
      </div>
      <div id='readme-section'></div>
    </div>
  `;
}

function getRegistryIcon(registry: string) {
  switch (registry.toLowerCase()) {
    case 'npm':
      return `<svg class='w-5 h-5 text-red-600' fill='currentColor' viewBox='0 0 24 24'><rect width='24' height='24' rx='4'/><text x='6' y='17' font-size='10' fill='white' font-family='monospace'>npm</text></svg>`;
    case 'docker':
      // More square, recognizable Docker logo
      return `<svg class='w-5 h-5 text-blue-500' viewBox='0 0 32 32' fill='currentColor'><rect width='32' height='32' rx='6' fill='#0db7ed'/><path d='M25.5 18.5c-.2 0-.4-.1-.5-.2-.1-.1-1.2-1.1-1.2-2.2 0-1.2 1.2-2.1 1.2-2.2.2-.1.4-.2.6-.2.2 0 .4.1.5.2.1.1 1.2 1.1 1.2 2.2 0 1.2-1.2 2.1-1.2 2.2-.1.1-.3.2-.6.2zm-2.2 1.2c-.3 0-.6-.1-.8-.3-.2-.2-1.1-1-1.1-2 0-1.1 1-1.8 1.1-2 .2-.2.5-.3.8-.3.3 0 .6.1.8.3.2.2 1.1 1 1.1 2 0 1.1-1 1.8-1.1 2-.2.2-.5.3-.8.3zm-2.3.2c-.2 0-.4-.1-.6-.2-.1-.1-.9-.8-.9-1.7 0-.9.8-1.5.9-1.7.2-.1.4-.2.6-.2.2 0 .4.1.6.2.1.1.9.8.9 1.7 0 .9-.8 1.5-.9 1.7-.2.1-.4.2-.6.2zm-2.2.1c-.2 0-.4-.1-.5-.2-.1-.1-.7-.6-.7-1.3 0-.7.6-1.2.7-1.3.1-.1.3-.2.5-.2.2 0 .4.1.5.2.1.1.7.6.7 1.3 0 .7-.6 1.2-.7 1.3-.1.1-.3.2-.5.2zm-2.2 0c-.2 0-.4-.1-.5-.2-.1-.1-.7-.6-.7-1.3 0-.7.6-1.2.7-1.3.1-.1.3-.2.5-.2.2 0 .4.1.5.2.1.1.7.6.7 1.3 0 .7-.6 1.2-.7 1.3-.1.1-.3.2-.5.2zm-2.2-.1c-.2 0-.4-.1-.6-.2-.1-.1-.9-.8-.9-1.7 0-.9.8-1.5.9-1.7.2-.1.4-.2.6-.2.2 0 .4.1.6.2.1.1.9.8.9 1.7 0 .9-.8 1.5-.9 1.7-.2.1-.4.2-.6.2zm-2.3-.2c-.3 0-.6-.1-.8-.3-.2-.2-1.1-1-1.1-2 0-1.1 1-1.8 1.1-2 .2-.2.5-.3.8-.3.3 0 .6.1.8.3.2.2 1.1 1 1.1 2 0 1.1-1 1.8-1.1 2-.2.2-.5.3-.8.3zm-2.2-1.2c-.2 0-.4-.1-.5-.2-.1-.1-1.2-1.1-1.2-2.2 0-1.2 1.2-2.1 1.2-2.2.2-.1.4-.2.6-.2.2 0 .4.1.5.2.1.1 1.2 1.1 1.2 2.2 0 1.2-1.2 2.1-1.2 2.2-.1.1-.3.2-.6.2zm-1.2-3.2h18v1h-18z' fill='#fff'/></svg>`;
    default:
      return `<svg class='w-5 h-5 text-gray-400' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10' stroke='currentColor' stroke-width='2' fill='none'/><path stroke-linecap='round' stroke-linejoin='round' d='M12 8v4l3 3'/></svg>`;
  }
}

window.addEventListener('hashchange', renderPage);
renderPage();

// Move infinite scroll event listener to global scope so it works after navigation
let infiniteScrollAttached = false;
function attachInfiniteScroll() {
  if (infiniteScrollAttached) return;
  window.addEventListener('scroll', () => {
    // Only trigger on home page
    if (window.location.hash && window.location.hash !== '#/' && window.location.hash !== '') return;
    // Try to fetch more servers if near bottom
    const scrollY = window.scrollY || window.pageYOffset;
    const viewportHeight = window.innerHeight;
    const fullHeight = document.body.offsetHeight;
    if (scrollY + viewportHeight >= fullHeight - 200) {
      // @ts-ignore
      if (typeof window.fetchServers === 'function') window.fetchServers(false);
    }
  });
  infiniteScrollAttached = true;
}
attachInfiniteScroll();
