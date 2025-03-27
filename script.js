document.addEventListener("DOMContentLoaded", loadProducts);

let products = JSON.parse(localStorage.getItem("products")) || [];

const getElement = (id) => document.getElementById(id);

function addProduct() {
    const name = getElement("productName").value.trim();
    const price = parseFloat(getElement("productPrice").value);
    const inStock = parseInt(getElement("productStock").value);
    const category = getElement("productCategory").value.trim();

    if (!name || isNaN(price) || isNaN(inStock) || !category) {
        alert("กรุณากรอกข้อมูลให้ครบ");
        return;
    }

    const newProduct = {
        id: Date.now().toString(),
        name,
        price,
        inStock,
        category,
        minStock: 5,
        totalSales: 0
    };

    products.push(newProduct);
    saveProducts();
    loadProducts();
}

function loadProducts() {
    const productList = getElement("productList");
    const lowStockList = getElement("lowStockList");

    productList.innerHTML = "";
    lowStockList.innerHTML = "";

    products.forEach(product => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${product.name}</strong> - ${product.price} บาท - คงเหลือ: ${product.inStock}`;
        productList.appendChild(li);

        if (product.inStock < product.minStock) {
            const lowStockItem = document.createElement("li");
            lowStockItem.textContent = `⚠️ ${product.name} เหลือน้อย!`;
            lowStockList.appendChild(lowStockItem);
        }
    });
}

function updateStock(productId, quantity) {
    const product = products.find(p => p.id === productId);
    if (product) {
        product.inStock -= quantity;
        product.totalSales += quantity;
        saveProducts();
        loadProducts();
    }
}

function generateSalesReport() {
    let report = "📊 รายงานการขายสินค้า\n";
    let totalRevenue = 0;

    products.forEach(product => {
        const revenue = product.totalSales * product.price;
        totalRevenue += revenue;
        report += `📌 ${product.name} - ขายได้ ${product.totalSales} ชิ้น - ยอดขายรวม ${revenue} บาท\n`;
    });

    report += `\n💰 ยอดขายรวมทั้งหมด: ${totalRevenue} บาท`;

    getElement("salesReport").textContent = report;
}

function saveProducts() {
    localStorage.setItem("products", JSON.stringify(products));
}
