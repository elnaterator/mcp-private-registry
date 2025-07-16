// Publish Form for all MCP server fields
export function PublishForm() {
  setTimeout(setupDynamicPackageFields, 0); // Attach after render
  return `
    <form id='publish-form' class='p-4 border rounded bg-white max-w-2xl mx-auto'>
      <h2 class='text-lg font-bold mb-4'>Publish New MCP Server</h2>
      <div class='mb-3'>
        <label class='block text-sm font-medium mb-1'>Server Name</label>
        <input name='name' class='border p-2 w-full rounded' placeholder='io.github.co-browser/attestable-mcp-server' required />
      </div>
      <div class='mb-3'>
        <label class='block text-sm font-medium mb-1'>Description</label>
        <textarea name='description' class='border p-2 w-full rounded' placeholder='Describe the MCP server...' required></textarea>
      </div>
      <fieldset class='mb-3 border rounded p-3'>
        <legend class='text-sm font-semibold'>Repository</legend>
        <div class='mb-2'>
          <label class='block text-xs font-medium mb-1'>URL</label>
          <input name='repo_url' class='border p-2 w-full rounded' placeholder='https://github.com/co-browser/attestable-mcp-server' required />
        </div>
        <div class='mb-2'>
          <label class='block text-xs font-medium mb-1'>Source</label>
          <input name='repo_source' class='border p-2 w-full rounded' placeholder='github' required />
        </div>
        <div>
          <label class='block text-xs font-medium mb-1'>Repository ID</label>
          <input name='repo_id' class='border p-2 w-full rounded' placeholder='955641588' required />
        </div>
      </fieldset>
      <fieldset class='mb-3 border rounded p-3'>
        <legend class='text-sm font-semibold'>Version Details</legend>
        <div class='mb-2'>
          <label class='block text-xs font-medium mb-1'>Version</label>
          <input name='version' class='border p-2 w-full rounded' placeholder='0.0.1-seed' required />
        </div>
        <div class='mb-2'>
          <label class='block text-xs font-medium mb-1'>Release Date</label>
          <input name='release_date' type='datetime-local' class='border p-2 w-full rounded' required />
        </div>
        <div class='flex items-center gap-2'>
          <input name='is_latest' type='checkbox' class='accent-blue-600' id='is_latest' />
          <label for='is_latest' class='text-xs font-medium'>Is Latest</label>
        </div>
      </fieldset>
      <fieldset class='mb-3 border rounded p-3'>
        <legend class='text-sm font-semibold flex items-center gap-2'>
          Packages
          <button type='button' id='add-package' class='ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200'>+ Add Package</button>
        </legend>
        <div id='packages-list'>
          <div class='package-fields flex gap-2 mb-2'>
            <input name='package_registry_name' class='border p-2 rounded w-28' placeholder='docker' required />
            <input name='package_name' class='border p-2 rounded w-48' placeholder='attestable-mcp-server' required />
            <input name='package_version' class='border p-2 rounded w-28' placeholder='0.1.0' required />
            <button type='button' class='remove-package text-red-500 hover:underline text-xs'>Remove</button>
          </div>
        </div>
      </fieldset>
      <button class='bg-blue-500 text-white px-4 py-2 rounded mt-2' type='submit'>Publish</button>
    </form>
  `;
}

function setupDynamicPackageFields() {
  const addBtn = document.getElementById('add-package');
  const pkgList = document.getElementById('packages-list');
  if (addBtn && pkgList) {
    addBtn.addEventListener('click', () => {
      const div = document.createElement('div');
      div.className = 'package-fields flex gap-2 mb-2';
      div.innerHTML = `
        <input name='package_registry_name' class='border p-2 rounded w-28' placeholder='docker' required />
        <input name='package_name' class='border p-2 rounded w-48' placeholder='attestable-mcp-server' required />
        <input name='package_version' class='border p-2 rounded w-28' placeholder='0.1.0' required />
        <button type='button' class='remove-package text-red-500 hover:underline text-xs'>Remove</button>
      `;
      pkgList.appendChild(div);
    });
    pkgList.addEventListener('click', (e) => {
      if (e.target && (e.target as HTMLElement).classList.contains('remove-package')) {
        const fieldDiv = (e.target as HTMLElement).closest('.package-fields');
        if (fieldDiv && pkgList.children.length > 1) {
          fieldDiv.remove();
        }
      }
    });
  }
} 