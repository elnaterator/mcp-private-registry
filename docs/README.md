# Official Registry Documentation

## Project Documentation

[`design_principles.md`](./design_principles.md) - Core constraints and principles guiding the registry design

[`faq.md`](./faq.md) - Frequently asked questions about the MCP Registry

[`roadmap.md`](./roadmap.md) - High-level roadmap for the MCP Registry development

[`MCP Developers Summit 2025 - Registry Talk Slides.pdf`](./MCP%20Developers%20Summit%202025%20-%20Registry%20Talk%20Slides.pdf) - Slides from a talk given at the MCP Developers Summit on May 23, 2025, with an up-to-date vision of how we are thinking about the official registry.

## API & Technical Specifications

[`openapi.yaml`](./openapi.yaml) - OpenAPI specification for the official registry API

[`api_examples.md`](./api_examples.md) - Examples of what data will actually look like coming from the official registry API

[`architecture.md`](./architecture.md) - Technical architecture, deployment strategies, and data flows

[`server.json` README](./server-json/README.md) - description of the `server.json` purpose and schema

[`new_package_registry.md`](./new_package_registry.md) - steps to add a new package registry for local server packages

## CORS Configuration

The allowed origin for CORS can be configured using the `MCP_REGISTRY_CORS_ALLOWED_ORIGIN` environment variable. This controls which frontend origins are permitted to access the API from the browser.

- **Default:** `http://localhost:5173`
- **Usage:**
  ```sh
  export MCP_REGISTRY_CORS_ALLOWED_ORIGIN="http://your-frontend-domain.com"
  ```
  Then start the server as usual.

This is useful for local development (with Vite or other dev servers) and for production deployments where the frontend and backend may be on different domains.
