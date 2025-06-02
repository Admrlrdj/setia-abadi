$(document).ready(function () {
    const menuSection = $('#full-menu-page');

    function renderFullMenu(items) {
        if (!items || items.length === 0) {
            menuSection.append('<p class="menu-not-found">Tidak ada menu yang tersedia saat ini.</p>');
            return;
        }

        // Mengelompokkan item berdasarkan kategori menggunakan .reduce()
        const groupedMenu = items.reduce((acc, item) => {
            const category = item.category || 'Lainnya';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(item);
            return acc;
        }, {});

        for (const category in groupedMenu) {
            const categoryTitleHTML = `<h2 class="menu-category-title">${category}</h2>`;
            menuSection.append(categoryTitleHTML);

            const menuGrid = $('<div class="menu-grid"></div>');
            groupedMenu[category].forEach(item => {
                const formattedPrice = new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0
                }).format(item.price);

                const menuItemHTML = `
                    <div class="gallery-item">
                        <img src="${item.image_url}" alt="${item.alt_text}">
                        <div class="gallery-item-info">
                            <h3>${item.name}</h3>
                            <span class="price">${formattedPrice}</span>
                        </div>
                    </div>
                `;
                menuGrid.append(menuItemHTML);
            });
            menuSection.append(menuGrid);
        }
    }

    $.ajax({
        url: 'menu.json',
        dataType: 'json',
        success: function (data) {
            renderFullMenu(data.menuItems);
        },
        error: function (err) {
            console.error("Gagal memuat menu:", err);
            menuSection.append('<p class="menu-not-found" style="color:red;">Maaf, gagal memuat menu.</p>');
        }
    });
});