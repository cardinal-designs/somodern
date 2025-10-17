# Base Theme

### Dependencies
- [Shopify CLI](https://shopify.dev/docs/themes/tools/cli)
- [TailwindCSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/guide/)
- [Shopify Vite Plugin](https://shopify-vite.barrelny.com/)

### Setup
We are using the Vite Plugin for Shopify. [Learn more here.](https://shopify-vite.barrelny.com/guide/)

### First time setup

Install dependencies:
```
$ npm install
```

### Local Devlopment

Run dev server with hot reload (accepts all [theme commands](https://shopify.dev/docs/api/shopify-cli/theme/theme-push)):
```
$ npm run dev -- --store ohaei --live-reload hot-reload
```

This will run both `shopify theme dev` and `vite:dev` to start the shopify server and vite compilation.


### Publish

Deploy theme store as new theme. Accepts all `shopify theme push` commands and does _not_ allow pushing to live. 
```
$ npm run deploy -- --store ohaei 
```
