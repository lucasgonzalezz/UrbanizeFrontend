
  document.addEventListener('DOMContentLoaded', function () {
    // Obtén referencias a los elementos relevantes
    const mobileMenuButton = document.querySelector('[data-collapse-toggle="navbar-default"]');
    const mobileMenu = document.getElementById('navbar-default');

    // Agrega un evento de clic al botón del menú móvil
    mobileMenuButton.addEventListener('click', function () {
      // Alterna la visibilidad del menú móvil
      mobileMenu.hidden = !mobileMenu.hidden;
    });
  });

