import './index.css';
import { renderServerList, setupServerList } from './components/ServerList';
import { SearchBar } from './components/SearchBar';
import { ServerDetails } from './components/ServerDetails';
import { PublishForm } from './components/PublishForm';

const app = document.querySelector<HTMLDivElement>('#app');

function renderHome() {
  return `
    <section>
      ${SearchBar()}
    </section>
    <section>
      <div id='server-list' class='p-4'></div>
    </section>
    <section>
      ${ServerDetails()}
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

function renderPage() {
  if (!app) return;
  const hash = window.location.hash;
  let mainContent = '';
  if (hash === '#/publish') {
    mainContent = renderPublish();
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
  if (hash !== '#/publish') {
    renderServerList();
    setTimeout(setupServerList, 500);
  }
}

window.addEventListener('hashchange', renderPage);
renderPage();
