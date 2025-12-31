const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

// 1. Lấy dữ liệu từ LocalStorage (nếu có)
const localStorageTransactions = JSON.parse(
  localStorage.getItem('transactions')
);

// Nếu chưa có dữ liệu thì dùng mảng rỗng
let transactions =
  localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Biến để lưu ID đang chỉnh sửa
let editingId = null;

// 1.1. Thêm format số tiền khi nhập (hiển thị dấu phẩy)
amount.addEventListener('input', (e) => {
  // Lấy giá trị và xóa tất cả dấu phẩy cũ
  let value = e.target.value.replace(/,/g, '');
  
  // Nếu có giá trị và là số
  if (value && !isNaN(value)) {
    // Format với dấu phẩy
    const formatted = Number(value).toLocaleString('en-US');
    e.target.value = formatted;
  }
});

// 2. Hàm thêm giao dịch mới
function addTransaction(e) {
  e.preventDefault(); // Chặn việc load lại trang của form

  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('Vui lòng nhập đầy đủ nội dung và số tiền');
  } else {
    // Lấy loại giao dịch từ nút radio
    const type = document.querySelector('input[name="type"]:checked').value;
    
    // Xóa dấu phẩy trước khi lưu
    const cleanAmount = amount.value.replace(/,/g, '');
    
    // Chuyển đổi số tiền: nếu là chi tiêu thì nhân với -1
    const finalAmount = type === 'expense' ? -Math.abs(+cleanAmount) : Math.abs(+cleanAmount);
    
    // Nếu đang chỉnh sửa
    if (editingId !== null) {
      // Tìm và cập nhật giao dịch
      const index = transactions.findIndex(t => t.id === editingId);
      if (index !== -1) {
        transactions[index].text = text.value;
        transactions[index].amount = finalAmount;
      }
      editingId = null;
      document.querySelector('.btn').textContent = 'Thêm Giao Dịch';
    } else {
      // Thêm giao dịch mới
      const transaction = {
        id: generateID(),
        text: text.value,
        amount: finalAmount
      };
      transactions.push(transaction);
    }

    updateLocalStorage();
    init();

    // Xóa trắng ô nhập liệu sau khi thêm
    text.value = '';
    amount.value = '';
    
    // Reset về mặc định là "Thu Nhập"
    document.querySelector('input[name="type"][value="income"]').checked = true;
  }
}

// 3. Hàm tạo ID ngẫu nhiên
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// 4. Hàm hiển thị giao dịch lên màn hình (DOM)
function addTransactionDOM(transaction) {
  // Xác định dấu + hay -
  const sign = transaction.amount < 0 ? '-' : '+';
  
  const item = document.createElement('li');

  // Thêm class 'plus' hoặc 'minus' dựa trên giá trị
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  // Định dạng số tiền có dấu phẩy (ví dụ: 100,000)
  const formattedAmount = Math.abs(transaction.amount).toLocaleString('vi-VN');

  item.innerHTML = `
    ${transaction.text} <span>${sign}${formattedAmount} đ</span>
    <button class="edit-btn" onclick="editTransaction(${transaction.id})">✏️</button>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;

  list.appendChild(item);
}

// 5. Hàm cập nhật số dư, tổng thu, tổng chi
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);

  // Tính tổng số dư
  const total = amounts.reduce((acc, item) => (acc += item), 0);

  // Tính tổng thu (số dương)
  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0);

  // Tính tổng chi (số âm)
  const expense = (
    amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  );

  // Cập nhật lên màn hình
  balance.innerText = `${total.toLocaleString('vi-VN')} đ`;
  money_plus.innerText = `+${income.toLocaleString('vi-VN')} đ`;
  money_minus.innerText = `-${expense.toLocaleString('vi-VN')} đ`;
}

// 6. Hàm xóa giao dịch
function removeTransaction(id) {
  if (confirm('Bạn có chắc muốn xóa giao dịch này?')) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    init();
  }
}

// 6.1. Hàm sửa giao dịch
function editTransaction(id) {
  const transaction = transactions.find(t => t.id === id);
  if (transaction) {
    // Điền thông tin vào form
    text.value = transaction.text;
    amount.value = Math.abs(transaction.amount).toLocaleString('en-US');
    
    // Chọn đúng loại giao dịch
    const type = transaction.amount < 0 ? 'expense' : 'income';
    document.querySelector(`input[name="type"][value="${type}"]`).checked = true;
    
    // Lưu ID đang chỉnh sửa
    editingId = id;
    
    // Đổi text nút
    document.querySelector('.btn').textContent = 'Cập Nhật';
    
    // Scroll lên form
    form.scrollIntoView({ behavior: 'smooth' });
  }
}

// 7. Hàm lưu vào LocalStorage
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// 8. Hàm khởi chạy ứng dụng
function init() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();

// Lắng nghe sự kiện bấm nút Thêm
form.addEventListener('submit', addTransaction);
