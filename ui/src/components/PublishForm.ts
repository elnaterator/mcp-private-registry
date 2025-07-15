// Publish Form placeholder
export function PublishForm() {
  return `<form id='publish-form' class='p-4 border rounded'>
    <h2 class='text-lg font-bold mb-2'>Publish New MCP Server</h2>
    <input class='border p-2 mb-2 w-full' placeholder='Name' />
    <input class='border p-2 mb-2 w-full' placeholder='URL' />
    <textarea class='border p-2 mb-2 w-full' placeholder='Description'></textarea>
    <button class='bg-blue-500 text-white px-4 py-2 rounded' type='submit'>Publish</button>
  </form>`;
} 