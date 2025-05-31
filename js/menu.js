// File ini KHUSUS untuk memuat menu menggunakan jQuery AJAX

$(document).ready(function () {
    // Path ke menu.json sudah benar karena relatif terhadap index.html
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

// Fungsi untuk setup animasi pada item menu
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