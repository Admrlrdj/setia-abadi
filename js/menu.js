$(document).ready(function () {
    let allMenuItems = []; // Variabel untuk menyimpan SEMUA item menu
    const menuContainer = $('#menu .menu');

    function initSlickSlider() {
        if (menuContainer.children().length > 0) {
            menuContainer.slick({
                dots: true,
                infinite: true,
                speed: 500,
                slidesToShow: 3,
                slidesToScroll: 1,
                autoplay: true,
                autoplaySpeed: 2000,
                pauseOnHover: true,
                pauseOnFocus: true,
                responsive: [{
                        breakpoint: 1024,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 1,
                            infinite: true,
                            dots: true
                        }
                    },
                    {
                        breakpoint: 600,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1
                        }
                    }
                ]
            });
        }
    }

    function renderMenu(items) {
        if (menuContainer.hasClass('slick-initialized')) {
            menuContainer.slick('unslick');
        }
        menuContainer.empty();

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

        initSlickSlider();
    }

    $.ajax({
        url: 'menu.json',
        dataType: 'json',
        success: function (data) {
            allMenuItems = data.menuItems; // Simpan semua menu untuk fitur pencarian

            // Filter hanya item yang merupakan top seller untuk ditampilkan di slider awal
            const topSellers = allMenuItems.filter(item => item.is_top_seller === true);

            renderMenu(topSellers);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Gagal memuat menu:", textStatus, errorThrown);
            menuContainer.html('<p class="menu-not-found" style="color:red;">Maaf, gagal memuat menu saat ini.</p>');
        }
    });

    function performSearch() {
        const searchTerm = $('#menu-search-input').val().toLowerCase();

        // Jika kotak pencarian kosong, tampilkan lagi top seller
        if (searchTerm === "") {
            const topSellers = allMenuItems.filter(item => item.is_top_seller === true);
            renderMenu(topSellers);
            return;
        }

        // Jika ada input, cari dari SEMUA menu
        const filteredItems = allMenuItems.filter(item => item.name.toLowerCase().includes(searchTerm));
        renderMenu(filteredItems);
    }

    $('#menu-search-input').on('input', performSearch);
    $('#menu-search-button').on('click', performSearch);
});

function setupMenuAnimation() {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.style.opacity = 1;
        item.style.transform = 'translateY(0)';
    });
}