/**
 * Tim Dixon Design System — theme bootstrap.
 *
 * Drop this file into any project as the FIRST thing in <head>, BEFORE
 * any <link rel="stylesheet"> or <style>. It sets data-theme on <html>
 * synchronously so there is never a flash of the wrong palette.
 *
 *   <script src="theme.js"></script>
 *
 * FOUR REQUIRED THEMES — every surface must support all four:
 *   "light"        vivid identity, WARN-level   (default in light OS)
 *   "dark"         vivid identity, WARN-level   (default in dark OS)
 *   "muted-light"  fully compliant, all SAFE/PASS
 *   "muted-dark"   fully compliant, all SAFE/PASS
 *
 * Persistence key: localStorage["td-theme"] holds the chosen theme.
 * No saved preference -> vivid palette following the OS colour scheme.
 *
 * Helpers exposed on window.tdTheme:
 *   .set(name)      set + persist one of the four theme names
 *   .get()          current theme name
 *   .toggleMode()   flip light <-> dark within the current family
 *   .toggleFamily() flip vivid <-> muted within the current mode
 */
(function () {
  var THEMES = ['light', 'dark', 'muted-light', 'muted-dark'];
  var root = document.documentElement;

  function resolve() {
    var saved = localStorage.getItem('td-theme');
    if (THEMES.indexOf(saved) !== -1) return saved;
    var dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return dark ? 'dark' : 'light';
  }

  function apply(name) {
    if (THEMES.indexOf(name) === -1) name = 'light';
    root.dataset.theme = name;
    return name;
  }

  apply(resolve());

  window.tdTheme = {
    themes: THEMES,
    get: function () { return root.dataset.theme || 'light'; },
    set: function (name) {
      var applied = apply(name);
      localStorage.setItem('td-theme', applied);
      return applied;
    },
    toggleMode: function () {
      var cur = this.get();
      var next = cur.indexOf('light') !== -1
        ? cur.replace('light', 'dark')
        : cur.replace('dark', 'light');
      return this.set(next);
    },
    toggleFamily: function () {
      var cur = this.get();
      var next = cur.indexOf('muted') !== -1
        ? cur.replace('muted-', '')
        : 'muted-' + cur;
      return this.set(next);
    }
  };
}());
