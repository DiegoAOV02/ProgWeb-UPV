document.addEventListener("DOMContentLoaded", function() {
    var imagenes = document.querySelectorAll('.imagen');
    imagenes.forEach(function(imagen) {
      imagen.addEventListener('click', function() {
        var texto = this.nextElementSibling;
        if (texto.style.display === 'none') {
          texto.style.display = 'block';
        } else {
          texto.style.display = 'none';
        }
      });
    });
  });
  