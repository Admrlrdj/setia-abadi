// File ini hanya berisi fungsionalitas umum situs

document.addEventListener('DOMContentLoaded', () => {

    // --- Logika untuk Navigasi Mobile dan Smooth Scroll ---
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Pindahkan logika ini ke sini agar tidak konflik
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            // Cek jika linknya hanya "#", arahkan ke atas
            if (targetId === '#') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Kalkulasi posisi scroll dengan offset dari tinggi header
                const headerOffset = document.querySelector('header').offsetHeight || 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }

            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    });


    // --- Logika untuk Tombol "Go to Top" ---
    const myButton = document.getElementById("myBtn");

    if (myButton) {
        window.onscroll = function () {
            scrollFunction();
        };

        function scrollFunction() {
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                myButton.style.display = "block";
            } else {
                myButton.style.display = "none";
            }
        }
    }
});

// Fungsi ini dibuat global agar bisa diakses dari atribut onclick di HTML
function topFunction() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}