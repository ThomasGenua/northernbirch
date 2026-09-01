// Build-time rendering. scripts/generate-seo-files.mjs calls render() once per
// route and writes the markup into that route's HTML, so a crawler -- or a
// member on a slow connection -- sees the page before any JavaScript runs.
import React from 'react';
import { prerender } from 'react-dom/static';
import { renderToString } from 'react-dom/server';
import App from './App.jsx';
import { ErrorBoundary } from './ui.jsx';

const tree = (path) => <ErrorBoundary full><App ssrPath={path} /></ErrorBoundary>;

// Warm the route's chunk. The pages are code-split with lazy(), which suspends
// the first time it is asked for a component even when the module is already
// in memory -- there is a promise to await before it can answer. prerender is
// the renderer that can wait for that; we throw its output away.
const warm = async (path) => {
  const { prelude } = await prerender(tree(path), { onError(e) { throw e; } });
  const reader = prelude.getReader();
  for (;;) { const { done } = await reader.read(); if (done) break; }
};

export async function render(path) {
  await warm(path);
  // Then render synchronously. renderToString cannot wait for anything -- which
  // is the point: everything it needs is already resolved, and unlike the
  // streaming renderers it writes the page where it belongs instead of leaving
  // a placeholder and appending the content at the end of the document with a
  // script to swap them over. That shape is right for a live server and wrong
  // for a file a crawler reads top to bottom.
  return renderToString(tree(path));
}
