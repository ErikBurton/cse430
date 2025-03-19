// utilities/index.js
module.exports = {
    // This async function returns a navigation HTML string.
    getNav: async function () {
      // Customize your navigation links as needed.
      const navHtml = `
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </nav>`;
      return navHtml;
    }
  };
  