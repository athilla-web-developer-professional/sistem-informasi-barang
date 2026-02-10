const SCRIPT_URL = "https://script.google.com/macros/s/AKfycby7RIMLebAkTSZBEWag4SabGJYnTa5ZTZzfn9es4CHSEj5ctNhPsrsXZqILhy_gVKuKDw/exec"; // Tempel URL dari Apps Script

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById(pageId).style.display = 'block';
}

async function loadData(type) {
    showPage('data-view');
    document.getElementById('table-title').innerText = "Data Barang " + type;
    const tbody = document.getElementById('tableBody');
    const thead = document.getElementById('tableHead');
    tbody.innerHTML = "<tr><td colspan='5'>Memuat data...</td></tr>";

    try {
        const response = await fetch(`${SCRIPT_URL}?sheet=${type}`);
        const data = await response.json();
        
        // Render Header & Body
        if (data.length > 0) {
            thead.innerHTML = Object.keys(data[0]).map(k => `<th>${k}</th>`).join('');
            tbody.innerHTML = data.map(row => 
                `<tr>${Object.values(row).map(v => `<td>${v}</td>`).join('')}</tr>`
            ).join('');
        }
    } catch (e) {
        tbody.innerHTML = "Gagal mengambil data.";
    }
}

document.getElementById('reportForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.innerText = "Mengirim...";
    btn.disabled = true;

    const payload = [
        document.getElementById('nama_barang').value,
        document.getElementById('detail').value,
        new Date().toLocaleDateString('id-ID'),
        document.getElementById('pelapor').value,
        document.getElementById('lokasi').value,
        "Aktif"
    ];

    try {
        await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify({ jenis: document.getElementById('jenis').value, payload: payload })
        });
        alert("Laporan berhasil terkirim!");
        e.target.reset();
        showPage('beranda');
    } catch (e) {
        alert("Terjadi kesalahan.");
    } finally {
        btn.innerText = "Kirim Laporan";
        btn.disabled = false;
    }
});

function searchTable() {
    let input = document.getElementById("searchInput").value.toUpperCase();
    let rows = document.getElementById("tableBody").getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
        rows[i].style.display = rows[i].innerText.toUpperCase().includes(input) ? "" : "none";
    }
}
