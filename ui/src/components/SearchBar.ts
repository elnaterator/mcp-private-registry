export function SearchBar(onSearch?: (query: string) => void) {
  // Render the search bar
  setTimeout(() => {
    const input = document.getElementById('search-bar') as HTMLInputElement | null;
    if (input && onSearch) {
      let debounceTimer: number | undefined;
      let lastValue = '';
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          if (debounceTimer) clearTimeout(debounceTimer);
          onSearch(input.value.trim());
        }
      });
      input.addEventListener('input', () => {
        const value = input.value.trim();
        if (debounceTimer) clearTimeout(debounceTimer);
        if (value === '') {
          onSearch('');
          lastValue = '';
          return;
        }
        if (value.length < 3) {
          // Don't search, but if previously searched, reset
          if (lastValue.length >= 3) {
            onSearch('');
          }
          lastValue = value;
          return;
        }
        debounceTimer = window.setTimeout(() => {
          onSearch(value);
          lastValue = value;
        }, 700);
      });
    }
  }, 0);
  return `<input id='search-bar' class='border p-2 w-full rounded-lg' placeholder='Search MCP servers...' autocomplete='off' />`;
} 