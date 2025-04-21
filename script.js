// CLOCK
const clockContainer = document.querySelector('.branding-clock');
clockContainer.innerHTML = `
  <svg viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="48" stroke="#ccc" stroke-width="4" fill="#fff" />
    <line id="hour-hand" x1="50" y1="50" x2="50" y2="30" stroke="#333" stroke-width="4" stroke-linecap="round" />
    <line id="minute-hand" x1="50" y1="50" x2="50" y2="20" stroke="#333" stroke-width="3" stroke-linecap="round" />
    <line id="second-hand" x1="50" y1="50" x2="50" y2="15" stroke="#e33" stroke-width="2" stroke-linecap="round" />
    <circle cx="50" cy="50" r="2" fill="#333" />
  </svg>
`;

function updateClock() {
  const now = new Date();
  const sec = now.getSeconds();
  const min = now.getMinutes();
  const hr = now.getHours();
  document.getElementById('second-hand').setAttribute('transform', `rotate(${sec * 6} 50 50)`);
  document.getElementById('minute-hand').setAttribute('transform', `rotate(${min * 6 + sec * 0.1} 50 50)`);
  document.getElementById('hour-hand').setAttribute('transform', `rotate(${(hr % 12 + min / 60) * 30} 50 50)`);
}

function updateClockColors() {
  const isDarkMode = document.body.classList.contains('dark');
  const clockElements = {
    'circle:first-child': { stroke: isDarkMode ? '#444' : '#ccc', fill: isDarkMode ? '#222' : '#fff' },
    '#hour-hand, #minute-hand': { stroke: isDarkMode ? '#ddd' : '#333' },
    'circle:last-child': { fill: isDarkMode ? '#ddd' : '#333' }
  };
  
  for (const [selector, styles] of Object.entries(clockElements)) {
    const elements = clockContainer.querySelectorAll(selector);
    elements.forEach(el => {
      for (const [attr, value] of Object.entries(styles)) {
        el.setAttribute(attr, value);
      }
    });
  }
}

setInterval(updateClock, 1000);

// QUICK LINKS
const getLinks = () => JSON.parse(localStorage.getItem('quickLinks') || '[]');

function loadLinks() {
  const container = document.getElementById('quickLinksContainer');
  container.innerHTML = '';
  getLinks().forEach(link => {
    const a = document.createElement('a');
    a.className = 'quick-link';
    a.href = link.url;
    a.innerHTML = `
      <img src="${link.icon}" alt="${link.name}" onerror="this.src='default-icon.png'">
      <span>${link.name}</span>`;
    container.appendChild(a);
  });
}

function deleteLink(index) {
  const links = getLinks();
  links.splice(index, 1);
  localStorage.setItem('quickLinks', JSON.stringify(links));
  loadLinks();
  updateDarkModeStyles();
  toggleSettings.click();
}

function addNewLink() {
  const newName = document.getElementById('new-name');
  const newURL = document.getElementById('new-url');
  const newIcon = document.getElementById('new-icon');
  
  const name = newName.value.trim();
  const url = newURL.value.trim();
  const icon = newIcon.value.trim();
  
  if (!name || !url) return;
  
  const links = getLinks();
  links.push({ name, url, icon });
  localStorage.setItem('quickLinks', JSON.stringify(links));
  loadLinks();
  updateDarkModeStyles();
  toggleSettings.click();
  
  newName.value = newURL.value = newIcon.value = '';
  newName.focus();
}

// SETTINGS SIDEBAR
const toggleSettings = document.getElementById('toggleSettings');
toggleSettings.onclick = () => {
  document.getElementById('settingsSidebar').classList.add('active');
  const editor = document.getElementById('linksEditor');
  editor.innerHTML = '';
  getLinks().forEach((link, index) => {
    const entryDiv = document.createElement('div');
    entryDiv.className = 'editor-entry';
    if (document.body.classList.contains('dark')) {
      entryDiv.classList.add('dark');
    }
    
    entryDiv.innerHTML = `
      <input type="text" id="name-${index}" value="${link.name}" placeholder="Name">
      <input type="text" id="url-${index}" value="${link.url}" placeholder="URL">
      <input type="text" id="icon-${index}" value="${link.icon}" placeholder="Icon URL">
      <button class="delete-btn" onclick="deleteLink(${index})">Delete</button>
    `;
    editor.appendChild(entryDiv);
  });
  
  const addEntryDiv = document.createElement('div');
  addEntryDiv.className = 'add-entry';
  if (document.body.classList.contains('dark')) {
    addEntryDiv.classList.add('dark');
  }
  
  addEntryDiv.innerHTML = `
    <h4>Add New Link</h4>
    <input type="text" id="new-name" placeholder="Name">
    <input type="text" id="new-url" placeholder="URL">
    <input type="text" id="new-icon" placeholder="Icon URL">
    <button onclick="addNewLink()">Add Link</button>
  `;
  editor.appendChild(addEntryDiv);
  
  updateDarkModeStyles();
};

