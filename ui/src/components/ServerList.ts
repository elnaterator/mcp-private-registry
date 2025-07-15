import { API_BASE_URL } from '../config';
import type { McpServer } from '../types/mcp';

function getRepoIcon(source: string) {
  if (source.toLowerCase().includes('github')) {
    return `<svg class="w-4 h-4 mr-1 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.339-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.687-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.594 1.028 2.687 0 3.847-2.338 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .267.18.577.688.479C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"/></svg>`;
  }
  // Default icon
  return `<svg class="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>`;
}

// Helper to split <namespace>/<serverName>
function splitServerName(fullName: string): { namespace: string; serverName: string } {
  const idx = fullName.indexOf('/');
  if (idx === -1) return { namespace: '', serverName: fullName };
  return {
    namespace: fullName.slice(0, idx),
    serverName: fullName.slice(idx + 1),
  };
}

export function renderServerList() {
  const container = document.getElementById('server-list');
  if (!container) return;
  container.innerHTML = `<div>Loading servers...</div>`;

  fetch(`${API_BASE_URL}/servers`)
    .then(async (res) => {
      if (!res.ok) throw new Error('Failed to fetch servers');
      const data = await res.json();
      const servers: McpServer[] = data.servers || [];
      if (servers.length === 0) {
        container.innerHTML = '<div>No servers found.</div>';
        return;
      }
      container.innerHTML = `
        <div class="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          ${servers.map((server, i) => {
            const { namespace, serverName } = splitServerName(server.name);
            return `
            <div class="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer p-6 flex flex-col gap-3 border border-gray-100 hover:scale-[1.025] group" data-server-index="${i}">
              <div class="mb-1">
                <span class="font-extrabold text-lg text-gray-900 group-hover:text-blue-700 transition block">${serverName}</span>
                <span class="text-xs text-gray-400 block -mt-1 mb-1">${namespace}</span>
                <span class="ml-auto bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-semibold float-right">v${server.version_detail.version}</span>
              </div>
              <div class="text-gray-600 text-sm line-clamp-3 min-h-[48px]">${server.description}</div>
              <div class="flex items-center gap-2 mt-2">
                <span class="inline-flex items-center bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full font-medium">
                  ${getRepoIcon(server.repository.source)}
                  ${server.repository.source}
                </span>
                <a href="${server.repository.url}" target="_blank" class="ml-2 text-blue-500 underline text-xs hover:text-blue-700">Repo</a>
              </div>
            </div>
          `;}).join('')}
        </div>
        <div id="server-modal" class="fixed inset-0 z-50 hidden items-center justify-center bg-black bg-opacity-50 transition-all">
          <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-fade-in">
            <button id="close-modal" class="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-2xl text-gray-500 hover:text-gray-700 transition">&times;</button>
            <div id="modal-content"></div>
          </div>
        </div>
      `;
    })
    .catch((err) => {
      container.innerHTML = `<div class='text-red-600'>Error: ${err.message}</div>`;
    });
}

export function setupServerList() {
  const container = document.getElementById('server-list');
  if (!container) return;
  container.addEventListener('click', (e) => {
    const card = (e.target as HTMLElement).closest('[data-server-index]');
    if (!card) return;
    const index = card.getAttribute('data-server-index');
    if (index === null) return;
    // Find the server data from the rendered cards
    const servers = Array.from(container.querySelectorAll('[data-server-index]')).map(card => {
      const name = card.querySelector('.font-extrabold')?.textContent || '';
      const namespace = card.querySelector('.text-xs.text-gray-400')?.textContent || '';
      return {
        name,
        namespace,
        description: card.querySelector('.text-gray-600')?.textContent || '',
        version: card.querySelector('.bg-blue-100')?.textContent?.replace('v', '') || '',
        repo: card.querySelector('a')?.getAttribute('href') || '',
        source: card.querySelector('.inline-flex')?.textContent?.trim() || '',
      };
    });
    const server = servers[parseInt(index, 10)];
    const modal = document.getElementById('server-modal');
    const modalContent = document.getElementById('modal-content');
    if (modal && modalContent) {
      modalContent.innerHTML = `
        <div class="mb-2 text-2xl font-extrabold text-gray-900">${server.name}</div>
        <div class="mb-1 text-xs text-gray-400">${server.namespace}</div>
        <div class="mb-4 text-gray-700 text-base">${server.description}</div>
        <div class="mb-2 text-xs text-gray-500">Version: <span class="font-mono">${server.version}</span></div>
        <div class="mb-2 text-xs text-gray-500">Repository: <a href="${server.repo}" target="_blank" class="text-blue-600 underline">${server.source}</a></div>
      `;
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.getElementById('close-modal')?.addEventListener('click', () => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      });
      modal.addEventListener('click', (evt) => {
        if (evt.target === modal) {
          modal.classList.add('hidden');
          modal.classList.remove('flex');
        }
      });
    }
  });
} 