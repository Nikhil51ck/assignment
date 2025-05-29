/**
 * This file includes polyfills needed by Angular when running in Node environment for SSR.
 */
(globalThis as any).ngJest = true;  // Prevent Zone.js from patching node's native async APIs
import 'zone.js/node';
import 'zone.js/plugins/zone-node';
import '@angular/platform-server/init';