document.getElementById('closeSidebar').onclick = () =>
  document.getElementById('settingsSidebar').classList.remove('active');

document.getElementById('saveLinks').onclick = () => {
  const editor = document.getElementById('linksEditor');
  const entries = editor.querySelectorAll('.editor-entry');
  const links = [];
  
  entries.forEach(entry => {
    const inputs = entry.querySelectorAll('input');
    const name = inputs[0].value.trim();
    const url = inputs[1].value.trim();
    const icon = inputs[2].value.trim();
    
    if (name && url) {
      links.push({ name, url, icon });
    }
  });
  
  localStorage.setItem('quickLinks', JSON.stringify(links));
  loadLinks();
  updateDarkModeStyles();
  document.getElementById('settingsSidebar').classList.remove('active');
};

// SEARCH
const searchInput = document.getElementById('searchInput');
const searchForm = document.getElementById('searchForm');
searchForm.onsubmit = e => {
  e.preventDefault();
  const input = searchInput.value.trim();
  const isURL = /^(https?:\/\/)?([\w\d\.-]+)\.([a-z]{2,})(\/.*)?$/i.test(input);
  location.href = isURL ? (input.startsWith('http') ? input : 'https://' + input) : 
    `https://www.google.com/search?q=${encodeURIComponent(input)}`;
};

// DEFAULT LINKS
function resetToDefaults() {
  const defaultLinks = [
    { name: "Google", url: "https://google.com", icon: "https://google.com/favicon.ico" },
    { name: "YouTube", url: "https://youtube.com", icon: "https://youtube.com/favicon.ico" },
    { name: "Reddit", url: "https://reddit.com", icon: "https://reddit.com/favicon.ico" },
  ];
  localStorage.setItem('quickLinks', JSON.stringify(defaultLinks));
  loadLinks();
  updateDarkModeStyles();
  toggleSettings.click();
}

// DARK MODE
function toggleDarkMode() {
  document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', document.body.classList.contains('dark'));
  updateDarkModeStyles();
  updateClockColors();
}

function updateDarkModeStyles() {
  const isDark = document.body.classList.contains('dark');
  
  // Update sidebar elements
  const sidebarElements = document.querySelectorAll('.editor-entry, .add-entry');
  sidebarElements.forEach(el => {
    el.classList.toggle('dark', isDark);
  });
  
  // Update inputs
  document.querySelectorAll('input').forEach(el => {
    el.classList.toggle('dark', isDark);
  });
  
  // Update buttons (except those with specific classes)
  document.querySelectorAll('button:not(.delete-btn):not(.settings-toggle)').forEach(el => {
    el.classList.toggle('dark', isDark);
  });
  
  // Update quick links
  document.querySelectorAll('.quick-link').forEach(el => {
    el.classList.toggle('dark', isDark);
  });
}

// INIT
window.onload = () => {
  updateClock();
  loadLinks();
  
  // Check for dark mode preference
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark');
    updateDarkModeStyles();
    updateClockColors();
  }
  
  // Set initial colors for clock
  updateClockColors();
};

// Add this to your script.js file

