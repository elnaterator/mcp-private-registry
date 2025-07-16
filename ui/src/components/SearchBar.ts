export function SearchBar(onSearch?: (query: string) => void) {
  // Render the search bar
  setTimeout(() => {
    const input = document.getElementById('search-bar') as HTMLInputElement | null;
    if (input && onSearch) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          onSearch(input.value.trim());
        }
      });
      input.addEventListener('input', () => {
        if (input.value === '') {
          onSearch('');
        }
      });
    }
  }, 0);
  return `<input id='search-bar' class='border p-2 w-full rounded-lg' placeholder='Search MCP servers...' autocomplete='off' />`;
} 