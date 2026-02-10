// GANTI DENGAN URL WEB APP ANDA DARI GOOGLE APPS SCRIPT
const API_URL = "https://script.google.com/macros/s/AKfycby7RIMLebAkTSZBEWag4SabGJYnTa5ZTZzfn9es4CHSEj5ctNhPsrsXZqILhy_gVKuKDw/exec";

function showPage(page) {
    const content = document.getElementById('content');
    content.innerHTML = ''; // Reset konten

    if (page === 'beranda') {
        const temp = document.getElementById('temp-beranda');
        content.appendChild(temp.content.cloneNode(true));
    } 
    else if (page === 'titipan' || page === 'kehilangan') {
        renderTabel(page);
    }
    else if (page === 'lapor') {
        const temp = document.getElementById('temp-lapor');
        content.appendChild(temp.content.cloneNode(true));
        handleFormSubmit();
    }
}

async function renderTabel(jenis) {
    const content = document.getElementById('content');
    const temp = document.getElementById('temp-tabel');
    content.appendChild(temp.content.cloneNode(true));
    
    document.getElementById('table-title').innerText = `Data Barang ${jenis.charAt(0).toUpperCase() + jenis.slice(1)}`;
    
    // Tampilkan Loading
    const tbody = document.getElementById('table-body');
    tbody.innerHTML = '<tr><td colspan="6">Memuat data...</td></tr>';

    try {
        const response = await fetch(`${API_URL}?jenis=${jenis === 'titipan' ? 'Titipan' : 'Kehilangan'}`);
        const data = await response.json();
        
        tbody.innerHTML = '';
        data.forEach(row => {
            const tr = document.createElement('tr');
            row.forEach(cell => {
                const td = document.createElement('td');
                td.innerText = cell;
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="6">Gagal memuat data.</td></tr>';
    }
}

function handleFormSubmit() {
    const form = document.getElementById('form-lapor');
    form.onsubmit = async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button');
        btn.disabled = true;
        btn.innerText = "Mengirim...";

        const payload = {
            jenis: document.getElementById('jenis').value,
            values: [
                document.getElementById('nama_barang').value,
                document.getElementById('detail').value,
                new Date().toLocaleDateString('id-ID'),
                document.getElementById('pelapor').value,
                document.getElementById('lokasi').value,
                "Pending"
            ]
        };

        try {
            await fetch(API_URL, {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            alert("Laporan berhasil terkirim!");
            form.reset();
        } catch (err) {
            alert("Terjadi kesalahan saat mengirim.");
        }
        btn.disabled = false;
        btn.innerText = "Kirim Laporan";
    };
}

// Jalankan beranda saat pertama kali buka
showPage('beranda');