// Function to check system preference
function checkSystemThemePreference() {
    // Check if the browser supports prefers-color-scheme
    if (window.matchMedia) {
      // Check if the system preference is dark
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      // Set the theme based on system preference
      if (prefersDarkMode) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
      
      // Update styles for dark mode
      updateDarkModeStyles();
      updateClockColors();
      
      // Save the current preference to localStorage
      localStorage.setItem('darkMode', prefersDarkMode);
      localStorage.setItem('useSystemPreference', 'true');
    }
  }
  
  // Function to listen for system theme changes
  function listenForSystemThemeChanges() {
    if (window.matchMedia) {
      const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      // Modern browsers: Add event listener for theme changes
      if (colorSchemeQuery.addEventListener) {
        colorSchemeQuery.addEventListener('change', (e) => {
          // Only update if we're using system preference
          if (localStorage.getItem('useSystemPreference') === 'true') {
            document.body.classList.toggle('dark', e.matches);
            updateDarkModeStyles();
            updateClockColors();
            localStorage.setItem('darkMode', e.matches);
          }
        });
      } 
      // Older browsers: Use deprecated addListener
      else if (colorSchemeQuery.addListener) {
        colorSchemeQuery.addListener((e) => {
          // Only update if we're using system preference
          if (localStorage.getItem('useSystemPreference') === 'true') {
            document.body.classList.toggle('dark', e.matches);
            updateDarkModeStyles();
            updateClockColors();
            localStorage.setItem('darkMode', e.matches);
          }
        });
      }
    }
  }
  
  // Modify the toggleDarkMode function to override system preference
  function toggleDarkMode() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    
    // Update localStorage and disable system preference
    localStorage.setItem('darkMode', isDark);
    localStorage.setItem('useSystemPreference', 'false');
    
    // Update styles
    updateDarkModeStyles();
    updateClockColors();
  }
  
  // Add a function to reset to system preference
  function resetToSystemPreference() {
    localStorage.setItem('useSystemPreference', 'true');
    checkSystemThemePreference();
  }
  
  // Modify window.onload function
  window.onload = () => {
    updateClock();
    loadLinks();
    
    // Check if user wants to use system preference
    const useSystemPreference = localStorage.getItem('useSystemPreference');
    
    if (useSystemPreference === null || useSystemPreference === 'true') {
      // First time visit or system preference is enabled
      checkSystemThemePreference();
      listenForSystemThemeChanges();
    } else {
      // User has manually set preference, use that
      if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
      updateDarkModeStyles();
      updateClockColors();
    }
  };

  function initSiteStats() {
    if (!localStorage.getItem('siteStats')) {
      localStorage.setItem('siteStats', JSON.stringify({}));
    }
    return JSON.parse(localStorage.getItem('siteStats'));
  }
  
  // Track when a site is visited through the search or quick links
  function trackSiteVisit(url) {
    try {
      // Extract domain from URL
      let domain = url;
      if (url.startsWith('http')) {
        domain = new URL(url).hostname;
      } else if (url.includes('/')) {
        domain = url.split('/')[0];
      }
      
      // Skip tracking for search engines
      if (domain.includes('google.com/search') || 
          domain.includes('bing.com/search') || 
          domain.includes('duckduckgo.com')) {
        return;
      }
      
      // Get current stats
      const stats = initSiteStats();
      
      // Update visit count
      if (!stats[domain]) {
        stats[domain] = {
          visits: 1,
          lastVisit: Date.now(),
          totalTimeSpent: 0,
          icon: getFaviconUrl(domain)
        };
      } else {
        stats[domain].visits += 1;
        stats[domain].lastVisit = Date.now();
      }
      
      // Save updated stats
      localStorage.setItem('siteStats', JSON.stringify(stats));
      
      // Start tracking time spent (saved in session storage)
      sessionStorage.setItem('lastSiteVisited', domain);
      sessionStorage.setItem('lastVisitTime', Date.now().toString());
    } catch (e) {
      console.error("Error tracking site visit:", e);
    }
  }
  
  // Update time spent when returning to new tab page
  function updateTimeSpent() {
    const lastSite = sessionStorage.getItem('lastSiteVisited');
    const lastTime = parseInt(sessionStorage.getItem('lastVisitTime') || '0');
    
    if (lastSite && lastTime) {
      const stats = initSiteStats();
      if (stats[lastSite]) {
        const timeSpent = Date.now() - lastTime;
        // Only count if reasonable (less than 30 minutes = 1,800,000 ms)
        if (timeSpent > 0 && timeSpent < 1800000) {
          stats[lastSite].totalTimeSpent = (stats[lastSite].totalTimeSpent || 0) + timeSpent;
          localStorage.setItem('siteStats', JSON.stringify(stats));
        }
      }
      
      // Clear session data
      sessionStorage.removeItem('lastSiteVisited');
      sessionStorage.removeItem('lastVisitTime');
    }
  }
  
  // Helper to get favicon URL
  function getFaviconUrl(domain) {
    return `https://${domain}/favicon.ico`;
  }
  
  // Get top sites based on visits or time spent
  function getTopSites(metric = 'visits', limit = 5) {
    const stats = initSiteStats();
    
    // Convert object to array for sorting
    const sites = Object.keys(stats).map(domain => ({
      domain,
      ...stats[domain]
    }));
    
    // Sort based on metric
    if (metric === 'visits') {
      sites.sort((a, b) => b.visits - a.visits);
    } else if (metric === 'recent') {
      sites.sort((a, b) => b.lastVisit - a.lastVisit);
    } else if (metric === 'timeSpent') {
      sites.sort((a, b) => b.totalTimeSpent - a.totalTimeSpent);
    }
    
    // Return top sites
    return sites.slice(0, limit);
  }
  
  // Format time spent in human-readable format
  function formatTimeSpent(ms) {
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }
  
  // Display top sites
  function displayTopSites(container, metric = 'visits') {
    const topSites = getTopSites(metric);
    
    // Create header
    const header = document.createElement('h3');
    header.className = 'most-visited-header';
    
    switch(metric) {
      case 'visits':
        header.textContent = 'Most Visited';
        break;
      case 'recent':
        header.textContent = 'Recently Visited';
        break;
      case 'timeSpent':
        header.textContent = 'Most Time Spent';
        break;
    }
    
    // Create sites list
    const sitesList = document.createElement('div');
    sitesList.className = 'most-visited-sites';
    
    // Add sites
    topSites.forEach(site => {
      const siteElement = document.createElement('a');
      siteElement.className = 'most-visited-site';
      siteElement.href = `https://${site.domain}`;
      siteElement.onclick = () => trackSiteVisit(site.domain);
      
      // Create stat label based on metric
      let statLabel = '';
      if (metric === 'visits') {
        statLabel = `${site.visits} visits`;
      } else if (metric === 'recent') {
        const days = Math.floor((Date.now() - site.lastVisit) / (1000 * 60 * 60 * 24));
        statLabel = days === 0 ? 'Today' : days === 1 ? 'Yesterday' : `${days} days ago`;
      } else if (metric === 'timeSpent') {
        statLabel = formatTimeSpent(site.totalTimeSpent);
      }
      
      siteElement.innerHTML = `
        <img src="${site.icon}" onerror="this.src='default-icon.png'" alt="${site.domain}">
        <div class="site-info">
          <span class="site-domain">${site.domain.replace(/^www\./, '')}</span>
          <span class="site-stats">${statLabel}</span>
        </div>
      `;
      
      sitesList.appendChild(siteElement);
    });
    
    // Clear and append to container
    container.innerHTML = '';
    container.appendChild(header);
    container.appendChild(sitesList);
  }
  
  // Update search form to track visits
  const originalSearchSubmit = searchForm.onsubmit;
  searchForm.onsubmit = e => {
    e.preventDefault();
    const input = searchInput.value.trim();
    const isURL = /^(https?:\/\/)?([\w\d\.-]+)\.([a-z]{2,})(\/.*)?$/i.test(input);
    
    // Track the visit before navigating
    if (isURL) {
      trackSiteVisit(input);
    }
    
    // Call the original handler
    const url = isURL ? (input.startsWith('http') ? input : 'https://' + input) : 
      `https://www.google.com/search?q=${encodeURIComponent(input)}`;
    
    location.href = url;
  };
  
  // Update Quick Links to track visits
  const originalLoadLinks = loadLinks;
  loadLinks = function() {
    originalLoadLinks();
    
    // Add click tracking to all quick links
    document.querySelectorAll('.quick-link').forEach(link => {
      const originalHref = link.href;
      link.addEventListener('click', () => {
        trackSiteVisit(originalHref);
      });
    });
  };
  
  // Create and add the most visited sites section to HTML
  function addMostVisitedSection() {
    const container = document.createElement('div');
    container.id = 'mostVisitedContainer';
    container.className = 'most-visited-container';
    
    // Create tabs for different metrics
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'most-visited-tabs';
    
    const metrics = [
      { id: 'visits', label: 'Most Visited' },
      { id: 'recent', label: 'Recent' },
      { id: 'timeSpent', label: 'Time Spent' }
    ];
    
    metrics.forEach(metric => {
      const tab = document.createElement('button');
      tab.className = 'most-visited-tab';
      tab.textContent = metric.label;
      tab.onclick = () => {
        // Update active tab
        document.querySelectorAll('.most-visited-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Display sites for selected metric
        displayTopSites(sitesContainer, metric.id);
        
        // Save preference
        localStorage.setItem('preferredMetric', metric.id);
      };
      
      tabsContainer.appendChild(tab);
    });
    
    // Create container for sites
    const sitesContainer = document.createElement('div');
    sitesContainer.className = 'most-visited-content';
    
    // Add to main container
    container.appendChild(tabsContainer);
    container.appendChild(sitesContainer);
    
    // Insert after quick links
    const quickLinks = document.getElementById('quickLinksContainer');
    quickLinks.parentNode.insertBefore(container, quickLinks.nextSibling);
    
    // Set default active tab based on preference
    const preferredMetric = localStorage.getItem('preferredMetric') || 'visits';
    const defaultTab = tabsContainer.querySelector(`button:nth-child(${metrics.findIndex(m => m.id === preferredMetric) + 1})`);
    if (defaultTab) {
      defaultTab.click();
    } else {
      tabsContainer.querySelector('button').click(); // First tab as fallback
    }
  }
  
  // Modified window.onload to include most visited sites
  window.onload = function() {
    updateClock();
    loadLinks();
    
    // Check if user wants to use system preference for dark mode
    const useSystemPreference = localStorage.getItem('useSystemPreference');
    
    if (useSystemPreference === null || useSystemPreference === 'true') {
      checkSystemThemePreference();
      listenForSystemThemeChanges();
    } else {
      if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
      updateDarkModeStyles();
      updateClockColors();
    }
    
    // Update time spent for the last site visited
    updateTimeSpent();
    
    // Add most visited sites section
    addMostVisitedSection();
  };
