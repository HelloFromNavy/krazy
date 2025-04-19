console.log("script.js loaded");

document.addEventListener('DOMContentLoaded', () => {
  const clock = document.getElementById('clock');
  const body = document.body;
  const searchInput = document.getElementById('search');
  const iconGrid = document.getElementById('iconGrid');
  const editModeBtn = document.getElementById('editToggle');
  let editMode = false;

  const defaultIcons = [
    { url: 'https://youtube.com', title: 'YouTube', icon: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/youtube.svg' },
    { url: 'https://reddit.com', title: 'Reddit', icon: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/reddit.svg' },
    { url: 'https://mail.google.com', title: 'Gmail', icon: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/gmail.svg' },
    { url: 'https://twitter.com', title: 'Twitter', icon: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/twitter.svg' },
    { url: 'https://wikipedia.org', title: 'Wikipedia', icon: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/wikipedia.svg' },
    { url: 'https://github.com', title: 'GitHub', icon: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/github.svg' },
    { url: 'https://drive.google.com', title: 'Drive', icon: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/googledrive.svg' },
    { url: 'https://news.google.com', title: 'News', icon: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/googlenews.svg' }
  ];

  const loadIcons = () => {
    const savedIcons = JSON.parse(localStorage.getItem('icons'));
    return savedIcons || defaultIcons;
  };

  const saveIcons = (icons) => {
    localStorage.setItem('icons', JSON.stringify(icons));
  };

  const displayIcons = (icons) => {
    iconGrid.innerHTML = '';
    icons.forEach((icon, index) => {
      const a = document.createElement('a');
      a.href = icon.url;
      a.title = icon.title;
      const img = document.createElement('img');
      img.src = icon.icon;
      img.alt = icon.title;
      a.appendChild(img);
      if (editMode) {
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'X';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.onclick = (e) => {
          e.preventDefault();
          icons.splice(index, 1);
          saveIcons(icons);
          displayIcons(icons);
        };
        a.appendChild(deleteBtn);
      }
      iconGrid.appendChild(a);
    });
  };

  editModeBtn.addEventListener('click', () => {
    editMode = !editMode;
    console.log('Edit mode:', editMode);
    displayIcons(loadIcons());
  });

  function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHour = (hours % 12 || 12);
    clock.textContent = `${displayHour}:${minutes} ${ampm}`;

    if (hours >= 6 && hours < 18) {
      body.classList.remove('dark');
    } else {
      body.classList.add('dark');
    }
  }

  function fetchSearchSuggestions(query) {
    if (!query) return Promise.resolve([]);
    const url = `https://duckduckgo.com/ac/?q=${query}`;
    return fetch(url)
      .then((response) => response.json())
      .then((data) => data.map(item => item.phrase))
      .catch(() => []);
  }

  const showSearchSuggestions = (suggestions) => {
    const suggestionBox = document.getElementById('suggestions');
    suggestionBox.innerHTML = '';
    suggestions.forEach(suggestion => {
      const div = document.createElement('div');
      div.textContent = suggestion;
      div.addEventListener('click', () => {
        searchInput.value = suggestion;
        suggestionBox.innerHTML = '';
      });
      suggestionBox.appendChild(div);
    });
  };

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value;
    fetchSearchSuggestions(query).then((suggestions) => {
      showSearchSuggestions(suggestions);
    });
  });

  updateClock();
  setInterval(updateClock, 1000);
  saveIcons(loadIcons()); // one-time save if empty
  displayIcons(loadIcons());
});
