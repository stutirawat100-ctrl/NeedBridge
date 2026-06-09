// main.js — Category selection on homepage

const CATEGORY_META = {
  physically_challenged: {
    label: "Physically Challenged",
    icon: "♿"
  },
  underprivileged: {
    label: "Underprivileged",
    icon: "🏠"
  },
  senior_citizen: {
    label: "Senior Citizens",
    icon: "👴"
  },
  differently_abled_child: {
    label: "Differently Abled Children",
    icon: "🧒"
  }
};

function selectCategory(card) {
  // Highlight selected card
  document.querySelectorAll('.category-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');

  const category = card.getAttribute('data-category');

  // Save to sessionStorage so form.html can read it
  sessionStorage.setItem('nb_category', category);
  sessionStorage.setItem('nb_category_label', CATEGORY_META[category].label);
  sessionStorage.setItem('nb_category_icon', CATEGORY_META[category].icon);

  // Brief visual feedback, then navigate
  setTimeout(() => {
    window.location.href = 'form.html';
  }, 180);
}
