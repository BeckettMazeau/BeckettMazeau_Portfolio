// three-lib.jsx - A minimal wrapper/export of THREE so we don't crash
// Since this is loaded via <script src="..."> it's on window.THREE already,
// but if files are expecting imports or globals, we set them here.
window.THREE = window.THREE || {};
