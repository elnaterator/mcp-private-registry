import './index.css';
import { renderServerList, setupServerList } from './components/ServerList';
import { SearchBar } from './components/SearchBar';
import { ServerDetails } from './components/ServerDetails';
import { PublishForm } from './components/PublishForm';

const app = document.querySelector<HTMLDivElement>('#app');
if (app) {
  app.innerHTML = `
    <header class='bg-gray-900 text-white p-4 mb-4'>
      <h1 class='text-2xl font-bold'>Enterprise MCP Registry</h1>
    </header>
    <main class='max-w-5xl mx-auto space-y-6 bg-gray-50 min-h-screen p-4'>
      <section>
        ${SearchBar()}
      </section>
      <section>
        <div id='server-list' class='p-4'></div>
      </section>
      <section>
        ${ServerDetails()}
      </section>
      <section>
        ${PublishForm()}
      </section>
    </main>
  `;
  renderServerList();
  setTimeout(setupServerList, 500); // Wait for renderServerList to finish
}
