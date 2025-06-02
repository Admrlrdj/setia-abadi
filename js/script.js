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

// Menu
$(document).ready(function () {
    $.ajax({
        url: 'menu.json',
        dataType: 'json',
        success: function (data) {
            const menuContainer = $('#menu .menu');
            if (!menuContainer.length) return; // Keluar jika container tidak ditemukan

            menuContainer.empty(); // Kosongkan container

            $.each(data.menuItems, function (index, item) {
                // Format harga ke Rupiah
                const formattedPrice = new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0
                }).format(item.price);

                // Buat elemen HTML untuk setiap item
                const menuItemHTML = `
                    <div class="menu-item">
                        <img src="${item.image_url}" alt="${item.alt_text}">
                        <div class="menu-item-content">
                            <h3>${item.name}</h3>
                            <p>${item.description}</p>
                            <div class="price">${formattedPrice}</div>
                        </div>
                    </div>
                `;
                menuContainer.append(menuItemHTML); // Tambahkan item ke container
            });

            // Setelah item dimuat, jalankan setup animasi
            setupMenuAnimation();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Gagal memuat menu:", textStatus, errorThrown);
            $('#menu .menu').html('<p style="text-align:center; color:red;">Maaf, gagal memuat menu saat ini.</p>');
        }
    });
});
// -Menu 

// Animasi Menu
function setupMenuAnimation() {
    const menuItems = document.querySelectorAll('.menu-item');
    if (!menuItems.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target); // Hentikan observasi setelah animasi berjalan
            }
        });
    }, {
        threshold: 0.1
    });

    menuItems.forEach(item => {
        item.style.opacity = 0;
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(item);
    });
}
// -Animasi Menu

// Searching
$(document).ready(function () {
    let allMenuItems = []; // Variabel untuk menyimpan semua data menu

    // Fungsi untuk menampilkan menu ke HTML
    function renderMenu(items) {
        const menuContainer = $('#menu .menu');
        menuContainer.empty(); // Selalu kosongkan container sebelum menampilkan hasil baru

        if (items.length === 0) {
            // Tampilkan pesan jika tidak ada item yang cocok
            menuContainer.html('<p class="menu-not-found">Menu yang Anda cari tidak ditemukan.</p>');
            return;
        }

        $.each(items, function (index, item) {
            // Format harga ke Rupiah
            const formattedPrice = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
            }).format(item.price);

            // Buat elemen HTML untuk setiap item
            const menuItemHTML = `
                <div class="menu-item">
                    <img src="${item.image_url}" alt="${item.alt_text}">
                    <div class="menu-item-content">
                        <h3>${item.name}</h3>
                        <p>${item.description}</p>
                        <div class="price">${formattedPrice}</div>
                    </div>
                </div>
            `;
            menuContainer.append(menuItemHTML); // Tambahkan item ke container
        });

        // Panggil kembali setup animasi setiap kali menu di-render ulang
        setupMenuAnimation();
    }

    // Mengambil data menu pertama kali
    $.ajax({
        url: 'menu.json',
        dataType: 'json',
        success: function (data) {
            allMenuItems = data.menuItems; // Simpan data asli ke variabel
            renderMenu(allMenuItems); // Tampilkan semua menu saat pertama kali dimuat
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Gagal memuat menu:", textStatus, errorThrown);
            $('#menu .menu').html('<p class="menu-not-found" style="color:red;">Maaf, gagal memuat menu saat ini.</p>');
        }
    });

    // PENCARIAN ---
    // Fungsi untuk melakukan filter
    function performSearch() {
        const searchTerm = $('#menu-search-input').val().toLowerCase(); // Ambil teks pencarian dan ubah ke huruf kecil

        // Filter 'allMenuItems' berdasarkan nama
        const filteredItems = allMenuItems.filter(function (item) {
            return item.name.toLowerCase().includes(searchTerm);
        });

        renderMenu(filteredItems); // Tampilkan hasil yang sudah difilter
    }

    // Tambahkan event listener untuk input (pencarian real-time)
    $('#menu-search-input').on('input', performSearch);

    // Tambahkan event listener untuk tombol (opsional, jika pengguna lebih suka klik)
    $('#menu-search-button').on('click', performSearch);

});

// Fungsi untuk setup animasi pada item menu (Tidak perlu diubah)
function setupMenuAnimation() {
    const menuItems = document.querySelectorAll('.menu-item');
    if (!menuItems.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    menuItems.forEach(item => {
        item.style.opacity = 0;
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(item);
    });
}

// File ini KHUSUS untuk memuat menu, mengelola slider, dan fitur pencarian

$(document).ready(function () {
    let allMenuItems = []; // Variabel untuk menyimpan semua data menu
    const menuContainer = $('#menu .menu');

    // Fungsi untuk menginisialisasi Slick Slider
    function initSlickSlider() {
        // Hanya inisialisasi jika ada item di dalam container
        if (menuContainer.children().length > 0) {
            menuContainer.slick({
                dots: true,
                infinite: false, // Set false agar tidak looping, lebih cocok untuk menu
                speed: 500,
                slidesToShow: 3, // Tampilkan 3 item di layar besar
                slidesToScroll: 3,
                responsive: [{
                        breakpoint: 1024, // Untuk tablet
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2,
                            infinite: true,
                            dots: true
                        }
                    },
                    {
                        breakpoint: 600, // Untuk mobile
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1
                        }
                    }
                ]
            });
        }
    }

    // Fungsi untuk menampilkan menu ke HTML
    function renderMenu(items) {
        // Hancurkan instance slick yang ada sebelum mengisi ulang item
        if (menuContainer.hasClass('slick-initialized')) {
            menuContainer.slick('unslick');
        }

        menuContainer.empty(); // Selalu kosongkan container

        if (items.length === 0) {
            menuContainer.html('<p class="menu-not-found">Menu yang Anda cari tidak ditemukan.</p>');
            return;
        }

        $.each(items, function (index, item) {
            const formattedPrice = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
            }).format(item.price);

            const menuItemHTML = `
                <div class="menu-item">
                    <img src="${item.image_url}" alt="${item.alt_text}">
                    <div class="menu-item-content">
                        <h3>${item.name}</h3>
                        <p>${item.description}</p>
                        <div class="price">${formattedPrice}</div>
                    </div>
                </div>
            `;
            menuContainer.append(menuItemHTML);
        });

        // Inisialisasi kembali slider dan animasi
        initSlickSlider();
        setupMenuAnimation();
    }

    // Mengambil data menu pertama kali
    $.ajax({
        url: 'menu.json',
        dataType: 'json',
        success: function (data) {
            allMenuItems = data.menuItems;
            renderMenu(allMenuItems);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Gagal memuat menu:", textStatus, errorThrown);
            menuContainer.html('<p class="menu-not-found" style="color:red;">Maaf, gagal memuat menu saat ini.</p>');
        }
    });

    // --- LOGIKA PENCARIAN ---
    function performSearch() {
        const searchTerm = $('#menu-search-input').val().toLowerCase();
        const filteredItems = allMenuItems.filter(item => item.name.toLowerCase().includes(searchTerm));
        renderMenu(filteredItems);
    }

    $('#menu-search-input').on('input', performSearch);
    $('#menu-search-button').on('click', performSearch);
});

// Fungsi untuk setup animasi (Tidak perlu diubah)
// Animasi ini mungkin tidak akan terlihat jelas karena item di-load oleh slider,
// tapi tetap kita pasang jika diperlukan.
function setupMenuAnimation() {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.style.opacity = 1;
        item.style.transform = 'translateY(0)';
    });
}