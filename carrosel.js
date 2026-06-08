const carousel = new bootstrap.Carousel(document.getElementById('myCarousel'), {
  interval: 3000,
  ride: 'carousel'
});

function togglePerfil() {
    var d = document.getElementById('perfil_dropdown');
    d.classList.toggle('aberto');
}

document.addEventListener('click', function(e) {
    var wrapper = document.querySelector('.perfil_wrapper');
    if (wrapper && !wrapper.contains(e.target)) {
        document.getElementById('perfil_dropdown').classList.remove('aberto');
    }
});
